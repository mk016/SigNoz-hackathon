import sys
import os

# Guarantee project root is in sys.path for seamless imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import incidents, health, chaos
from otel.instrumentation import setup_opentelemetry, instrument_app

# Setup OpenTelemetry
setup_opentelemetry()

app = FastAPI(
    title="Observability Copilot API",
    description="AI-powered Self-Healing SRE Agent Backend",
    version="0.1.0"
)

# Instrument the FastAPI app
instrument_app(app)

# Allow CORS for frontend Next.js application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["incidents"])
app.include_router(chaos.router, prefix="/api/chaos", tags=["chaos"])

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Observability Copilot API",
        "docs": "/docs"
    }
