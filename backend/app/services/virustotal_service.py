import requests
from requests.exceptions import RequestException

from app.core.config import settings

import logging
logger = logging.getLogger(__name__)



BASE_URL = "https://www.virustotal.com/api/v3/ip_addresses"


def query_virustotal(ip: str):
    """
    Query VirusTotal for IP reputation and analysis statistics.
    """

    headers = {
        "x-apikey": settings.VIRUSTOTAL_API_KEY
    }

    try:
        response = requests.get(
            f"{BASE_URL}/{ip}",
            headers=headers,
            timeout=10
        )

        response.raise_for_status()

        attributes = response.json()["data"]["attributes"]
        stats = attributes["last_analysis_stats"]

        return {
            "malicious": stats.get("malicious", 0),
            "suspicious": stats.get("suspicious", 0),
            "harmless": stats.get("harmless", 0),
            "undetected": stats.get("undetected", 0),
            "reputation": attributes.get("reputation", 0)
        }

    except RequestException as e:
        logger.error("VirusTotal request failed for %s: %s", ip, e)

        return {
            "malicious": None,
            "suspicious": None,
            "harmless": None,
            "undetected": None,
            "reputation": None
        }