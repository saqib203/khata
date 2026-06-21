using PumpErp.Domain.Common;

namespace PumpErp.Domain.Entities;

public sealed class SaleItem : AuditableEntity
{
    public Guid SaleId { get; set; }
    public Guid? PumpId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal LineTotal { get; set; }
}
