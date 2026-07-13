from pydantic import BaseModel


class VirusTotalResponse(BaseModel):
    malicious: int | None = None
    suspicious: int | None = None
    harmless: int | None = None
    undetected: int | None = None
    reputation: int | None = None