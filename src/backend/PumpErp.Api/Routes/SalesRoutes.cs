using MediatR;
using PumpErp.Application.Sales;

namespace PumpErp.Api.Routes;

public static class SalesRoutes
{
    public static RouteGroupBuilder MapSalesRoutes(this RouteGroupBuilder api)
    {
        var group = api.MapGroup("/sales").WithTags("Sales");

        group.MapPost("/", async (CreateSaleCommand command, ISender sender, CancellationToken cancellationToken) =>
        {
            var id = await sender.Send(command, cancellationToken);
            return Results.Created($"/api/v1/sales/{id}", new { id });
        });

        return api;
    }
}
