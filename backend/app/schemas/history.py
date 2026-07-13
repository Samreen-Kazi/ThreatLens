from datetime import datetime

from pydantic import BaseModel, ConfigDict


class HistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ip: str
    country: str | None = None
    organization: str | None = None
    threat_score: int
    risk_level: str
    created_at: datetime