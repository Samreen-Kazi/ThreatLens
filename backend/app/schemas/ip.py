from pydantic import BaseModel


class IPInfoResponse(BaseModel):

    ip: str

    country: str

    organization: str

    asn: str | None

    hostname: str