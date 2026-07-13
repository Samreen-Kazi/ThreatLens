from pydantic import BaseModel, Field

from app.schemas.analysis import (
    AnalysisResponse,
)


class BulkCSVExportRequest(BaseModel):
    results: list[AnalysisResponse] = Field(
        default_factory=list
    )