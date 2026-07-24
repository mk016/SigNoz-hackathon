import sys
import os

# Guarantee project root is in sys.path for seamless imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agent.memory import memory
from agent.fixer import execute_remediation

def analyze_incident(incident_id: str, incident_data: dict, backend_url: str):
    print(f"[Analyzer] Starting analysis for incident {incident_id}")
    
    # 1. Update status to analyzing
    incident_data["status"] = "analyzing"
    import requests
    try:
        requests.post(f"{backend_url}/api/incidents/", json=incident_data, timeout=3)
    except Exception:
        pass
        
    # 2. Check Incident Memory (RAG)
    past_incident = memory.search_similar_incidents(incident_data["description"])
    rag_context = ""
    if past_incident:
        rag_context = f"\nSimilar past incident: {past_incident['document']}\nPast Resolution: {past_incident['metadata']['resolution']}\n"
        print(f"[Analyzer] Found past incident match!")

    # 3. LLM RCA
    prompt = f"""
You are an expert SRE AI. Analyze the following incident and recommend a fix.
Incident Description: {incident_data['description']}
Target Service: {incident_data['target']}
{rag_context}

Respond in the following format exactly:
FIX: <suggested fix>
COST: <estimated cost impact in dollars, just the number>
CONFIDENCE: <confidence percentage, just the number>
    """
    
    api_key = os.getenv("OPENAI_API_KEY")
    fix = "restart"
    cost = 0.02
    confidence = 85.0
    
    if api_key and api_key != "":
        try:
            from openai import OpenAI
            client = OpenAI(api_key=api_key)
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150
            )
            content = response.choices[0].message.content
            for line in content.split('\n'):
                if line.startswith("FIX:"): fix = line.replace("FIX:", "").strip()
                if line.startswith("COST:"): cost = float(line.replace("COST:", "").strip())
                if line.startswith("CONFIDENCE:"): confidence = float(line.replace("CONFIDENCE:", "").strip().replace("%", ""))
        except Exception as e:
            print(f"[Analyzer] LLM error ({e}), using default RAG fix.")
    else:
        print("[Analyzer] OPENAI_API_KEY not set. Using RAG fallback RCA.")
        if past_incident:
            fix = past_incident['metadata']['resolution']
            cost = past_incident['metadata']['cost']
            confidence = 92.0
            
    incident_data["fix_proposed"] = fix
    incident_data["cost_impact"] = cost
    incident_data["confidence_score"] = confidence
    
    approval_mode = incident_data.get("approval_mode", "manual")

    if approval_mode == "auto":
        incident_data["fix_applied"] = fix
        incident_data["status"] = "fixing"
        try:
            requests.post(f"{backend_url}/api/incidents/", json=incident_data, timeout=3)
        except Exception:
            pass
        execute_remediation(incident_id, incident_data, backend_url)
    else:
        # Human-in-the-loop mode: Require manual approval or override from Dashboard
        incident_data["status"] = "pending_approval"
        print(f"[Analyzer] Incident {incident_id} RCA complete. Awaiting human approval/override on Dashboard!")
        try:
            requests.post(f"{backend_url}/api/incidents/", json=incident_data, timeout=3)
        except Exception:
            pass

