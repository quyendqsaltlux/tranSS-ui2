export interface Payment {
  id: number;
  type: string;
  bankName: string;
  account: string;
  accountOwner: string;
  registrationNumber: string;
  visa: string;
  bankAddress: string;
  ownerAddress: string;
  swiftCode: string;
  payPal: string;
  iban: string;
  bankId: string;
  attachment: string;
}
