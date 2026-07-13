import requests
from requests.exceptions import RequestException

from app.core.config import settings

import logging
logger = logging.getLogger(__name__)

BASE_URL = "https://api.shodan.io/shodan/host"


def query_shodan(ip: str):
    """
    Query Shodan for host information.
    """

    try:
        response = requests.get(
            f"{BASE_URL}/{ip}",
            params={"key": settings.SHODAN_API_KEY},
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        return {
            "ports": data.get("ports", []),
            "tags": data.get("tags", [])
        }

    except RequestException as e:
        logger.error("Shodan request failed for %s: %s", ip, e)

        return {
            "ports": [],
            "tags": []
        }