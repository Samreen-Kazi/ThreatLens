from pydantic import BaseModel


class RiskDistribution(BaseModel):
    safe: int = 0
    low: int = 0
    medium: int = 0
    high: int = 0
    critical: int = 0


class AnalyticsResponse(BaseModel):
    total_searches: int
    average_threat_score: float
    high_risk_searches: int
    critical_searches: int

    top_country: str | None = None
    top_country_count: int = 0

    top_organization: str | None = None
    top_organization_count: int = 0

    risk_distribution: RiskDistribution