using FluentValidation;
using MediatR;
using PumpErp.Application.Common.Interfaces;
using PumpErp.Domain.Entities;

namespace PumpErp.Application.Sales;

public sealed record CreateSaleItemRequest(Guid? PumpId, string Description, decimal Quantity, decimal UnitPrice);

public sealed record CreateSaleCommand(
    Guid CustomerId,
    IReadOnlyCollection<CreateSaleItemRequest> Items,
    decimal Discount,
    string? Notes) : IRequest<Guid>;

public sealed class CreateSaleCommandValidator : AbstractValidator<CreateSaleCommand>
{
    public CreateSaleCommandValidator()
    {
        RuleFor(command => command.CustomerId).NotEmpty();
        RuleFor(command => command.Items).NotEmpty();
        RuleForEach(command => command.Items).ChildRules(item =>
        {
            item.RuleFor(value => value.Description).NotEmpty().MaximumLength(240);
            item.RuleFor(value => value.Quantity).GreaterThan(0);
            item.RuleFor(value => value.UnitPrice).GreaterThanOrEqualTo(0);
        });
        RuleFor(command => command.Discount).GreaterThanOrEqualTo(0);
    }
}

public sealed class CreateSaleCommandHandler(
    IRepository<Customer> customers,
    IRepository<Sale> sales,
    IRepository<LedgerEntry> ledgerEntries,
    ICodeGenerator codeGenerator,
    IUnitOfWork unitOfWork) : IRequestHandler<CreateSaleCommand, Guid>
{
    public async Task<Guid> Handle(CreateSaleCommand request, CancellationToken cancellationToken)
    {
        var customer = await customers.GetByIdAsync(request.CustomerId, cancellationToken)
            ?? throw new InvalidOperationException("Customer not found.");

        var sale = new Sale
        {
            InvoiceNumber = codeGenerator.NewInvoiceNumber(),
            CustomerId = customer.Id,
            Notes = request.Notes?.Trim()
        };

        foreach (var item in request.Items)
        {
            sale.AddItem(item.PumpId, item.Description.Trim(), item.Quantity, item.UnitPrice);
        }

        sale.ApplyDiscount(request.Discount);

        await sales.AddAsync(sale, cancellationToken);
        await ledgerEntries.AddAsync(new LedgerEntry
        {
            CustomerId = customer.Id,
            SaleId = sale.Id,
            Debit = sale.Total,
            Credit = 0,
            BalanceAfter = sale.Total,
            SourceType = "sale",
            SourceId = sale.Id,
            Description = $"Invoice {sale.InvoiceNumber}"
        }, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);
        return sale.Id;
    }
}
