using PumpErp.Domain.Common;

namespace PumpErp.Domain.Entities;

public sealed class Supplier : SoftDeletableEntity
{
    public string SupplierCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string? WhatsAppNumber { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public DateTimeOffset RegisteredAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<Purchase> Purchases { get; } = [];
    public ICollection<Payment> Payments { get; } = [];
    public ICollection<LedgerEntry> LedgerEntries { get; } = [];
}
