export interface Project {
  id: number;
  no: string;
  requestDate: Date;
  dueDate: Date;
  dueTime: string;
  category: string;
  code: string;
  folderName: string;
  client: string;
  contents: string;
  reference: string;
  termbase: string;
  instruction: string;
  remark: string;
  totalVolume: string;
  unit: string;
  target: string;
  progressStatus: string;
  pmVtc: string;
  ho: Date;
  hb: Date;
  reviewSchedule: string;
  suggestedCandidate: string;
  finalDelivery: Date;
  company: string;
  pmCode: string;
  field: string;
}
