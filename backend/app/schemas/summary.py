from pydantic import BaseModel


class Summary(BaseModel):
    ip: str
    country: str | None = None
    organization: str | None = None

    threat_score: int

    risk_level: str

    recommendation: str