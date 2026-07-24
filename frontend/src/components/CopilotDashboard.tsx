"use client";

import { useEffect, useState } from "react";
import * as styles from "@/lib/styles";
import TraceViewer from "./TraceViewer";
import CostImpact from "./CostImpact";

interface Incident {
  id: string;
  target: string;
  status: string;
  description: string;
  detected_at: string;
  resolved_at?: string;
  cost_impact?: number;
  fix_applied?: string;
  fix_proposed?: string;
  confidence_score?: number;
  custom_override_applied?: boolean;
}

export default function CopilotDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [demoIncidents, setDemoIncidents] = useState<Incident[]>([
    {
      id: "inc_sim_101",
      target: "payment-service",
      status: "pending_approval",
      description: "Payment Gateway HTTP 500 Internal Error - Connection timeout during checkout authorization.",
      detected_at: new Date().toISOString(),
      fix_proposed: "restart container & reset connection pool",
      confidence_score: 96,
      cost_impact: 0.02
    }
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customCommand, setCustomCommand] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/incidents/`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setIncidents(data);
          }
        }
      } catch (err) {
        // Backend offline: interactive demo incidents remain active
      }
    };

    fetchIncidents();
    const interval = setInterval(fetchIncidents, 3000);
    return () => clearInterval(interval);
  }, [API_BASE]);

  const displayIncidents = incidents.length > 0 ? incidents : demoIncidents;

  const handleSimulateOutage = (type: "payment" | "inventory" | "auth") => {
    const scenarios: Record<string, Incident> = {
      payment: {
        id: `inc_sim_${Date.now()}`,
        target: "payment-service",
        status: "pending_approval",
        description: "Payment Gateway HTTP 500 Internal Error - Connection timeout during checkout authorization.",
        detected_at: new Date().toISOString(),
        fix_proposed: "restart container & reset connection pool",
        confidence_score: 96,
        cost_impact: 0.02
      },
      inventory: {
        id: `inc_sim_${Date.now()}`,
        target: "inventory-service",
        status: "pending_approval",
        description: "Stock Inventory DB Row Lock Timeout - High latency (5012ms) on warehouse query.",
        detected_at: new Date().toISOString(),
        fix_proposed: "kill blocked query locks & flush redis cache",
        confidence_score: 94,
        cost_impact: 0.04
      },
      auth: {
        id: `inc_sim_${Date.now()}`,
        target: "auth-service",
        status: "pending_approval",
        description: "Auth JWT Secret Key Rotation Mismatch - Token validation 500 error loop.",
        detected_at: new Date().toISOString(),
        fix_proposed: "rotate JWT secret keys & restart auth deployment",
        confidence_score: 98,
        cost_impact: 0.01
      }
    };

    setDemoIncidents([scenarios[type]]);
  };

  const handleApproveDemoFix = (id: string) => {
    setDemoIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? {
              ...inc,
              status: "resolved",
              fix_applied: inc.fix_proposed || "restart container",
              resolved_at: new Date().toISOString()
            }
          : inc
      )
    );
  };

  const handleOverrideDemoFix = (id: string) => {
    if (!customCommand.trim()) return;
    setDemoIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? {
              ...inc,
              status: "resolved",
              fix_applied: customCommand,
              custom_override_applied: true,
              resolved_at: new Date().toISOString()
            }
          : inc
      )
    );
    setEditingId(null);
    setCustomCommand("");
  };

  const handleResetDemo = () => {
    setDemoIncidents([]);
    setIncidents([]);
  };

  return (
    <section id="dashboard" className="relative mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400 border border-emerald-500/20 font-sans">
            Interactive Live Sandbox
          </span>
          <h2 className="font-bebas-neue mt-3 text-4xl tracking-tight sm:text-5xl text-white">
            SRE Copilot Interactive Dashboard
          </h2>
          <p className="max-w-xl text-zinc-400 font-sans mt-1 text-sm">
            Real-time incident detection, LLM root cause analysis, and human-in-the-loop remediation simulator.
          </p>
        </div>

        {/* Interactive Outage Simulators */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSimulateOutage("payment")}
            className="px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-300 transition"
          >
            Simulate Payment Outage
          </button>
          <button
            onClick={() => handleSimulateOutage("inventory")}
            className="px-3 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold text-amber-300 transition"
          >
            Simulate Inventory Lock
          </button>
          <button
            onClick={() => handleSimulateOutage("auth")}
            className="px-3 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-xs font-semibold text-indigo-300 transition"
          >
            Simulate Auth Outage
          </button>
          <button
            onClick={handleResetDemo}
            className="px-3 py-2 rounded-xl border border-white/10 bg-neutral-900 hover:bg-white/10 text-xs font-medium text-zinc-400 transition"
          >
            Clear Sandbox
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Incidents */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white font-sans">Active Incidents Stream</h3>
            <span className="text-xs text-zinc-500 font-mono">Interactive Control Mode</span>
          </div>

          {displayIncidents.length === 0 ? (
            <div className="flex flex-col h-48 items-center justify-center rounded-2xl border border-white/10 bg-neutral-900/40 p-6 text-center space-y-3" style={styles.frame("rgba(24,24,27,0.3)", "rgba(10,10,10,0.6)")}>
              <p className="text-sm font-semibold text-emerald-400 font-sans">All Systems Healthy</p>
              <p className="text-xs text-zinc-400 max-w-sm">No active anomalies detected. Click any button above to simulate a live production outage and test AI auto-healing.</p>
            </div>
          ) : (
            displayIncidents.map((inc) => (
              <div
                key={inc.id}
                className="rounded-2xl border border-white/10 bg-neutral-900/60 p-6 space-y-4"
                style={styles.operatorsCard}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{inc.target}</span>
                    <h4 className="text-base font-semibold text-white mt-1">{inc.description}</h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${inc.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'}`}>
                    {inc.status}
                  </span>
                </div>

                {/* AI Proposed / Applied Fix */}
                <div className="bg-black/60 rounded-xl p-4 border border-white/5 space-y-2 text-xs font-sans">
                  <div className="flex justify-between text-zinc-400">
                    <span>AI Suggested Fix:</span>
                    <span className="font-mono text-amber-300 font-semibold">{inc.fix_proposed || inc.fix_applied}</span>
                  </div>
                  {inc.custom_override_applied && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Human Override Applied:</span>
                      <span className="font-mono text-emerald-300">{inc.fix_applied}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400">
                    <span>LLM Confidence:</span>
                    <span className="text-indigo-400 font-semibold">{inc.confidence_score || 94}%</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Cost Impact:</span>
                    <span className="text-emerald-400 font-semibold">${inc.cost_impact || 0.02}</span>
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                {inc.status !== "resolved" && (
                  <div className="pt-2 border-t border-white/10 space-y-3">
                    <div className="text-[11px] text-amber-300 font-medium">Action Required: Verify or edit the suggested fix before execution</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveDemoFix(inc.id)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
                      >
                        Approve & Execute AI Fix
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(inc.id);
                          setCustomCommand(inc.fix_proposed || "restart container");
                        }}
                        className="py-2.5 px-4 rounded-xl border border-white/20 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition"
                      >
                        Edit / Override Fix
                      </button>
                    </div>

                    {editingId === inc.id && (
                      <div className="p-4 rounded-xl bg-black/80 border border-white/15 space-y-3 mt-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Enter Custom Human Fix Command</label>
                        <input
                          type="text"
                          value={customCommand}
                          onChange={(e) => setCustomCommand(e.target.value)}
                          placeholder="e.g. kubectl rollout restart deployment/payment-service"
                          className="w-full rounded-lg border border-white/15 bg-neutral-900 p-2.5 text-xs font-mono text-white focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOverrideDemoFix(inc.id)}
                            className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white"
                          >
                            Execute Custom Override
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="py-2 px-3 rounded-lg border border-white/10 text-xs font-medium text-zinc-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Right Column: Cost & Traces */}
        <div className="space-y-6">
          <CostImpact incidents={displayIncidents} />
          <TraceViewer />
        </div>
      </div>
    </section>
  );
}
