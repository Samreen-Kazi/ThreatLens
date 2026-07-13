from pydantic import BaseModel

from app.schemas.analysis import (
    AnalysisResponse,
)


class PDFReportRequest(BaseModel):
    analysis: AnalysisResponse