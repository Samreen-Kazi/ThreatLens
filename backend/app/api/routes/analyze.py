from ipaddress import IPv4Address, IPv6Address

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.crud import save_search
from app.database.database import get_db
from app.schemas.analysis import AnalysisResponse
from app.services.analysis_engine import analyze_ip


router = APIRouter()


@router.get(
    "/analyze/{ip}",
    response_model=AnalysisResponse,
)
def analyze(
    ip: IPv4Address | IPv6Address,
    database_session: Session = Depends(get_db),
):
    ip_string = str(ip)

    analysis_result = analyze_ip(ip_string)

    save_search(
        database_session=database_session,
        analysis_result=analysis_result,
    )

    return analysis_result