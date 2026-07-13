from fastapi import APIRouter

from app.api.routes import (
    analytics,
    analyze,
    history,
    bulk,
    export,
    ip,
)


api_router = APIRouter()


api_router.include_router(
    ip.router,
    tags=["IP Information"],
)

api_router.include_router(
    analyze.router,
    tags=["Threat Analysis"],
)

api_router.include_router(
    history.router,
    tags=["Search History"],
)

api_router.include_router(
    analytics.router,
    tags=["Dashboard Analytics"],
)

api_router.include_router(
    bulk.router,
    tags=["Bulk Analysis"],
)

api_router.include_router(
    export.router,
    tags=["CSV Report"],
)