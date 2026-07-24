import sys
import os
import argparse

# Guarantee project root is in sys.path for seamless imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

def main():
    parser = argparse.ArgumentParser(description="Inject chaos into Observability Copilot")
    parser.add_argument("--target", default="payment", help="Target service to inject chaos")
    parser.add_argument("--latency", type=int, default=5000, help="Latency to inject in ms")
    parser.add_argument("--error-rate", type=float, default=0.0, help="Error rate to inject (0.0 to 1.0)")
    
    args = parser.parse_args()
    
    print(f"🔥 Injecting chaos into '{args.target}' service...")
    print(f"   Latency: {args.latency}ms")
    print(f"   Error Rate: {args.error_rate * 100}%")
    
    try:
        import requests
        resp = requests.post(
            "http://localhost:8000/api/chaos/inject",
            json={
                "target": args.target,
                "latency_ms": args.latency,
                "error_rate": args.error_rate
            },
            timeout=5
        )
        if resp.status_code == 200:
            print("✅ Chaos injected successfully!")
            print("⏳ Watch the SigNoz Dashboard and AI Agent logs for live remediation.")
        else:
            print(f"❌ Failed to inject chaos: {resp.text}")
    except Exception as e:
        print(f"❌ Connection error: Ensure the FastAPI backend is running on http://localhost:8000. Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
