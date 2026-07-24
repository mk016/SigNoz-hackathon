import sys
import os
import time
import uuid
import threading
from datetime import datetime

# Guarantee project root is in sys.path for seamless imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agent.analyzer import analyze_incident

class SigNozObserver:
    def __init__(self, check_interval=5):
        self.check_interval = check_interval
        self.running = False
        self.backend_url = "http://localhost:8000"

    def start(self):
        self.running = True
        self.thread = threading.Thread(target=self._poll_alerts, daemon=True)
        self.thread.start()

    def stop(self):
        self.running = False

    def _poll_alerts(self):
        """
        Polls telemetry state across all E-Commerce microservices (mocking SigNoz Alert Webhook / MCP interface).
        """
        services = ["payment", "checkout", "inventory", "cart", "auth"]
        while self.running:
            try:
                import requests
                anomaly_found = False
                for svc in services:
                    start_time = time.time()
                    try:
                        resp = requests.get(f"{self.backend_url}/api/chaos/service/{svc}", timeout=3)
                        status_code = resp.status_code
                    except Exception as err:
                        status_code = 500

                    latency_ms = (time.time() - start_time) * 1000
                    
                    # Check for anomalies
                    if status_code >= 500 or latency_ms > 2000:
                        print(f"[Observer] ALERT: Anomaly detected on {svc}-service! Status: {status_code}, Latency: {latency_ms:.2f}ms")
                        
                        incident_id = str(uuid.uuid4())
                        incident = {
                            "id": incident_id,
                            "target": f"{svc}-service",
                            "status": "detected",
                            "description": f"High latency ({latency_ms:.2f}ms) or HTTP {status_code} failure on {svc}-service API.",
                            "detected_at": datetime.now().isoformat()
                        }
                        
                        try:
                            requests.post(f"{self.backend_url}/api/incidents/", json=incident, timeout=3)
                        except Exception:
                            pass
                        
                        # Trigger RCA & Analysis
                        analyze_incident(incident_id, incident, self.backend_url)
                        anomaly_found = True
                        break

                if not anomaly_found:
                    print(f"[Observer] All 5 E-Commerce services normal (checkout, payment, inventory, cart, auth).")
                    
            except ModuleNotFoundError:
                print("[Observer] 'requests' package not installed. Observer in standby.")
                time.sleep(10)
            except Exception as e:
                print(f"[Observer] Telemetry poll waiting for backend server (http://localhost:8000)...")
                
            time.sleep(self.check_interval)


if __name__ == "__main__":
    observer = SigNozObserver()
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
