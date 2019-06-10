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
  testResult: string;
  comments: string;
  otherNote: string;
  attachment: string;
  expectedRateRange: string;
  field: string;
  processStatus: string;
  catTool: string;
  isShortList: boolean;
  negotiationDate: Date;
  shortListDate: Date;
}
