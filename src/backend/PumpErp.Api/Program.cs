using FluentValidation;
using MediatR;
using PumpErp.Api.Routes;
using PumpErp.Application.Common.Behaviors;
using PumpErp.Application.Customers;
using PumpErp.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddMediatR(configuration =>
{
    configuration.RegisterServicesFromAssembly(typeof(CreateCustomerCommand).Assembly);
    configuration.AddOpenBehavior(typeof(ValidationBehavior<,>));
});
builder.Services.AddValidatorsFromAssembly(typeof(CreateCustomerCommand).Assembly);
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddProblemDetails();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseExceptionHandler();
app.UseStatusCodePages();

var api = app.MapGroup("/api/v1");
api.MapCustomerRoutes();
api.MapSalesRoutes();
api.MapPaymentRoutes();
api.MapGet("/health", () => Results.Ok(new { status = "ok", service = "pumperp-api" }));

app.Run();
