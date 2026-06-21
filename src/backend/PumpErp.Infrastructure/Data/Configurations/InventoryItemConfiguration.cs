using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PumpErp.Domain.Entities;

namespace PumpErp.Infrastructure.Data.Configurations;

public sealed class InventoryItemConfiguration : IEntityTypeConfiguration<InventoryItem>
{
    public void Configure(EntityTypeBuilder<InventoryItem> builder)
    {
        builder.ToTable("inventory_items");
        builder.HasKey(item => item.Id);
        builder.Property(item => item.Sku).HasMaxLength(80).IsRequired();
        builder.Property(item => item.Name).HasMaxLength(180).IsRequired();
        builder.Property(item => item.Category).HasConversion<string>().HasMaxLength(80);
        builder.Property(item => item.Unit).HasMaxLength(30);
        builder.Property(item => item.QuantityOnHand).HasPrecision(18, 3);
        builder.Property(item => item.AverageCost).HasPrecision(18, 2);
        builder.Property(item => item.LowStockThreshold).HasPrecision(18, 3);
        builder.HasIndex(item => item.Sku).IsUnique();
        builder.HasQueryFilter(item => item.DeletedAt == null);
    }
}
