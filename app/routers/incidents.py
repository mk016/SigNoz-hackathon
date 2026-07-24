from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

# In-memory store for incidents for hackathon purposes
incidents_db = []

class Incident(BaseModel):
    id: str
    target: str
    status: str # "detected", "analyzing", "pending_approval", "fixing", "resolved"
    description: str
    detected_at: datetime
    resolved_at: Optional[datetime] = None
    cost_impact: Optional[float] = None
    fix_applied: Optional[str] = None
    confidence_score: Optional[float] = None
    approval_mode: Optional[str] = "manual" # "manual" or "auto"
    fix_proposed: Optional[str] = None
    custom_override_applied: Optional[bool] = False

class OverrideFixPayload(BaseModel):
    custom_fix: str
    notes: Optional[str] = None

@router.get("/", response_model=List[Incident])
def get_incidents():
    """
    Get all incidents (used by the frontend dashboard).
    """
    return incidents_db

@router.post("/", response_model=Incident)
def create_incident(incident: Incident):
    """
    Create or update an incident (called by the AI agent).
    """
    for i, existing in enumerate(incidents_db):
        if existing.id == incident.id:
            incidents_db[i] = incident
            return incident
            
    incidents_db.append(incident)
    return incident

@router.post("/{incident_id}/approve", response_model=Incident)
def approve_incident_fix(incident_id: str):
    """
    Human-in-the-loop: Approve AI proposed fix and trigger remediation.
    """
    for incident in incidents_db:
        if incident.id == incident_id:
            from agent.fixer import execute_remediation
            incident.status = "fixing"
            if not incident.fix_applied and incident.fix_proposed:
                incident.fix_applied = incident.fix_proposed
            
            # Execute fix
            execute_remediation(incident.id, incident.dict(), "http://localhost:8000")
            return incident
    return None

@router.post("/{incident_id}/override", response_model=Incident)
def override_incident_fix(incident_id: str, payload: OverrideFixPayload):
    """
    Human-in-the-loop: Override AI proposed fix with a user-edited custom fix and execute.
    """
    for incident in incidents_db:
        if incident.id == incident_id:
            from agent.fixer import execute_remediation
            incident.fix_applied = payload.custom_fix
            incident.custom_override_applied = True
            incident.status = "fixing"
            
            # Execute fix with human overridden resolution
            execute_remediation(incident.id, incident.dict(), "http://localhost:8000")
            return incident
    return None

