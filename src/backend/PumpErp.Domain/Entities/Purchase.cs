using PumpErp.Domain.Common;

namespace PumpErp.Domain.Entities;

public sealed class Purchase : SoftDeletableEntity
{
    public string PurchaseNumber { get; set; } = string.Empty;
    public Guid SupplierId { get; set; }
    public DateTimeOffset PurchaseDate { get; set; } = DateTimeOffset.UtcNow;
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal Total { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal BalanceAmount => Total - PaidAmount;
    public string Status => BalanceAmount == 0 ? "paid" : PaidAmount == 0 ? "open" : "partial";
    public string? Notes { get; set; }
}
