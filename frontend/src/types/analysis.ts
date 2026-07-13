export interface Summary {
  ip: string;
  country: string | null;
  organization: string | null;
  threat_score: number;
  risk_level: string;
  recommendation: string;
}

export interface IPInfo {
  ip: string;

  city: string | null;
  region: string | null;
  country: string | null;

  organization: string | null;
  asn: string | null;
  hostname: string | null;

  latitude: number | null;
  longitude: number | null;
}

export interface AbuseIPDB {
  abuse_confidence_score: number | null;
  total_reports: number | null;
  last_reported_at: string | null;
}

export interface VirusTotal {
  malicious: number | null;
  suspicious: number | null;
  harmless: number | null;
  undetected: number | null;
  reputation: number | null;
}

export interface GreyNoise {
  classification: string | null;
  name: string | null;
}

export interface Shodan {
  ports: number[];
  tags: string[];
}

export interface AnalysisSources {
  ipinfo: IPInfo;
  abuseipdb: AbuseIPDB;
  virustotal: VirusTotal;
  greynoise: GreyNoise;
  shodan: Shodan;
}

export interface AnalysisResponse {
  summary: Summary;
  sources: AnalysisSources;
}