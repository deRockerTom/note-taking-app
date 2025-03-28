from fastapi import APIRouter

from .health import health_router

v1_router = APIRouter()

v1_router.include_router(
    health_router,
    prefix="/health",
    tags=["health"],
)
