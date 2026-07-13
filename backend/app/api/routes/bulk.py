from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.bulk_analysis import (
    BulkAnalysisResponse,
)
from app.services.bulk_analysis_service import (
    process_bulk_ip_file,
)


router = APIRouter()


ALLOWED_CONTENT_TYPES = {
    "text/plain",
    "application/octet-stream",
}


@router.post(
    "/analyze/bulk",
    response_model=BulkAnalysisResponse,
)
async def analyze_bulk_file(
    file: UploadFile = File(...),
    database_session: Session = Depends(
        get_db
    ),
):
    filename = file.filename or "uploaded.txt"

    if not filename.lower().endswith(".txt"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Only .txt files are supported."
            ),
        )

    if (
        file.content_type
        and file.content_type
        not in ALLOWED_CONTENT_TYPES
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "The uploaded file must be "
                "plain text."
            ),
        )

    file_bytes = await file.read()

    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty.",
        )

    if len(file_bytes) > 100_000:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=(
                "The uploaded file is too large."
            ),
        )

    try:
        file_content = file_bytes.decode(
            "utf-8"
        )

    except UnicodeDecodeError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "The file must use UTF-8 "
                "text encoding."
            ),
        ) from error

    try:
        return process_bulk_ip_file(
            filename=filename,
            file_content=file_content,
            database_session=database_session,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error