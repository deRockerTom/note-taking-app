from fastapi import APIRouter

from .health import health_router
from .notes import notes_router

v1_router = APIRouter()

v1_router.include_router(
    health_router,
    prefix="/health",
    tags=["health"],
)

v1_router.include_router(
    notes_router,
    prefix="/notes",
    tags=["notes"],
)
