from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.crud import (
    get_dashboard_analytics,
)
from app.database.database import get_db
from app.schemas.analytics import (
    AnalyticsResponse,
)


router = APIRouter()


@router.get(
    "/analytics",
    response_model=AnalyticsResponse,
)
def analytics(
    database_session: Session = Depends(
        get_db
    ),
):
    return get_dashboard_analytics(
        database_session=database_session,
    )