using PumpErp.Domain.Common;

namespace PumpErp.Domain.Entities;

public sealed class PumpPart : AuditableEntity
{
    public Guid PumpId { get; set; }
    public Guid InventoryItemId { get; set; }
    public decimal Quantity { get; set; }
    public decimal UnitCost { get; set; }
    public decimal LineTotal { get; set; }
}
