from fastapi import FastAPI
from src.backend.routes import router
from contextlib import asynccontextmanager
from src.db.main import init_db

version = "v1"

@asynccontextmanager
async def life_span(app:FastAPI):
    print("server is starting...")
    await init_db()
    yield
    print("server has been stopped...")

app= FastAPI(
    title = "FraudDetector",
    description = "A REST API for detecting fraud related to credit cards",
    version = version,
    lifespan = life_span

)

app.include_router(router , prefix = f"/api/{version}/prediction")