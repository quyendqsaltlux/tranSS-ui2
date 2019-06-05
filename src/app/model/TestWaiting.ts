export interface TestWaiting {
  id: number;
  code: string;
  source: string;
  target: string;
  name: string;
  contact: string;
  testContents: string;
  tool: string;
  testInvitation: Date;
  testSending: Date;
  hbReceipt: Date;
  hbFiles: string;
  internalCheck: string;
  testEvaluation: string;
  comments: string;
  otherNote: string;
  attachment: string;
}
