from ipaddress import IPv4Address, IPv6Address

from fastapi import APIRouter

from app.schemas.ipinfo import IPInfoResponse
from app.services.ipinfo_service import query_ipinfo


router = APIRouter()


@router.get(
    "/ipinfo/{ip}",
    response_model=IPInfoResponse,
)
def get_ip_info(
    ip: IPv4Address | IPv6Address,
):
    return query_ipinfo(str(ip))