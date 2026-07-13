import logging
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database.models import SearchHistory


logger = logging.getLogger(__name__)


def save_search(
    database_session: Session,
    analysis_result: dict[str, Any],
) -> SearchHistory | None:
    """
    Save an analysis summary to the search-history table.

    A database failure is logged but does not prevent the user
    from receiving their threat-analysis result.
    """

    summary = analysis_result.get("summary", {})

    history_entry = SearchHistory(
        ip=summary.get("ip", "Unknown"),
        country=summary.get("country"),
        organization=summary.get("organization"),
        threat_score=summary.get("threat_score", 0),
        risk_level=summary.get("risk_level", "Unknown"),
    )

    try:
        database_session.add(history_entry)
        database_session.commit()
        database_session.refresh(history_entry)

        logger.info(
            "Saved search-history entry for IP %s",
            history_entry.ip,
        )

        return history_entry

    except SQLAlchemyError:
        database_session.rollback()

        logger.exception(
            "Failed to save search-history entry for IP %s",
            summary.get("ip"),
        )

        return None


def get_search_history(
    database_session: Session,
    limit: int = 50,
) -> list[SearchHistory]:
    """
    Return the newest search-history entries first.
    """

    statement = (
        select(SearchHistory)
        .order_by(SearchHistory.created_at.desc())
        .limit(limit)
    )

    return list(
        database_session.scalars(statement).all()
    )

def get_dashboard_analytics(
    database_session: Session,
) -> dict:
    """
    Calculate dashboard statistics from search history.
    """

    total_searches = (
        database_session.scalar(
            select(
                func.count(SearchHistory.id)
            )
        )
        or 0
    )

    average_score = (
        database_session.scalar(
            select(
                func.avg(
                    SearchHistory.threat_score
                )
            )
        )
        or 0
    )

    risk_distribution = {
        "safe": 0,
        "low": 0,
        "medium": 0,
        "high": 0,
        "critical": 0,
    }

    risk_statement = (
        select(
            SearchHistory.risk_level,
            func.count(SearchHistory.id),
        )
        .group_by(SearchHistory.risk_level)
    )

    risk_rows = database_session.execute(
        risk_statement
    ).all()

    for risk_level, count in risk_rows:
        normalized_level = (
            risk_level.strip().lower()
        )

        if normalized_level in risk_distribution:
            risk_distribution[
                normalized_level
            ] = count

    high_risk_searches = (
        risk_distribution["high"]
        + risk_distribution["critical"]
    )

    top_country_statement = (
        select(
            SearchHistory.country,
            func.count(SearchHistory.id).label(
                "country_count"
            ),
        )
        .where(
            SearchHistory.country.is_not(None),
            SearchHistory.country != "Unknown",
        )
        .group_by(SearchHistory.country)
        .order_by(
            func.count(
                SearchHistory.id
            ).desc()
        )
        .limit(1)
    )

    top_country_row = (
        database_session.execute(
            top_country_statement
        ).first()
    )

    top_organization_statement = (
        select(
            SearchHistory.organization,
            func.count(SearchHistory.id).label(
                "organization_count"
            ),
        )
        .where(
            SearchHistory.organization.is_not(
                None
            ),
            SearchHistory.organization
            != "Unknown",
        )
        .group_by(
            SearchHistory.organization
        )
        .order_by(
            func.count(
                SearchHistory.id
            ).desc()
        )
        .limit(1)
    )

    top_organization_row = (
        database_session.execute(
            top_organization_statement
        ).first()
    )

    return {
        "total_searches": total_searches,
        "average_threat_score": round(
            float(average_score),
            1,
        ),
        "high_risk_searches":
            high_risk_searches,
        "critical_searches":
            risk_distribution["critical"],
        "top_country": (
            top_country_row[0]
            if top_country_row
            else None
        ),
        "top_country_count": (
            top_country_row[1]
            if top_country_row
            else 0
        ),
        "top_organization": (
            top_organization_row[0]
            if top_organization_row
            else None
        ),
        "top_organization_count": (
            top_organization_row[1]
            if top_organization_row
            else 0
        ),
        "risk_distribution":
            risk_distribution,
    }

def get_all_search_history(
    database_session: Session,
) -> list[SearchHistory]:
    """
    Return all history entries, newest first.
    """

    statement = (
        select(SearchHistory)
        .order_by(
            SearchHistory.created_at.desc()
        )
    )

    return list(
        database_session.scalars(
            statement
        ).all()
    )