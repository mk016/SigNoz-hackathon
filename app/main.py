import sys
import os

# Guarantee project root is in sys.path for seamless imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import incidents, health, chaos
from dotenv import load_dotenv
load_dotenv()

from otel.instrumentation import setup_opentelemetry, instrument_app

# Setup OpenTelemetry
setup_opentelemetry()

app = FastAPI(
    title="Observability Copilot API",
    description="AI-powered Self-Healing SRE Agent Backend",
    version="0.1.0",
    docs_url="/api-docs",
    redoc_url=None
)

# Custom Dark Theme Swagger UI Route for Backend API
from fastapi.responses import HTMLResponse

@app.get("/docs", include_in_schema=False)
def custom_swagger_ui():
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Observability Copilot API Docs</title>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
        <style>
            body { background-color: #070707 !important; color: #fff !important; font-family: sans-serif; }
            .swagger-ui { filter: invert(88%) hue-rotate(180deg); }
            .swagger-ui .topbar { display: none !important; }
            .swagger-ui .info { margin: 20px 0; }
        </style>
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
        <script>
            SwaggerUIBundle({
                url: '/openapi.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [SwaggerUIBundle.presets.apis]
            });
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)


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
