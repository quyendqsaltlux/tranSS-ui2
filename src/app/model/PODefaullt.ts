import {ProjectAssignmentReq} from './ProjectAssignmenReq';

export interface PODefault {
  id: number;
  code: string;
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  assignment: ProjectAssignmentReq;
}
