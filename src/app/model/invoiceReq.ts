export interface InvoiceReq {
  id: number;
  company: string;
  dateOfInvoice: Date;
  bankName: string;
  account: string;
  depositor: string;
  swiftCode: string;
  payPal: string;
  email: string;
  mobile: string;
  address: string;
  resourceName: string;
  purchaseOrders?: number[];
  currency: string;
  total: number;
}
