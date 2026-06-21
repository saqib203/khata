using MediatR;
using Microsoft.EntityFrameworkCore;
using PumpErp.Application.Common.Interfaces;
using PumpErp.Application.Customers;
using PumpErp.Domain.Entities;

namespace PumpErp.Api.Routes;

public static class CustomerRoutes
{
    public static RouteGroupBuilder MapCustomerRoutes(this RouteGroupBuilder api)
    {
        var group = api.MapGroup("/customers").WithTags("Customers");

        group.MapPost("/", async (CreateCustomerCommand command, ISender sender, CancellationToken cancellationToken) =>
        {
            var id = await sender.Send(command, cancellationToken);
            return Results.Created($"/api/v1/customers/{id}", new { id });
        });

        group.MapGet("/", async (
            string? search,
            IRepository<Customer> customers,
            CancellationToken cancellationToken) =>
        {
            var query = customers.Query().AsNoTracking();
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(customer =>
                    customer.Name.Contains(search) ||
                    customer.MobileNumber.Contains(search) ||
                    (customer.Cnic != null && customer.Cnic.Contains(search)));
            }

            var results = await query
                .OrderBy(customer => customer.Name)
                .Take(50)
                .Select(customer => new CustomerSummaryDto(
                    customer.Id,
                    customer.CustomerCode,
                    customer.Name,
                    customer.MobileNumber,
                    customer.City,
                    customer.Status,
                    customer.LedgerEntries.Sum(entry => entry.Debit - entry.Credit)))
                .ToListAsync(cancellationToken);

            return Results.Ok(results);
        });

        group.MapGet("/{id:guid}/profile", async (
            Guid id,
            IRepository<Customer> customers,
            CancellationToken cancellationToken) =>
        {
            var profile = await customers.Query()
                .AsNoTracking()
                .Where(customer => customer.Id == id)
                .Select(customer => new CustomerProfileDto(
                    customer.Id,
                    customer.CustomerCode,
                    customer.Name,
                    customer.MobileNumber,
                    customer.WhatsAppNumber,
                    customer.Cnic,
                    customer.Address,
                    customer.City,
                    customer.RegisteredAt,
                    customer.Sales.Sum(sale => sale.Total),
                    customer.Payments.Sum(payment => payment.Amount),
                    customer.LedgerEntries.Sum(entry => entry.Debit - entry.Credit),
                    customer.Pumps.Count,
                    customer.LedgerEntries.Max(entry => (DateTimeOffset?)entry.EntryDate),
                    customer.Payments.Max(payment => (DateTimeOffset?)payment.PaidAt)))
                .FirstOrDefaultAsync(cancellationToken);

            return profile is null ? Results.NotFound() : Results.Ok(profile);
        });

        return api;
    }
}
