using FluentValidation;
using MediatR;
using PumpErp.Application.Common.Interfaces;
using PumpErp.Domain.Entities;

namespace PumpErp.Application.Customers;

public sealed record CreateCustomerCommand(
    string Name,
    string MobileNumber,
    string? WhatsAppNumber,
    string? Cnic,
    string? Address,
    string? City,
    string? Notes) : IRequest<Guid>;

public sealed class CreateCustomerCommandValidator : AbstractValidator<CreateCustomerCommand>
{
    public CreateCustomerCommandValidator()
    {
        RuleFor(command => command.Name).NotEmpty().MaximumLength(180);
        RuleFor(command => command.MobileNumber).NotEmpty().MaximumLength(40);
        RuleFor(command => command.WhatsAppNumber).MaximumLength(40);
        RuleFor(command => command.Cnic).MaximumLength(30);
        RuleFor(command => command.City).MaximumLength(120);
    }
}

public sealed class CreateCustomerCommandHandler(
    IRepository<Customer> customers,
    ICodeGenerator codeGenerator,
    IUnitOfWork unitOfWork) : IRequestHandler<CreateCustomerCommand, Guid>
{
    public async Task<Guid> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
    {
        var duplicateMobile = await customers.AnyAsync(
            customer => customer.MobileNumber == request.MobileNumber && customer.DeletedAt == null,
            cancellationToken);

        if (duplicateMobile)
        {
            throw new InvalidOperationException("A customer with this mobile number already exists.");
        }

        var customer = new Customer
        {
            CustomerCode = codeGenerator.NewCustomerCode(),
            Name = request.Name.Trim(),
            MobileNumber = request.MobileNumber.Trim(),
            WhatsAppNumber = request.WhatsAppNumber?.Trim(),
            Cnic = request.Cnic?.Trim(),
            Address = request.Address?.Trim(),
            City = request.City?.Trim(),
            Notes = request.Notes?.Trim()
        };

        await customers.AddAsync(customer, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return customer.Id;
    }
}
