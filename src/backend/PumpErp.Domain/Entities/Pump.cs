using PumpErp.Domain.Common;
using PumpErp.Domain.Enums;

namespace PumpErp.Domain.Entities;

public sealed class Pump : SoftDeletableEntity
{
    public string PumpCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string PumpType { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
    public Guid? SupplierId { get; set; }
    public decimal LaborCost { get; set; }
    public decimal MaterialCost { get; private set; }
    public decimal SalePrice { get; set; }
    public PumpStatus Status { get; private set; } = PumpStatus.Pending;
    public DateOnly StartDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow);
    public DateOnly? CompletionDate { get; private set; }
    public string? Notes { get; set; }

    public ICollection<PumpPart> Parts { get; } = [];

    public decimal TotalCost => MaterialCost + LaborCost;
    public decimal Profit => SalePrice - TotalCost;

    public void AddPart(Guid inventoryItemId, decimal quantity, decimal unitCost)
    {
        var lineTotal = quantity * unitCost;
        Parts.Add(new PumpPart
        {
            PumpId = Id,
            InventoryItemId = inventoryItemId,
            Quantity = quantity,
            UnitCost = unitCost,
            LineTotal = lineTotal
        });
        MaterialCost += lineTotal;
    }

    public void ChangeStatus(PumpStatus status, DateOnly? completionDate = null)
    {
        Status = status;
        if (status is PumpStatus.Ready or PumpStatus.Delivered)
        {
            CompletionDate = completionDate ?? DateOnly.FromDateTime(DateTime.UtcNow);
        }
    }
}
