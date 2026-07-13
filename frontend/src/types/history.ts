export interface HistoryEntry {
  id: number;
  ip: string;
  country: string | null;
  organization: string | null;
  threat_score: number;
  risk_level: string;
  created_at: string;
}