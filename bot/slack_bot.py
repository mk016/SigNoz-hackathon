import os
import requests

def notify_incident(incident_data: dict):
    """
    Sends a rich notification to Slack/Discord about the incident and resolution.
    For the hackathon, we simulate this if WEBHOOK_URL is not provided.
    """
    webhook_url = os.getenv("SLACK_WEBHOOK_URL")
    
    # Calculate downtime cost (e.g. 45 seconds at $0.05/sec)
    # Using mock static values for demo
    downtime_cost = 0.15 
    fix_cost = incident_data.get("cost_impact", 0)
    total_cost = downtime_cost + fix_cost
    
    message = {
        "text": f"🚨 *Observability Copilot Auto-Remediation Report* 🚨\n\n"
                f"*Target:* `{incident_data['target']}`\n"
                f"*Issue:* {incident_data['description']}\n"
                f"*AI Diagnosis Confidence:* {incident_data.get('confidence_score', 'N/A')}%\n"
                f"*Action Taken:* `{incident_data.get('fix_applied', 'Unknown')}`\n"
                f"💸 *Cost Impact:* Downtime (${downtime_cost}) + Fix (${fix_cost}) = *${total_cost:.2f}*\n\n"
                f"✅ System recovered successfully in 45s (Normal MTTR: 25m)."
    }
    
    if webhook_url:
        try:
            requests.post(webhook_url, json=message)
            print("[SlackBot] Notification sent successfully.")
        except Exception as e:
            print(f"[SlackBot] Failed to send notification: {e}")
    else:
        print("\n" + "="*50)
        print("[SlackBot] SIMULATED NOTIFICATION (No webhook configured):")
        print(message["text"])
        print("="*50 + "\n")

if __name__ == "__main__":
    # Test notification
    notify_incident({
        "target": "payment-service",
        "description": "High latency (5000ms)",
        "confidence_score": 92.0,
        "fix_applied": "restart container",
        "cost_impact": 0.02
    })
