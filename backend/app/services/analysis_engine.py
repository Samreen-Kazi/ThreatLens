import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Callable

from app.services.abuseipdb_service import query_abuseipdb
from app.services.cache_service import (
    cache_analysis,
    get_cached_analysis,
)
from app.services.greynoise_service import query_greynoise
from app.services.ipinfo_service import query_ipinfo
from app.services.recommendation_service import generate_recommendation
from app.services.risk_service import calculate_risk_level
from app.services.shodan_service import query_shodan
from app.services.threat_score_service import calculate_threat_score
from app.services.virustotal_service import query_virustotal


logger = logging.getLogger(__name__)


ServiceFunction = Callable[[str], dict]


def safe_execute(
    service_name: str,
    service_function: ServiceFunction,
    ip: str,
) -> tuple[str, dict]:
    """
    Run one external service safely.

    Returning the service name allows us to identify which
    concurrent task produced each result.
    """

    try:
        result = service_function(ip)
        return service_name, result

    except Exception as error:
        logger.exception(
            "%s failed while analyzing %s",
            service_name,
            ip,
        )

        return service_name, {
            "error": str(error),
        }


def analyze_ip(ip: str) -> dict:
    """
    Analyze an IP using all threat-intelligence sources concurrently.
    """

    cached_result = get_cached_analysis(ip)

    if cached_result is not None:
        return cached_result

    logger.info("Starting concurrent analysis for IP %s", ip)

    services: dict[str, ServiceFunction] = {
        "ipinfo": query_ipinfo,
        "abuseipdb": query_abuseipdb,
        "virustotal": query_virustotal,
        "greynoise": query_greynoise,
        "shodan": query_shodan,
    }

    results: dict[str, dict] = {}

    with ThreadPoolExecutor(
        max_workers=len(services),
        thread_name_prefix="threat-intel",
    ) as executor:

        future_to_service = {
            executor.submit(
                safe_execute,
                service_name,
                service_function,
                ip,
            ): service_name
            for service_name, service_function in services.items()
        }

        for future in as_completed(future_to_service):
            service_name = future_to_service[future]

            try:
                returned_name, result = future.result()
                results[returned_name] = result

                logger.info(
                    "%s completed for IP %s",
                    returned_name,
                    ip,
                )

            except Exception as error:
                logger.exception(
                    "Unexpected concurrent failure in %s for IP %s",
                    service_name,
                    ip,
                )

                results[service_name] = {
                    "error": str(error),
                }

    ipinfo = results.get(
        "ipinfo",
        {
            "ip": ip,
            "city": None,
            "region": None,
            "country": None,
            "organization": None,
            "asn": None,
            "hostname": None,
            "latitude": None,
            "longitude": None,
        },
    )

    abuseipdb = results.get(
        "abuseipdb",
        {
            "abuse_confidence_score": None,
            "total_reports": None,
            "last_reported_at": None,
        },
    )

    virustotal = results.get(
        "virustotal",
        {
            "malicious": None,
            "suspicious": None,
            "harmless": None,
            "undetected": None,
            "reputation": None,
        },
    )

    greynoise = results.get(
        "greynoise",
        {
            "classification": "Error",
            "name": "Unknown",
        },
    )

    shodan = results.get(
        "shodan",
        {
            "ports": [],
            "tags": [],
        },
    )

    threat_score = calculate_threat_score(
        abuseipdb,
        virustotal,
        greynoise,
        shodan,
    )

    risk_level = calculate_risk_level(threat_score)

    recommendation = generate_recommendation(risk_level)

    analysis_result = {
        "summary": {
            "ip": ip,
            "country": ipinfo.get("country"),
            "organization": ipinfo.get("organization"),
            "threat_score": threat_score,
            "risk_level": risk_level,
            "recommendation": recommendation,
        },
        "sources": {
            "ipinfo": ipinfo,
            "abuseipdb": abuseipdb,
            "virustotal": virustotal,
            "greynoise": greynoise,
            "shodan": shodan,
        },
    }

    cache_analysis(
        ip=ip,
        analysis_result=analysis_result,
    )

    logger.info(
        "Completed concurrent analysis for %s with score %s and risk level %s",
        ip,
        threat_score,
        risk_level,
    )

    return analysis_result