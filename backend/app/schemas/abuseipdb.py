from pydantic import BaseModel


class AbuseIPDBResponse(BaseModel):
    abuse_confidence_score: int | None = None
    total_reports: int | None = None
    last_reported_at: str | None = None