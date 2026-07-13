import csv
import io
from datetime import datetime
from typing import Any

from app.database.models import SearchHistory


def create_history_csv(
    history_entries: list[SearchHistory],
) -> str:
    """
    Convert database history rows into CSV text.
    """

    output = io.StringIO()

    fieldnames = [
        "id",
        "ip",
        "country",
        "organization",
        "threat_score",
        "risk_level",
        "created_at",
    ]

    writer = csv.DictWriter(
        output,
        fieldnames=fieldnames,
    )

    writer.writeheader()

    for entry in history_entries:
        writer.writerow(
            {
                "id": entry.id,
                "ip": entry.ip,
                "country": entry.country or "",
                "organization":
                    entry.organization or "",
                "threat_score":
                    entry.threat_score,
                "risk_level":
                    entry.risk_level,
                "created_at":
                    entry.created_at.isoformat(),
            }
        )

    return output.getvalue()


def create_bulk_results_csv(
    results: list[dict[str, Any]],
) -> str:
    """
    Convert bulk-analysis results into CSV text.
    """

    output = io.StringIO()

    fieldnames = [
        "ip",
        "country",
        "organization",
        "asn",
        "hostname",
        "threat_score",
        "risk_level",
        "recommendation",
        "abuse_confidence_score",
        "total_reports",
        "last_reported_at",
        "vt_malicious",
        "vt_suspicious",
        "vt_harmless",
        "vt_undetected",
        "vt_reputation",
        "greynoise_classification",
        "greynoise_name",
        "shodan_ports",
        "shodan_tags",
    ]

    writer = csv.DictWriter(
        output,
        fieldnames=fieldnames,
    )

    writer.writeheader()

    for analysis in results:
        summary = analysis.get(
            "summary",
            {},
        )

        sources = analysis.get(
            "sources",
            {},
        )

        ipinfo = sources.get(
            "ipinfo",
            {},
        )

        abuseipdb = sources.get(
            "abuseipdb",
            {},
        )

        virustotal = sources.get(
            "virustotal",
            {},
        )

        greynoise = sources.get(
            "greynoise",
            {},
        )

        shodan = sources.get(
            "shodan",
            {},
        )

        writer.writerow(
            {
                "ip":
                    summary.get("ip", ""),
                "country":
                    summary.get(
                        "country",
                        "",
                    ),
                "organization":
                    summary.get(
                        "organization",
                        "",
                    ),
                "asn":
                    ipinfo.get(
                        "asn",
                        "",
                    ),
                "hostname":
                    ipinfo.get(
                        "hostname",
                        "",
                    ),
                "threat_score":
                    summary.get(
                        "threat_score",
                        0,
                    ),
                "risk_level":
                    summary.get(
                        "risk_level",
                        "",
                    ),
                "recommendation":
                    summary.get(
                        "recommendation",
                        "",
                    ),
                "abuse_confidence_score":
                    abuseipdb.get(
                        "abuse_confidence_score",
                        "",
                    ),
                "total_reports":
                    abuseipdb.get(
                        "total_reports",
                        "",
                    ),
                "last_reported_at":
                    abuseipdb.get(
                        "last_reported_at",
                        "",
                    ),
                "vt_malicious":
                    virustotal.get(
                        "malicious",
                        "",
                    ),
                "vt_suspicious":
                    virustotal.get(
                        "suspicious",
                        "",
                    ),
                "vt_harmless":
                    virustotal.get(
                        "harmless",
                        "",
                    ),
                "vt_undetected":
                    virustotal.get(
                        "undetected",
                        "",
                    ),
                "vt_reputation":
                    virustotal.get(
                        "reputation",
                        "",
                    ),
                "greynoise_classification":
                    greynoise.get(
                        "classification",
                        "",
                    ),
                "greynoise_name":
                    greynoise.get(
                        "name",
                        "",
                    ),
                "shodan_ports":
                    ",".join(
                        str(port)
                        for port in shodan.get(
                            "ports",
                            [],
                        )
                    ),
                "shodan_tags":
                    ",".join(
                        shodan.get(
                            "tags",
                            [],
                        )
                    ),
            }
        )

    return output.getvalue()


def generate_csv_filename(
    prefix: str,
) -> str:
    timestamp = datetime.now().strftime(
        "%Y-%m-%d_%H-%M-%S"
    )

    return f"{prefix}_{timestamp}.csv"