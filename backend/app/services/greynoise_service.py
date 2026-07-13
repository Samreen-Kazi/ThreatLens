import requests
from requests.exceptions import RequestException

from app.core.config import settings

import logging
logger = logging.getLogger(__name__)

BASE_URL = "https://api.greynoise.io/v3/community"


def query_greynoise(ip: str):
    """
    Query GreyNoise Community API.
    """

    headers = {
        "key": settings.GREYNOISE_API_KEY
    }

    try:
        response = requests.get(
            f"{BASE_URL}/{ip}",
            headers=headers,
            timeout=10
        )

        if response.status_code == 404:
            return {
                "classification": "Not Seen",
                "name": "Unknown"
            }

        if response.status_code == 429:
            return {
                "classification": "Rate Limited",
                "name": "Try Again Later"
            }

        response.raise_for_status()

        data = response.json()

        return {
            "classification": data.get("classification", "Unknown").capitalize(),
            "name": data.get("name", "Unknown")
        }

    except RequestException as e:
        logger.error("GreyNoise request failed for %s: %s", ip, e)

        return {
            "classification": "Error",
            "name": "Error"
        }