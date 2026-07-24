"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as S from "@/lib/styles";
import Sidebar from "@/components/Sidebar";

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
  approval_mode?: string;
  custom_override_applied?: boolean;
}

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [filterTarget, setFilterTarget] = useState<string>("all");

  // Chaos controls state
  const [chaosTarget, setChaosTarget] = useState("payment");
  const [chaosLatency, setChaosLatency] = useState(5000);
  const [chaosErrorRate, setChaosErrorRate] = useState(0.0);
  const [chaosStatus, setChaosStatus] = useState<string | null>(null);

  // Custom fix override modal state
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [customFixInput, setCustomFixInput] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const fetchIncidents = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/incidents/`);
      if (res.ok) {
        const data = await res.json();
        setIncidents(data);
      }
    } catch (err) {
      console.error("Backend offline or incident fetch error", err);
    }
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleInjectChaos = async () => {
    setChaosStatus("Injecting...");
    try {
      const res = await fetch(`${API_BASE}/api/chaos/inject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: chaosTarget,
          latency_ms: chaosLatency,
          error_rate: chaosErrorRate,
        }),
      });
      if (res.ok) {
        setChaosStatus(`Chaos injected into ${chaosTarget}-service.`);
        fetchIncidents();
      } else {
        setChaosStatus("Failed to inject chaos.");
      }
    } catch (err) {
      setChaosStatus("Backend API offline");
    }
  };

  const handleResetChaos = async () => {
    setChaosStatus("Resetting...");
    try {
      const res = await fetch(`${API_BASE}/api/chaos/reset?target=${chaosTarget}`, {
        method: "POST",
      });
      if (res.ok) {
        setChaosStatus(`Chaos cleared for ${chaosTarget}-service.`);
        fetchIncidents();
      }
    } catch (err) {
      setChaosStatus("Backend API offline");
    }
  };

  const handleApproveFix = async (incidentId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/incidents/${incidentId}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        setActionMessage(`AI proposed fix approved & executed for incident ${incidentId.slice(0, 8)}`);
        fetchIncidents();
      }
    } catch (err) {
      setActionMessage("Failed to connect to backend for approval.");
    }
  };

  const handleOverrideSubmit = async () => {
    if (!editingIncident || !customFixInput.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/incidents/${editingIncident.id}/override`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          custom_fix: customFixInput,
          notes: "Human override executed via SRE Console"
        }),
      });
      if (res.ok) {
        setActionMessage(`Custom fix executed: "${customFixInput}"`);
        setEditingIncident(null);
        setCustomFixInput("");
        fetchIncidents();
      }
    } catch (err) {
      setActionMessage("Failed to execute custom override.");
    }
  };

  const coreServices = [
    { id: "checkout", name: "Checkout API" },
    { id: "payment", name: "Payment Gateway" },
    { id: "inventory", name: "Stock Inventory DB" },
    { id: "cart", name: "Cart Session Redis" },
    { id: "auth", name: "Auth JWT Service" },
  ];

  const customTargets = Array.from(
    new Set(
      incidents
        .map((i) => i.target)
        .filter((t) => !['checkout', 'payment', 'inventory', 'cart', 'auth'].some((s) => t.includes(s)))
    )
  );

  const filteredIncidents = incidents.filter((inc) => {
    if (filterTarget === "all") return true;
    return inc.target === filterTarget;
  });

  const activeIncidentCount = incidents.filter((i) => i.status !== "resolved").length;

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col font-sans">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] mix-blend-screen noise-bg"></div>
      <div className="pointer-events-none fixed inset-0 opacity-20 grid-lines"></div>

      {/* Top Bar Header */}
      <header className="relative z-20 border-b border-white/10 bg-neutral-950/90 px-6 py-4 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-xs font-medium text-white font-sans" style={S.logoBox}>
              VL
            </span>
            <span className="font-bebas-neue text-2xl tracking-tight text-white">Observability Copilot Console</span>
          </Link>
          <span className={`hidden sm:flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest border ${activeIncidentCount > 0 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${activeIncidentCount > 0 ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
            {activeIncidentCount > 0 ? `${activeIncidentCount} Incident Pending Approval` : 'All Systems Operational'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("chaos")}
            className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-3.5 py-2 text-xs font-semibold text-rose-300 transition"
          >
            <span>Chaos Control Room</span>
          </button>
          <Link
            href="/"
            className="rounded-lg border border-white/10 px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-white transition"
            style={S.btnDark}
          >
            Exit Portal
          </Link>
        </div>
      </header>

      {/* Main Console Workspace */}
      <div className="flex flex-1 relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} incidentCount={incidents.length} />

        <main className="flex-1 p-8 overflow-y-auto space-y-8 max-w-6xl mx-auto w-full">
          {/* Action notification banner */}
          {actionMessage && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-semibold flex justify-between items-center">
              <span>{actionMessage}</span>
              <button onClick={() => setActionMessage(null)} className="text-white/60 hover:text-white font-mono">✕</button>
            </div>
          )}

          {/* Overview & Incident Stream Tabs */}
          {(activeTab === "overview" || activeTab === "incidents") && (
            <div className="space-y-8">
              {/* Executive KPI Stats Bar */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-white/10 p-5 bg-neutral-900/40 backdrop-blur-sm" style={S.operatorsCard}>
                  <div className="text-[10px] font-mono font-semibold uppercase tracking-widest text-zinc-500">Mean Time To Repair</div>
                  <div className="font-bebas-neue text-4xl text-emerald-400 mt-1">45 Sec</div>
                  <div className="text-[10px] text-zinc-400 mt-1">98.3% faster than manual SRE</div>
                </div>

                <div className="rounded-2xl border border-white/10 p-5 bg-neutral-900/40 backdrop-blur-sm" style={S.operatorsCard}>
                  <div className="text-[10px] font-mono font-semibold uppercase tracking-widest text-zinc-500">AI Fix Confidence</div>
                  <div className="font-bebas-neue text-4xl text-indigo-400 mt-1">96.4%</div>
                  <div className="text-[10px] text-zinc-400 mt-1">GPT-4o + RAG Vector Store</div>
                </div>

                <div className="rounded-2xl border border-white/10 p-5 bg-neutral-900/40 backdrop-blur-sm" style={S.operatorsCard}>
                  <div className="text-[10px] font-mono font-semibold uppercase tracking-widest text-zinc-500">Human Governance</div>
                  <div className="font-bebas-neue text-4xl text-amber-400 mt-1">Enforced</div>
                  <div className="text-[10px] text-zinc-400 mt-1">100% human-in-the-loop review</div>
                </div>

                <div className="rounded-2xl border border-white/10 p-5 bg-neutral-900/40 backdrop-blur-sm" style={S.operatorsCard}>
                  <div className="text-[10px] font-mono font-semibold uppercase tracking-widest text-zinc-500">Monitored Targets</div>
                  <div className="font-bebas-neue text-4xl text-white mt-1">{5 + customTargets.length} Active</div>
                  <div className="text-[10px] text-emerald-400 mt-1">Microservices & Custom Sites</div>
                </div>
              </div>

              {/* Connected Targets & Websites Grid */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-white tracking-tight">Monitored Services & Website Targets</h2>
                    <p className="text-xs text-zinc-400 mt-0.5">Real-time telemetry status across registered microservices and external websites</p>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">Live Telemetry Active</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {/* Core Services */}
                  {coreServices.map((svc) => {
                    const activeIncident = incidents.find((i) => i.target.includes(svc.id) && i.status !== "resolved");
                    const statusText = !activeIncident ? "Healthy" : activeIncident.status === "pending_approval" ? "Review Pending" : "Degraded";
                    const statusColor = !activeIncident ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : activeIncident.status === "pending_approval" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20";
                    const dotColor = !activeIncident ? "bg-emerald-400" : activeIncident.status === "pending_approval" ? "bg-amber-400 animate-ping" : "bg-rose-500 animate-pulse";

                    return (
                      <div key={svc.id} className="rounded-xl border border-white/10 bg-neutral-900/50 p-4 space-y-3 flex flex-col justify-between" style={S.operatorsCard}>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Microservice</span>
                          <span className={`h-2 w-2 rounded-full ${dotColor}`}></span>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{svc.name}</div>
                          <div className="text-[10px] font-mono text-zinc-500 mt-0.5">{svc.id}-service</div>
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${statusColor}`}>
                          {statusText}
                        </div>
                      </div>
                    );
                  })}

                  {/* Dynamically Connected External Websites (e.g. BagruSarees.org) */}
                  {customTargets.map((target) => {
                    const activeIncident = incidents.find((i) => i.target === target && i.status !== "resolved");
                    const statusText = !activeIncident ? "Healthy" : activeIncident.status === "pending_approval" ? "Review Pending" : "Degraded";
                    const statusColor = !activeIncident ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : activeIncident.status === "pending_approval" ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-rose-400 bg-rose-500/10 border-rose-500/20";
                    const dotColor = !activeIncident ? "bg-emerald-400" : activeIncident.status === "pending_approval" ? "bg-amber-400 animate-ping" : "bg-rose-500 animate-pulse";

                    return (
                      <div key={target} className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3 flex flex-col justify-between" style={S.operatorsCard}>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/20 px-2 py-0.5 rounded">
                            Website Target
                          </span>
                          <span className={`h-2 w-2 rounded-full ${dotColor}`}></span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white truncate">{target}</div>
                          <div className="text-[10px] font-mono text-zinc-400 mt-0.5">External Site</div>
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${statusColor}`}>
                          {statusText}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Incident Remediation Terminal Stream */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white tracking-tight">Incident Remediation Stream</h2>
                    <p className="text-xs text-zinc-400 mt-0.5">Real-time incident detection, LLM root cause analysis, and human approval controls</p>
                  </div>

                  {/* Target Filter Select */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-mono">Filter Target:</span>
                    <select
                      value={filterTarget}
                      onChange={(e) => setFilterTarget(e.target.value)}
                      className="rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-zinc-300 focus:outline-none font-mono"
                    >
                      <option value="all">All Targets ({incidents.length})</option>
                      {customTargets.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                      {coreServices.map((s) => (
                        <option key={s.id} value={`${s.id}-service`}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {filteredIncidents.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 p-12 text-center bg-neutral-900/30 space-y-3" style={S.frame("rgba(24,24,27,0.3)", "rgba(10,10,10,0.6)")}>
                    <h3 className="text-base font-semibold text-emerald-400">All Target Systems Healthy</h3>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed font-sans">
                      No active anomalies detected for {filterTarget === 'all' ? 'monitored targets' : filterTarget}. To simulate a production outage, use the Chaos Control Room or send a telemetry alert.
                    </p>
                    <button
                      onClick={() => setActiveTab("chaos")}
                      className="mt-4 rounded-xl px-5 py-2 text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition"
                    >
                      Open Chaos Control Room
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredIncidents.map((inc) => (
                      <div
                        key={inc.id}
                        className="rounded-2xl border border-white/10 bg-neutral-900/60 p-6 space-y-4 backdrop-blur-sm"
                        style={S.operatorsCard}
                      >
                        {/* Header Row */}
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-400 border border-emerald-500/30 bg-emerald-500/10">
                                {inc.target}
                              </span>
                              <span className="text-xs text-zinc-400 font-mono">
                                ID: {inc.id}
                              </span>
                              <span className="text-xs text-zinc-500 font-mono">
                                {inc.detected_at ? new Date(inc.detected_at).toLocaleTimeString() : 'Just Now'}
                              </span>
                            </div>
                            <h3 className="text-base font-semibold text-white mt-2 font-sans">{inc.description}</h3>
                          </div>

                          <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${inc.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : inc.status === 'pending_approval' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                            {inc.status}
                          </span>
                        </div>

                        {/* Telemetry Exception Log Box */}
                        <div className="p-4 rounded-xl bg-black/80 border border-white/10 space-y-2 font-mono text-xs">
                          <div className="text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">Application Telemetry Log</div>
                          <div className="text-rose-400 leading-relaxed font-mono">
                            [ERROR] {inc.target} ➔ {inc.description}
                          </div>
                        </div>

                        {/* AI Root Cause Analysis & Fix Specifications */}
                        {(inc.fix_proposed || inc.fix_applied) && (
                          <div className="p-4 rounded-xl bg-neutral-950/80 border border-white/10 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-semibold">AI Root Cause Analysis & Proposed Fix</span>
                              <span className="text-xs text-indigo-300 font-mono font-semibold">Confidence: {inc.confidence_score || 94}%</span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-black/60 border border-white/5 font-mono text-xs">
                              <span className="text-zinc-400">Proposed Fix Command:</span>
                              <span className="text-amber-300 font-semibold">{inc.fix_proposed || inc.fix_applied}</span>
                            </div>

                            {inc.custom_override_applied && (
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 font-mono text-xs">
                                <span className="text-emerald-400 font-semibold">Human Override Applied:</span>
                                <span className="text-emerald-300 font-semibold">{inc.fix_applied}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Human Approval Action Bar */}
                        {inc.status === "pending_approval" && (
                          <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="text-xs text-amber-300 font-medium">
                              Human Review Required: Verify or edit the suggested fix command before applying to production.
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveFix(inc.id)}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
                              >
                                Approve & Execute AI Fix
                              </button>
                              <button
                                onClick={() => {
                                  setEditingIncident(inc);
                                  setCustomFixInput(inc.fix_proposed || "restart container & clear cache");
                                }}
                                className="px-4 py-2 rounded-xl border border-white/20 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition"
                              >
                                Edit / Override Fix
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chaos Control Room Tab */}
          {activeTab === "chaos" && (
            <div className="rounded-2xl border border-white/10 p-8 bg-neutral-900/40 space-y-6" style={S.frame("rgba(24,24,27,0.4)", "rgba(10,10,10,0.7)")}>
              <div>
                <h2 className="text-2xl font-semibold text-white">E-Commerce Chaos Control Room</h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Inject latency delays and HTTP 500 fault anomalies into monitored microservices or custom websites.
                </p>
              </div>

              {chaosStatus && (
                <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono">
                  {chaosStatus}
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">Target Microservice</label>
                  <select
                    value={chaosTarget}
                    onChange={(e) => setChaosTarget(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-zinc-200 focus:outline-none"
                    style={S.searchInput}
                  >
                    <option value="checkout">checkout-service (Checkout Order API)</option>
                    <option value="payment">payment-service (Payment Gateway API)</option>
                    <option value="inventory">inventory-service (Stock Inventory DB)</option>
                    <option value="cart">cart-service (User Cart Redis Session)</option>
                    <option value="auth">auth-service (Authentication JWT Node)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">Latency Delay (ms)</label>
                  <input
                    type="number"
                    value={chaosLatency}
                    onChange={(e) => setChaosLatency(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-zinc-200 focus:outline-none"
                    style={S.searchInput}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">Error Rate (0.0 - 1.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={chaosErrorRate}
                    onChange={(e) => setChaosErrorRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-zinc-200 focus:outline-none"
                    style={S.searchInput}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button
                  onClick={handleInjectChaos}
                  className="rounded-xl px-6 py-3 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition"
                >
                  Inject Fault Anomaly
                </button>

                <button
                  onClick={handleResetChaos}
                  className="rounded-xl px-6 py-3 text-xs font-semibold border border-white/20 bg-neutral-800 hover:bg-neutral-700 text-white transition"
                >
                  Reset Target Health
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Human Custom Fix Override Modal */}
      {editingIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-lg w-full rounded-2xl border border-white/15 bg-neutral-950 p-6 space-y-5" style={S.operatorsCard}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Custom Human Fix Override</h3>
              <button onClick={() => setEditingIncident(null)} className="text-zinc-400 hover:text-white text-sm font-mono">✕</button>
            </div>

            <div className="space-y-2 text-xs font-mono bg-black/80 p-3 rounded-xl border border-white/10">
              <div className="text-zinc-400">Target: <span className="text-emerald-400 font-bold">{editingIncident.target}</span></div>
              <div className="text-zinc-400">Issue: <span className="text-white">{editingIncident.description}</span></div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">Specify Custom Remediation Command</label>
              <textarea
                value={customFixInput}
                onChange={(e) => setCustomFixInput(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-white/15 bg-neutral-900 p-3 text-xs font-mono text-white focus:outline-none"
                placeholder="e.g. kubectl rollout restart deployment/payment-service"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingIncident(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-medium text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleOverrideSubmit}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white"
              >
                Execute Custom Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
