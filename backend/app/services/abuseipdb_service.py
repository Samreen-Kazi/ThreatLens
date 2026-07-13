import requests
from requests.exceptions import RequestException

from app.core.config import settings

import logging
logger = logging.getLogger(__name__)

BASE_URL = "https://api.abuseipdb.com/api/v2/check"


def query_abuseipdb(ip: str):
    """
    Query AbuseIPDB for an IP address.
    """

    headers = {
        "Key": settings.ABUSEIPDB_API_KEY,
        "Accept": "application/json",
    }

    params = {
        "ipAddress": ip,
        "maxAgeInDays": 90,
    }

    try:
        response = requests.get(
            BASE_URL,
            headers=headers,
            params=params,
            timeout=10,
        )

        response.raise_for_status()

        data = response.json()["data"]

        return {
            "abuse_confidence_score": data.get("abuseConfidenceScore", 0),
            "total_reports": data.get("totalReports", 0),
            "last_reported_at": data.get("lastReportedAt"),
        }

    except RequestException as e:
        logger.error("AbuseIPDB request failed for %s: %s", ip, e)

        return {
            "abuse_confidence_score": None,
            "total_reports": None,
            "last_reported_at": None,
        }