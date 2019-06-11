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
  abilityId: number;
  useCustomTask: boolean;

  wrep: number;
  w100: number;
  w99_95: number;
  w94_85: number;
  w84_75: number;
  wnoMatch: number;

  reprep: number;
  rep100: number;
  rep99_95: number;
  rep94_85: number;
  rep84_75: number;
  repnoMatch: number;
  /**
   * = reprep + rep100 + rep99_95 + rep94_85 + rep84_75 + repnoMatch
   */
  totalRep: number;
  /**
   * =(reprep*wrep)+(rep100*w100)+(rep99_95*w99_95)+(rep94_85*w94_85)+(rep84_75*w84_75)+(repnoMatch*wnoMatch) or user define
   */
  netOrHour: number;
  notAutoComputeNetHour: boolean;
  /**
   * = rate of Ability in case netOrHour > minimum volume. otherwise = rate2 of ability
   */
  unitPrice: number;
  /**
   * Total Money
   * = unitPrice * netOrHour
   */
  total: number;

  externalResource: boolean;
  externalResourceName: string;

  ability?: any;
  project?: any;
  progress?: any;
  invoiceId?: any;
  poId?: any;
}
