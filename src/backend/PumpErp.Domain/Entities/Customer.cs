using PumpErp.Domain.Common;
using PumpErp.Domain.Enums;

namespace PumpErp.Domain.Entities;

public sealed class Customer : SoftDeletableEntity
{
    public string CustomerCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string? WhatsAppNumber { get; set; }
    public string? Cnic { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Notes { get; set; }
    public CustomerStatus Status { get; set; } = CustomerStatus.Active;
    public DateTimeOffset RegisteredAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<Sale> Sales { get; } = [];
    public ICollection<Payment> Payments { get; } = [];
    public ICollection<LedgerEntry> LedgerEntries { get; } = [];
    public ICollection<Pump> Pumps { get; } = [];
}
