import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Simple state to hold active chaos rules for E-Commerce services
chaos_state = {
    "payment": {"latency_ms": 0, "error_rate": 0.0},
    "checkout": {"latency_ms": 0, "error_rate": 0.0},
    "inventory": {"latency_ms": 0, "error_rate": 0.0},
    "cart": {"latency_ms": 0, "error_rate": 0.0},
    "auth": {"latency_ms": 0, "error_rate": 0.0},
}

class ChaosConfig(BaseModel):
    target: str
    latency_ms: int = 0
    error_rate: float = 0.0

@router.post("/inject")
def inject_chaos(config: ChaosConfig):
    """
    Inject chaos (latency/errors) into a specific target.
    """
    if config.target not in chaos_state:
        chaos_state[config.target] = {"latency_ms": 0, "error_rate": 0.0}
        
    chaos_state[config.target]["latency_ms"] = config.latency_ms
    chaos_state[config.target]["error_rate"] = config.error_rate
    
    return {"status": "chaos_injected", "config": config}

@router.post("/reset")
def reset_chaos(target: str):
    """
    Reset chaos for a target.
    """
    if target in chaos_state:
        chaos_state[target] = {"latency_ms": 0, "error_rate": 0.0}
    else:
        # Reset all if target is 'all'
        for key in chaos_state:
            chaos_state[key] = {"latency_ms": 0, "error_rate": 0.0}
    return {"status": "chaos_reset", "target": target}


def _handle_service_chaos(target: str, error_message: str):
    config = chaos_state.get(target, {"latency_ms": 0, "error_rate": 0.0})
    if config["latency_ms"] > 0:
        time.sleep(config["latency_ms"] / 1000.0)
    if config["error_rate"] > 0:
        import random
        if random.random() < config["error_rate"]:
            raise HTTPException(status_code=500, detail=error_message)


# Mock E-Commerce Services

@router.get("/service/payment")
def process_payment():
    _handle_service_chaos("payment", "Payment Gateway Gateway Connection Timeout")
    return {"service": "payment-service", "status": "success", "transaction_id": "tx_987654321"}

@router.get("/service/checkout")
def process_checkout():
    _handle_service_chaos("checkout", "Checkout API Order Processing Failed")
    return {"service": "checkout-service", "status": "success", "order_id": "ord_10293847"}

@router.get("/service/inventory")
def process_inventory():
    _handle_service_chaos("inventory", "Inventory Database Row Lock Timeout")
    return {"service": "inventory-service", "status": "success", "stock_available": 142}

@router.get("/service/cart")
def process_cart():
    _handle_service_chaos("cart", "Cart Session Redis Cache Eviction Error")
    return {"service": "cart-service", "status": "success", "items_count": 3}

@router.get("/service/auth")
def process_auth():
    _handle_service_chaos("auth", "Auth Service JWT Secret Key Rotation Mismatch")
    return {"service": "auth-service", "status": "success", "user_id": "usr_554433"}

