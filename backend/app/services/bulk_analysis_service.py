import logging
from ipaddress import ip_address
from typing import Any

from sqlalchemy.orm import Session

from app.database.crud import save_search
from app.services.analysis_engine import analyze_ip


logger = logging.getLogger(__name__)


MAX_BULK_IPS = 100


def normalize_file_entries(
    file_content: str,
) -> tuple[list[str], int]:
    """
    Remove blank lines and duplicate values.

    Returns:
        - Unique entries in their original order
        - Number of duplicate entries removed
    """

    raw_entries = [
        line.strip()
        for line in file_content.splitlines()
        if line.strip()
    ]

    unique_entries: list[str] = []
    seen_entries: set[str] = set()
    duplicate_count = 0

    for entry in raw_entries:
        if entry in seen_entries:
            duplicate_count += 1
            continue

        seen_entries.add(entry)
        unique_entries.append(entry)

    return unique_entries, duplicate_count


def validate_ip_entry(
    value: str,
) -> tuple[bool, str | None]:
    """
    Validate and normalize an IPv4 or IPv6 address.
    """

    try:
        normalized_ip = str(ip_address(value))
        return True, normalized_ip

    except ValueError:
        return False, None


def process_bulk_ip_file(
    filename: str,
    file_content: str,
    database_session: Session,
) -> dict[str, Any]:
    """
    Analyze IP addresses from an uploaded text file.
    """

    entries, duplicate_count = (
        normalize_file_entries(file_content)
    )

    if len(entries) > MAX_BULK_IPS:
        raise ValueError(
            f"Files may contain no more than "
            f"{MAX_BULK_IPS} unique entries."
        )

    results: list[dict[str, Any]] = []
    invalid_entries: list[dict[str, str]] = []

    for entry in entries:
        is_valid, normalized_ip = (
            validate_ip_entry(entry)
        )

        if not is_valid or normalized_ip is None:
            invalid_entries.append(
                {
                    "value": entry,
                    "reason": (
                        "Not a valid IPv4 or "
                        "IPv6 address."
                    ),
                }
            )
            continue

        logger.info(
            "Starting bulk analysis for IP %s",
            normalized_ip,
        )

        analysis_result = analyze_ip(
            normalized_ip
        )

        save_search(
            database_session=database_session,
            analysis_result=analysis_result,
        )

        results.append(analysis_result)

    return {
        "filename": filename,
        "total_entries": len(entries),
        "valid_count": len(results),
        "invalid_count": len(
            invalid_entries
        ),
        "duplicate_count": duplicate_count,
        "results": results,
        "invalid_entries": invalid_entries,
    }
