export interface CandidateAbility {
  id: number;
  sourceLanguage: string;
  targetLanguage: string;
  projectType: string;
  task: string;
  rate: string;
  rateUnit: string;
  rate2: string;
  rate2unit: string;
  minimumCharge: string;
  minimumVolum: string;
  wrep: number;
  w100: number;
  w99_95: number;
  w94_85: number;
  w84_75: number;
  wnoMatch: number;
  candidateId: number;
  dailyCapacity: string;
  note: string;
}
