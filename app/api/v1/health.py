from api.v1.models.health import HealthAPIResponse
from fastapi import APIRouter

health_router = APIRouter()


@health_router.get("/", response_model=HealthAPIResponse)
async def health():
    """
    Health check endpoint.
    """
    return HealthAPIResponse(
        status="healthy",
    )
