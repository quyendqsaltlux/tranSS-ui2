export interface ProjectAssignmentReq {
  id: number;
  candidateCode: string;
  projectId: number;
  task: string;
  status: string;
  updatedAt?: string;
  ho: string;
  hb: string;
}
