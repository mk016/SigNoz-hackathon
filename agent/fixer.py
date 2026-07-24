import sys
import os
from datetime import datetime

# Guarantee project root is in sys.path for seamless imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from bot.slack_bot import notify_incident

def execute_remediation(incident_id: str, incident_data: dict, backend_url: str):
    """
    Executes the suggested fix and notifies via Slack.
    """
    print(f"[Fixer] Executing remediation for {incident_id}: {incident_data.get('fix_applied', 'restart')}")
    
    # 1. Execute Fix (Reset chaos on the target service to simulate a restart/fix)
    target = incident_data.get("target", "payment").replace("-service", "")
    try:
        import requests
        requests.post(f"{backend_url}/api/chaos/reset?target={target}", timeout=3)
        print(f"[Fixer] Chaos reset successfully on target: {target}")
    except Exception as e:
        print(f"[Fixer] Chaos reset notice: {e}")
        
    # 2. Update Incident Status
    incident_data["status"] = "resolved"
    incident_data["resolved_at"] = datetime.now().isoformat()
    
    try:
        import requests
        requests.post(f"{backend_url}/api/incidents/", json=incident_data, timeout=3)
    except Exception as e:
        print(f"[Fixer] Incident status sync: {e}")
        
    # 3. Notify Team
    notify_incident(incident_data)
    print(f"[Fixer] Remediation complete for incident {incident_id}.")
