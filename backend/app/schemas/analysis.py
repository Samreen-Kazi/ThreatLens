from pydantic import BaseModel

from app.schemas.summary import Summary
from app.schemas.ipinfo import IPInfoResponse
from app.schemas.abuseipdb import AbuseIPDBResponse
from app.schemas.virustotal import VirusTotalResponse
from app.schemas.greynoise import GreyNoiseResponse
from app.schemas.shodan import ShodanResponse


class Sources(BaseModel):
    ipinfo: IPInfoResponse
    abuseipdb: AbuseIPDBResponse
    virustotal: VirusTotalResponse
    greynoise: GreyNoiseResponse
    shodan: ShodanResponse


class AnalysisResponse(BaseModel):
    summary: Summary
    sources: Sources