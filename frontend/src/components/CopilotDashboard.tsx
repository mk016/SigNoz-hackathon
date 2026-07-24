"use client";

import { useEffect, useState } from "react";
import IncidentCard from "./IncidentCard";
import TraceViewer from "./TraceViewer";
import CostImpact from "./CostImpact";

export default function CopilotDashboard() {
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    // Poll the backend for active incidents
    const fetchIncidents = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/incidents/");
        if (res.ok) {
          const data = await res.json();
          setIncidents(data);
        }
      } catch (err) {
        console.error("Failed to fetch incidents", err);
      }
    };

    fetchIncidents();
    const interval = setInterval(fetchIncidents, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="dashboard" className="relative mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h2 className="font-bebas-neue mb-4 text-4xl tracking-tight sm:text-5xl">
          SRE Copilot Dashboard
        </h2>
        <p className="max-w-xl text-zinc-400 font-sans">
          Real-time incident detection, root cause analysis, and auto-remediation logs.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Incidents */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-semibold text-white font-sans mb-4">Active Incidents</h3>
          {incidents.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-xl border border-white/5 bg-white/5 border-dashed">
              <p className="text-zinc-500 font-sans">No active incidents. System healthy.</p>
            </div>
          ) : (
            incidents.map((inc) => (
              <IncidentCard key={inc.id} incident={inc} />
            ))
          )}
        </div>

        {/* Right Column: Cost & Traces */}
        <div className="space-y-6">
          <CostImpact incidents={incidents} />
          <TraceViewer />
        </div>
      </div>
    </section>
  );
}
