from pydantic import BaseModel, Field

from app.schemas.analysis import AnalysisResponse


class InvalidIPEntry(BaseModel):
    value: str
    reason: str


class BulkAnalysisResponse(BaseModel):
    filename: str
    total_entries: int
    valid_count: int
    invalid_count: int
    duplicate_count: int

    results: list[AnalysisResponse] = Field(
        default_factory=list
    )

    invalid_entries: list[InvalidIPEntry] = Field(
        default_factory=list
    )