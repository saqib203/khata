using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PumpErp.Domain.Entities;

namespace PumpErp.Infrastructure.Data.Configurations;

public sealed class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("customers");
        builder.HasKey(customer => customer.Id);
        builder.Property(customer => customer.CustomerCode).HasMaxLength(40).IsRequired();
        builder.Property(customer => customer.Name).HasMaxLength(180).IsRequired();
        builder.Property(customer => customer.MobileNumber).HasMaxLength(40).IsRequired();
        builder.Property(customer => customer.WhatsAppNumber).HasMaxLength(40);
        builder.Property(customer => customer.Cnic).HasMaxLength(30);
        builder.Property(customer => customer.City).HasMaxLength(120);
        builder.Property(customer => customer.Status).HasConversion<string>().HasMaxLength(30);
        builder.HasIndex(customer => customer.CustomerCode).IsUnique();
        builder.HasQueryFilter(customer => customer.DeletedAt == null);
    }
}
