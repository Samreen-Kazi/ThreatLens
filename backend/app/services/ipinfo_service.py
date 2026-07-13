import logging
import re

import pycountry
import requests
from requests.exceptions import RequestException

from app.core.config import settings


logger = logging.getLogger(__name__)

BASE_URL = "https://ipinfo.io"


def get_country_name(
    country_code: str,
) -> str:
    try:
        country = pycountry.countries.get(
            alpha_2=country_code,
        )

        if country:
            return country.name

        return "Unknown"

    except Exception:
        logger.exception(
            "Failed to convert country code: %s",
            country_code,
        )

        return "Unknown"


def extract_asn(
    organization: str,
) -> str | None:
    match = re.search(
        r"(AS\d+)",
        organization,
    )

    return match.group(1) if match else None


def extract_coordinates(
    location: str | None,
) -> tuple[float | None, float | None]:
    if not location:
        return None, None

    try:
        latitude_text, longitude_text = (
            location.split(",", maxsplit=1)
        )

        return (
            float(latitude_text),
            float(longitude_text),
        )

    except (TypeError, ValueError):
        logger.warning(
            "Unable to parse IPInfo coordinates: %s",
            location,
        )

        return None, None


def empty_ipinfo_result(
    ip: str,
) -> dict:
    return {
        "ip": ip,
        "city": None,
        "region": None,
        "country": None,
        "organization": None,
        "asn": None,
        "hostname": None,
        "latitude": None,
        "longitude": None,
    }


def query_ipinfo(
    ip: str,
) -> dict:
    """
    Query IPInfo for geographic and network data.
    """

    try:
        response = requests.get(
            f"{BASE_URL}/{ip}",
            params={
                "token": settings.IPINFO_TOKEN,
            },
            timeout=10,
        )

        response.raise_for_status()

        data = response.json()

        organization = data.get(
            "org",
            "Unknown",
        )

        asn = extract_asn(
            organization,
        )

        if asn:
            organization = organization.replace(
                asn,
                "",
            ).strip()

        latitude, longitude = (
            extract_coordinates(
                data.get("loc")
            )
        )

        return {
            "ip": ip,
            "city": data.get("city"),
            "region": data.get("region"),
            "country": get_country_name(
                data.get("country", "")
            ),
            "organization": organization,
            "asn": asn,
            "hostname": data.get(
                "hostname",
                "Unknown",
            ),
            "latitude": latitude,
            "longitude": longitude,
        }

    except RequestException:
        logger.exception(
            "IPInfo request failed for %s",
            ip,
        )

        return empty_ipinfo_result(ip)

    except (
        KeyError,
        TypeError,
        ValueError,
    ):
        logger.exception(
            "IPInfo returned invalid data for %s",
            ip,
        )

        return empty_ipinfo_result(ip)