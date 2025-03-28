from api.v1.health import health_router
from fastapi import APIRouter

v1_router = APIRouter()

v1_router.include_router(
    health_router,
    prefix="/health",
    tags=["health"],
)
