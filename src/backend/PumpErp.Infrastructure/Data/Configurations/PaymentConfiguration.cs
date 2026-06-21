using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PumpErp.Domain.Entities;

namespace PumpErp.Infrastructure.Data.Configurations;

public sealed class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("payments");
        builder.HasKey(payment => payment.Id);
        builder.Property(payment => payment.ReceiptNumber).HasMaxLength(60).IsRequired();
        builder.Property(payment => payment.Amount).HasPrecision(18, 2);
        builder.Property(payment => payment.Method).HasConversion<string>().HasMaxLength(40);
        builder.Property(payment => payment.Direction).HasConversion<string>().HasMaxLength(20);
        builder.HasIndex(payment => payment.ReceiptNumber).IsUnique();
        builder.HasQueryFilter(payment => payment.DeletedAt == null);
    }
}
