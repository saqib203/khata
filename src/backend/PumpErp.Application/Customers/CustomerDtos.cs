using PumpErp.Domain.Enums;

namespace PumpErp.Application.Customers;

public sealed record CustomerSummaryDto(
    Guid Id,
    string CustomerCode,
    string Name,
    string MobileNumber,
    string? City,
    CustomerStatus Status,
    decimal OutstandingBalance);

public sealed record CustomerProfileDto(
    Guid Id,
    string CustomerCode,
    string Name,
    string MobileNumber,
    string? WhatsAppNumber,
    string? Cnic,
    string? Address,
    string? City,
    DateTimeOffset RegisteredAt,
    decimal TotalSales,
    decimal TotalPaymentsReceived,
    decimal OutstandingBalance,
    int TotalPumpsPurchased,
    DateTimeOffset? LastTransactionDate,
    DateTimeOffset? LastPaymentDate);
