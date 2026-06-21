using PumpErp.Domain.Common;

namespace PumpErp.Domain.Entities;

public sealed class LedgerEntry : AuditableEntity
{
    public Guid? CustomerId { get; set; }
    public Guid? SupplierId { get; set; }
    public Guid? SaleId { get; set; }
    public Guid? PurchaseId { get; set; }
    public Guid? PaymentId { get; set; }
    public DateTimeOffset EntryDate { get; set; } = DateTimeOffset.UtcNow;
    public decimal Debit { get; set; }
    public decimal Credit { get; set; }
    public decimal BalanceAfter { get; set; }
    public string SourceType { get; set; } = string.Empty;
    public Guid SourceId { get; set; }
    public string Description { get; set; } = string.Empty;
}
