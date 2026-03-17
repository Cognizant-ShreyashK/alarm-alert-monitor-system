export interface Alarm {
  id: number;
  code: string;
  message: string;
  severity: string;
  isAcknowledged: boolean;
}