using PumpErp.Domain.Common;

namespace PumpErp.Domain.Entities;

public sealed class Sale : SoftDeletableEntity
{
    public string InvoiceNumber { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public DateTimeOffset InvoiceDate { get; set; } = DateTimeOffset.UtcNow;
    public decimal Subtotal { get; private set; }
    public decimal Discount { get; private set; }
    public decimal Total { get; private set; }
    public decimal PaidAmount { get; private set; }
    public decimal BalanceAmount { get; private set; }
    public string Status { get; private set; } = "open";
    public string? Notes { get; set; }

    public ICollection<SaleItem> Items { get; } = [];
    public ICollection<Payment> Payments { get; } = [];

    public void AddItem(Guid? pumpId, string description, decimal quantity, decimal unitPrice)
    {
        if (quantity <= 0) throw new ArgumentOutOfRangeException(nameof(quantity));
        if (unitPrice < 0) throw new ArgumentOutOfRangeException(nameof(unitPrice));

        var lineTotal = quantity * unitPrice;
        Items.Add(new SaleItem
        {
            SaleId = Id,
            PumpId = pumpId,
            Description = description,
            Quantity = quantity,
            UnitPrice = unitPrice,
            LineTotal = lineTotal
        });
        Recalculate();
    }

    public void ApplyDiscount(decimal discount)
    {
        if (discount < 0) throw new ArgumentOutOfRangeException(nameof(discount));
        Discount = discount;
        Recalculate();
    }

    public void RegisterPayment(decimal amount)
    {
        if (amount <= 0) throw new ArgumentOutOfRangeException(nameof(amount));
        if (PaidAmount + amount > Total) throw new InvalidOperationException("Payment exceeds invoice balance.");

        PaidAmount += amount;
        SetBalance();
    }

    private void Recalculate()
    {
        Subtotal = Items.Sum(item => item.LineTotal);
        Total = Math.Max(0, Subtotal - Discount);
        if (PaidAmount > Total)
        {
            throw new InvalidOperationException("Discount cannot reduce total below paid amount.");
        }

        SetBalance();
    }

    private void SetBalance()
    {
        BalanceAmount = Total - PaidAmount;
        Status = BalanceAmount == 0 ? "paid" : PaidAmount == 0 ? "open" : "partial";
    }
}
