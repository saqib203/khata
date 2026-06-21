using PumpErp.Domain.Entities;
using PumpErp.Domain.Enums;

namespace PumpErp.Domain.Tests;

public sealed class InventoryItemTests
{
    [Fact]
    public void Consume_RejectsInsufficientStock()
    {
        var item = new InventoryItem
        {
            Sku = "BRG-001",
            Name = "Bearing",
            Category = InventoryCategory.Bearing
        };

        item.Receive(2, 500);

        Assert.Throws<InvalidOperationException>(() => item.Consume(3));
    }

    [Fact]
    public void Receive_UpdatesWeightedAverageCost()
    {
        var item = new InventoryItem
        {
            Sku = "MTR-001",
            Name = "Motor",
            Category = InventoryCategory.Motor
        };

        item.Receive(2, 1_000);
        item.Receive(2, 2_000);

        Assert.Equal(4, item.QuantityOnHand);
        Assert.Equal(1_500, item.AverageCost);
    }
}
