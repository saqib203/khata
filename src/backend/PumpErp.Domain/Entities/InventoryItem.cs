using PumpErp.Domain.Common;
using PumpErp.Domain.Enums;

namespace PumpErp.Domain.Entities;

public sealed class InventoryItem : SoftDeletableEntity
{
    public string Sku { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public InventoryCategory Category { get; set; }
    public string Unit { get; set; } = "piece";
    public decimal QuantityOnHand { get; private set; }
    public decimal AverageCost { get; private set; }
    public decimal LowStockThreshold { get; set; }

    public bool IsLowStock => QuantityOnHand <= LowStockThreshold;

    public void Receive(decimal quantity, decimal unitCost)
    {
        if (quantity <= 0) throw new ArgumentOutOfRangeException(nameof(quantity));
        if (unitCost < 0) throw new ArgumentOutOfRangeException(nameof(unitCost));

        var currentValue = QuantityOnHand * AverageCost;
        var incomingValue = quantity * unitCost;
        QuantityOnHand += quantity;
        AverageCost = QuantityOnHand == 0 ? 0 : (currentValue + incomingValue) / QuantityOnHand;
    }

    public void Consume(decimal quantity)
    {
        if (quantity <= 0) throw new ArgumentOutOfRangeException(nameof(quantity));
        if (quantity > QuantityOnHand) throw new InvalidOperationException("Insufficient stock.");

        QuantityOnHand -= quantity;
    }
}
