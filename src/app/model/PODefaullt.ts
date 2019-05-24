import {ProjectAssignmentReq} from './ProjectAssignmenReq';

export interface PODefaullt {
  id: number;
  code: string;
  currency: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  assignment: ProjectAssignmentReq;
}
