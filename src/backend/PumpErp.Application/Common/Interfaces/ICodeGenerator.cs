namespace PumpErp.Application.Common.Interfaces;

public interface ICodeGenerator
{
    string NewCustomerCode();
    string NewSupplierCode();
    string NewInvoiceNumber();
    string NewReceiptNumber();
    string NewPumpCode();
}
