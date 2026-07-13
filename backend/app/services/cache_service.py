import logging
from copy import deepcopy
from threading import Lock
from typing import Any

from cachetools import TTLCache


logger = logging.getLogger(__name__)


# Store up to 500 analyses for 5 minutes.
analysis_cache: TTLCache[str, dict[str, Any]] = TTLCache(
    maxsize=500,
    ttl=300,
)

cache_lock = Lock()


def get_cached_analysis(ip: str) -> dict[str, Any] | None:
    """
    Retrieve a previously calculated analysis.

    A copy is returned so other code cannot accidentally
    modify the value stored inside the cache.
    """

    with cache_lock:
        cached_result = analysis_cache.get(ip)

        if cached_result is None:
            logger.info("Cache miss for IP %s", ip)
            return None

        logger.info("Cache hit for IP %s", ip)

        return deepcopy(cached_result)


def cache_analysis(
    ip: str,
    analysis_result: dict[str, Any],
) -> None:
    """
    Store an analysis result in the cache.
    """

    with cache_lock:
        analysis_cache[ip] = deepcopy(analysis_result)

    logger.info("Cached analysis for IP %s", ip)


def clear_analysis_cache() -> None:
    """
    Remove all cached analyses.
    """

    with cache_lock:
        analysis_cache.clear()

    logger.info("Analysis cache cleared")