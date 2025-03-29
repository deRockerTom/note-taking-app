import uvicorn
from api import api_router
from api.v1.models.shared import DefaultAPIResponse
from errors import BackException
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()


@app.exception_handler(BackException)
async def back_exception_handler(request, exc: BackException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.message,
        },
    )


@app.get("/", response_model=DefaultAPIResponse)
async def root():
    return {"message": "Welcome to the note taking app!"}


app.include_router(
    api_router,
    prefix="/api",
)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
