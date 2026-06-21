using PumpErp.Application.Common.Interfaces;

namespace PumpErp.Infrastructure.Services;

public sealed class CodeGenerator : ICodeGenerator
{
    public string NewCustomerCode() => NewCode("CUS");
    public string NewSupplierCode() => NewCode("SUP");
    public string NewInvoiceNumber() => NewCode("INV");
    public string NewReceiptNumber() => NewCode("RCP");
    public string NewPumpCode() => NewCode("PMP");

    private static string NewCode(string prefix)
    {
        return $"{prefix}-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(100000, 999999)}";
    }
}
