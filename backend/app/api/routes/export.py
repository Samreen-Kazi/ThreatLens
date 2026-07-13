from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.database.crud import (
    get_all_search_history,
)
from app.database.database import get_db
from app.schemas.csv_export import (
    BulkCSVExportRequest,
)
from app.services.csv_export_service import (
    create_bulk_results_csv,
    create_history_csv,
    generate_csv_filename,
)
from app.schemas.pdf_report import (
    PDFReportRequest,
)
from app.services.pdf_report_service import (
    create_analysis_pdf,
    generate_pdf_filename,
)

router = APIRouter()


@router.get("/export/history.csv")
def export_history_csv(
    database_session: Session = Depends(
        get_db
    ),
):
    history_entries = (
        get_all_search_history(
            database_session
        )
    )

    csv_content = create_history_csv(
        history_entries
    )

    filename = generate_csv_filename(
        "threatlens_history"
    )

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition":
                f'attachment; filename="{filename}"'
        },
    )


@router.post("/export/bulk.csv")
def export_bulk_csv(
    request: BulkCSVExportRequest,
):
    if not request.results:
        raise HTTPException(
            status_code=(
                status.HTTP_400_BAD_REQUEST
            ),
            detail=(
                "No bulk-analysis results "
                "were provided."
            ),
        )

    results = [
        result.model_dump()
        for result in request.results
    ]

    csv_content = (
        create_bulk_results_csv(
            results
        )
    )

    filename = generate_csv_filename(
        "threatlens_bulk_results"
    )

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition":
                f'attachment; filename="{filename}"'
        },
    )

@router.post(
    "/export/report.pdf",
    response_class=Response,
    responses={
        200: {
            "content": {
                "application/pdf": {}
            },
            "description": (
                "Generated ThreatLens "
                "investigation report."
            ),
        }
    },
)
def export_analysis_pdf(
    request: PDFReportRequest,
):
    analysis_data = (
        request.analysis.model_dump()
    )

    pdf_content = create_analysis_pdf(
        analysis_data
    )

    ip = (
        request.analysis.summary.ip
    )

    filename = generate_pdf_filename(
        ip
    )

    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                f'attachment; filename="{filename}"'
        },
    )
