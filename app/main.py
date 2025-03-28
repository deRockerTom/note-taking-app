import uvicorn
from api import api_router
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Welcome to the note taking app!"}


app.include_router(
    api_router,
    prefix="/api",
)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
