import type {
  AnalysisResponse,
} from "./analysis";


export interface InvalidIPEntry {
  value: string;
  reason: string;
}


export interface BulkAnalysisResponse {
  filename: string;
  total_entries: number;
  valid_count: number;
  invalid_count: number;
  duplicate_count: number;
  results: AnalysisResponse[];
  invalid_entries: InvalidIPEntry[];
}