using PumpErp.Domain.Entities;

namespace PumpErp.Domain.Tests;

public sealed class SaleTests
{
    [Fact]
    public void RegisterPayment_ReducesBalanceAcrossInstallments()
    {
        var sale = new Sale
        {
            InvoiceNumber = "INV-TEST",
            CustomerId = Guid.NewGuid()
        };

        sale.AddItem(null, "Pump", 1, 10_000);

        sale.RegisterPayment(5_000);
        sale.RegisterPayment(2_000);
        sale.RegisterPayment(3_000);

        Assert.Equal(10_000, sale.PaidAmount);
        Assert.Equal(0, sale.BalanceAmount);
        Assert.Equal("paid", sale.Status);
    }

    [Fact]
    public void RegisterPayment_RejectsOverpayment()
    {
        var sale = new Sale
        {
            InvoiceNumber = "INV-TEST",
            CustomerId = Guid.NewGuid()
        };

        sale.AddItem(null, "Pump", 1, 10_000);

        Assert.Throws<InvalidOperationException>(() => sale.RegisterPayment(10_001));
    }
}
