from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def check_health():
    """
    Standard health check endpoint.
    """
    return {"status": "healthy"}
