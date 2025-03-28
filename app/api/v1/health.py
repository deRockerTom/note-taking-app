from fastapi import APIRouter

health_router = APIRouter()


@health_router.get("/")
async def health():
    """
    Health check endpoint.
    """
    return {"status": "healthy"}
