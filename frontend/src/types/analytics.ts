export interface RiskDistribution {
  safe: number;
  low: number;
  medium: number;
  high: number;
  critical: number;
}


export interface DashboardAnalytics {
  total_searches: number;
  average_threat_score: number;
  high_risk_searches: number;
  critical_searches: number;

  top_country: string | null;
  top_country_count: number;

  top_organization: string | null;
  top_organization_count: number;

  risk_distribution: RiskDistribution;
}
