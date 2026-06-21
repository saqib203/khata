using MediatR;
using PumpErp.Application.Payments;

namespace PumpErp.Api.Routes;

public static class PaymentRoutes
{
    public static RouteGroupBuilder MapPaymentRoutes(this RouteGroupBuilder api)
    {
        var group = api.MapGroup("/payments").WithTags("Payments");

        group.MapPost("/customer", async (
            RegisterCustomerPaymentCommand command,
            ISender sender,
            CancellationToken cancellationToken) =>
        {
            var id = await sender.Send(command, cancellationToken);
            return Results.Created($"/api/v1/payments/{id}", new { id });
        });

        return api;
    }
}
