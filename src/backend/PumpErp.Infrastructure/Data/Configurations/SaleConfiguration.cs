using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PumpErp.Domain.Entities;

namespace PumpErp.Infrastructure.Data.Configurations;

public sealed class SaleConfiguration : IEntityTypeConfiguration<Sale>
{
    public void Configure(EntityTypeBuilder<Sale> builder)
    {
        builder.ToTable("sales");
        builder.HasKey(sale => sale.Id);
        builder.Property(sale => sale.InvoiceNumber).HasMaxLength(60).IsRequired();
        builder.Property(sale => sale.Subtotal).HasPrecision(18, 2);
        builder.Property(sale => sale.Discount).HasPrecision(18, 2);
        builder.Property(sale => sale.Total).HasPrecision(18, 2);
        builder.Property(sale => sale.PaidAmount).HasPrecision(18, 2);
        builder.Property(sale => sale.BalanceAmount).HasPrecision(18, 2);
        builder.Property(sale => sale.Status).HasMaxLength(30);
        builder.HasMany(sale => sale.Items).WithOne().HasForeignKey(item => item.SaleId);
        builder.HasIndex(sale => sale.InvoiceNumber).IsUnique();
        builder.HasQueryFilter(sale => sale.DeletedAt == null);
    }
}
