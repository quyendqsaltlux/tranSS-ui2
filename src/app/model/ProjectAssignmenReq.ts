export interface ProjectAssignmentReq {
  id: number;
  candidateCode: string;
  projectId: number;
  projectCode: number;
  task: string;
  status: string;
  updatedAt?: string;
  ho: string;
  hb: string;
  source: string;
  target: string;
  total: number;
}
