from pydantic import BaseModel


class IPInfoResponse(BaseModel):
    ip: str

    city: str | None = None
    region: str | None = None
    country: str | None = None

    organization: str | None = None
    asn: str | None = None
    hostname: str | None = None

    latitude: float | None = None
    longitude: float | None = None