using FluentValidation;
using MediatR;
using PumpErp.Application.Common.Interfaces;
using PumpErp.Domain.Entities;
using PumpErp.Domain.Enums;

namespace PumpErp.Application.Payments;

public sealed record RegisterCustomerPaymentCommand(
    Guid CustomerId,
    Guid? SaleId,
    decimal Amount,
    PaymentMethod Method,
    DateTimeOffset PaidAt,
    string? Notes) : IRequest<Guid>;

public sealed class RegisterCustomerPaymentCommandValidator : AbstractValidator<RegisterCustomerPaymentCommand>
{
    public RegisterCustomerPaymentCommandValidator()
    {
        RuleFor(command => command.CustomerId).NotEmpty();
        RuleFor(command => command.Amount).GreaterThan(0);
        RuleFor(command => command.Method).IsInEnum();
    }
}

public sealed class RegisterCustomerPaymentCommandHandler(
    IRepository<Customer> customers,
    IRepository<Sale> sales,
    IRepository<Payment> payments,
    IRepository<LedgerEntry> ledgerEntries,
    ICodeGenerator codeGenerator,
    IUnitOfWork unitOfWork) : IRequestHandler<RegisterCustomerPaymentCommand, Guid>
{
    public async Task<Guid> Handle(RegisterCustomerPaymentCommand request, CancellationToken cancellationToken)
    {
        var customer = await customers.GetByIdAsync(request.CustomerId, cancellationToken)
            ?? throw new InvalidOperationException("Customer not found.");

        Sale? sale = null;
        if (request.SaleId.HasValue)
        {
            sale = await sales.GetByIdAsync(request.SaleId.Value, cancellationToken)
                ?? throw new InvalidOperationException("Sale not found.");
            sale.RegisterPayment(request.Amount);
            sales.Update(sale);
        }

        var payment = new Payment
        {
            ReceiptNumber = codeGenerator.NewReceiptNumber(),
            CustomerId = customer.Id,
            SaleId = request.SaleId,
            Amount = request.Amount,
            Method = request.Method,
            Direction = PaymentDirection.Received,
            PaidAt = request.PaidAt,
            Notes = request.Notes?.Trim()
        };

        await payments.AddAsync(payment, cancellationToken);
        await ledgerEntries.AddAsync(new LedgerEntry
        {
            CustomerId = customer.Id,
            SaleId = request.SaleId,
            PaymentId = payment.Id,
            Debit = 0,
            Credit = payment.Amount,
            BalanceAfter = sale?.BalanceAmount ?? 0,
            SourceType = "customer_payment",
            SourceId = payment.Id,
            Description = $"Receipt {payment.ReceiptNumber}"
        }, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);
        return payment.Id;
    }
}
