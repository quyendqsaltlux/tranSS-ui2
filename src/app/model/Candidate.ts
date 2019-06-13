import {Payment} from './Payment';

export interface Candidate {
  name: string;
  dateOfBirth: string;
  personalId: string;
  gender: string;
  country: string;
  address: string;
  email: string;
  email2: string;
  mobile: string;
  messenger: string;
  socialpages: string;
  skype: string;
  code: string;
  type: string;
  catTool: string;
  dailyCapacity: string;
  majorField: string;
  payment: Payment;
  defaultCurrency: string;
  diploma: string;
  nativeLanguage: string;
  cv: string;
  availableTime: string;
  registerDate: string;
  remark: string;
  grade: string;
  education: string;
  attachments: string[];
  abilities: any[];
  currency: string;
}
