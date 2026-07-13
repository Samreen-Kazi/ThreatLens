from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.crud import get_search_history
from app.database.database import get_db
from app.schemas.history import HistoryResponse


router = APIRouter()


@router.get(
    "/history",
    response_model=list[HistoryResponse],
)
def history(
    limit: int = Query(
        default=50,
        ge=1,
        le=100,
    ),
    database_session: Session = Depends(get_db),
):
    return get_search_history(
        database_session=database_session,
        limit=limit,
    )