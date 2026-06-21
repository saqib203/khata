using PumpErp.Domain.Common;
using PumpErp.Domain.Enums;

namespace PumpErp.Domain.Entities;

public sealed class Payment : SoftDeletableEntity
{
    public string ReceiptNumber { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
    public Guid? SupplierId { get; set; }
    public Guid? SaleId { get; set; }
    public Guid? PurchaseId { get; set; }
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public PaymentDirection Direction { get; set; }
    public DateTimeOffset PaidAt { get; set; } = DateTimeOffset.UtcNow;
    public string? Notes { get; set; }
}
