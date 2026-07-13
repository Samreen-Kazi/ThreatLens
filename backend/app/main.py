from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.logging_config import configure_logging
from app.database import models
from app.database.database import Base, engine


configure_logging()

# Create database tables that do not already exist.
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="ThreatLens API",
    description="Threat Intelligence Dashboard",
    version="1.0.0",
)


allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://threat-lens-five.vercel.app"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router)


@app.get("/")
def home():
    return {
        "message": "ThreatLens Backend Running"
    }