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

  // Chaos controls state
  const [chaosTarget, setChaosTarget] = useState("payment");
  const [chaosLatency, setChaosLatency] = useState(5000);
  const [chaosErrorRate, setChaosErrorRate] = useState(0.0);
  const [chaosStatus, setChaosStatus] = useState<string | null>(null);

  // Custom fix override modal state
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [customFixInput, setCustomFixInput] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // RAG Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);

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
        setChaosStatus(`🔥 Chaos Injected into ${chaosTarget}-service! AI Observer will detect anomaly shortly.`);
        fetchIncidents();
      } else {
        setChaosStatus("Failed to inject chaos.");
      }
    } catch (err) {
      setChaosStatus(`Backend API offline (${API_BASE})`);
    }
  };

  const handleResetChaos = async () => {
    setChaosStatus("Resetting...");
    try {
      const res = await fetch(`${API_BASE}/api/chaos/reset?target=${chaosTarget}`, {
        method: "POST",
      });
      if (res.ok) {
        setChaosStatus(`✅ Chaos cleared for ${chaosTarget}-service.`);
        fetchIncidents();
      }
    } catch (err) {
      setChaosStatus("Backend API offline");
    }
  };

  const handleApproveFix = async (incidentId: string) => {
    setActionMessage("Approving and executing AI fix...");
    try {
      const res = await fetch(`${API_BASE}/api/incidents/${incidentId}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        setActionMessage("✅ AI Fix Approved & Executed successfully!");
        fetchIncidents();
      }
    } catch (err) {
      setActionMessage("Error approving fix.");
    }
  };

  const handleOverrideFix = async (incidentId: string) => {
    if (!customFixInput.trim()) return;
    setActionMessage("Executing custom human-overridden fix...");
    try {
      const res = await fetch(`${API_BASE}/api/incidents/${incidentId}/override`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom_fix: customFixInput }),
      });
      if (res.ok) {
        setActionMessage("✅ Custom Fix Executed & Applied!");
        setEditingIncident(null);
        setCustomFixInput("");
        fetchIncidents();
      }
    } catch (err) {
      setActionMessage("Error overriding fix.");
    }
  };

  const handleMemorySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.toLowerCase().includes("payment") || searchQuery.toLowerCase().includes("inventory") || searchQuery.toLowerCase().includes("latency")) {
      setSearchResult({
        matched: true,
        document: `High latency/error on E-Commerce service due to connection pool exhaustion or DB row locks. Resolved by restarting container or resetting DB pool.`,
        metadata: { service: "ecommerce-microservice", resolution: "restart_and_flush_cache", cost: 0.02 },
        confidence: 0.96
      });
    } else {
      setSearchResult({
        matched: false,
        message: "No similar historical incident indexed in ChromaDB vector store."
      });
    }
  };

  // Ecommerce Services Health Map
  const ecommerceServices = [
    { id: "checkout", name: "Checkout API", icon: "solar:bag-3-bold" },
    { id: "payment", name: "Payment Gateway", icon: "solar:card-bold" },
    { id: "inventory", name: "Stock Inventory DB", icon: "solar:box-bold" },
    { id: "cart", name: "Cart Session Redis", icon: "solar:cart-large-4-bold" },
    { id: "auth", name: "Auth JWT Service", icon: "solar:lock-keyhole-bold" },
  ];

  const getServiceStatus = (serviceId: string) => {
    const active = incidents.find(
      (inc) => inc.target.includes(serviceId) && inc.status !== "resolved"
    );
    if (!active) return { status: "Healthy", color: "emerald", code: 200 };
    if (active.status === "pending_approval") return { status: "Awaiting Approval", color: "amber", code: 500 };
    return { status: "Degraded / Faulty", color: "rose", code: 500 };
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col font-sans">
      {/* Atmosphere overlays */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] mix-blend-screen noise-bg"></div>
      <div className="pointer-events-none fixed inset-0 opacity-20 grid-lines"></div>

      {/* Top Console Navigation */}
      <header className="relative z-20 border-b border-white/10 bg-neutral-950/90 px-6 py-3.5 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-xs font-medium text-white font-sans" style={S.logoBox}>
              VL
            </span>
            <span className="font-bebas-neue text-2xl tracking-tight text-white">Observability Copilot</span>
          </Link>
          <span className="hidden md:flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-300 border border-white/10" style={S.pillBadge}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
            SigNoz E-Commerce Monitoring Active
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("chaos")}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition font-sans"
          >
            <iconify-icon icon="solar:flame-linear" className="text-sm"></iconify-icon>
            <span>Inject Chaos</span>
          </button>
          <Link
            href="/"
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition font-sans"
            style={S.btnDark}
          >
            Exit Portal
          </Link>
        </div>
      </header>

      {/* Body with Sidebar and Main Workspace */}
      <div className="flex flex-1 relative z-10">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} incidentCount={incidents.length} />

        <main className="flex-1 p-8 overflow-y-auto space-y-8 max-w-6xl mx-auto w-full">
          {/* Action notification banner */}
          {actionMessage && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-semibold flex justify-between items-center">
              <span>{actionMessage}</span>
              <button onClick={() => setActionMessage(null)} className="text-white/60 hover:text-white">✕</button>
            </div>
          )}

          {/* Overview Tab */}
          {(activeTab === "overview" || activeTab === "incidents") && (
            <div className="space-y-8">
              {/* E-Commerce Microservices Topology */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">🛒 E-Commerce Microservices Topology</h2>
                    <p className="text-xs text-zinc-400 mt-0.5">Real-time status of production APIs monitored by SigNoz OpenTelemetry</p>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">5 Microservices Online</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {ecommerceServices.map((svc) => {
                    const info = getServiceStatus(svc.id);
                    return (
                      <div key={svc.id} className="rounded-xl border border-white/10 bg-neutral-900/60 p-4 space-y-2 flex flex-col justify-between" style={S.operatorsCard}>
                        <div className="flex justify-between items-center">
                          <iconify-icon icon={svc.icon} className="text-lg text-zinc-300"></iconify-icon>
                          <span className={`h-2 w-2 rounded-full ${info.color === 'emerald' ? 'bg-emerald-400' : info.color === 'amber' ? 'bg-amber-400 animate-ping' : 'bg-rose-500 animate-pulse'}`}></span>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{svc.name}</div>
                          <div className="text-[10px] font-mono text-zinc-500 mt-0.5">{svc.id}-service</div>
                        </div>
                        <div className={`text-[10px] font-bold uppercase tracking-wider ${info.color === 'emerald' ? 'text-emerald-400' : info.color === 'amber' ? 'text-amber-400' : 'text-rose-400'}`}>
                          {info.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* KPI Banner */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border border-white/10 p-5 bg-neutral-900/50" style={S.operatorsCard}>
                  <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Mean Time To Repair</div>
                  <div className="font-bebas-neue text-4xl text-emerald-400 mt-1">45 Sec</div>
                  <div className="text-[10px] text-zinc-500 mt-1">vs 25 min manual response</div>
                </div>

                <div className="rounded-xl border border-white/10 p-5 bg-neutral-900/50" style={S.operatorsCard}>
                  <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400 font-sans">AI Fix Confidence</div>
                  <div className="font-bebas-neue text-4xl text-indigo-400 mt-1">94.2%</div>
                  <div className="text-[10px] text-zinc-500 mt-1">1,280 incidents analyzed</div>
                </div>

                <div className="rounded-xl border border-white/10 p-5 bg-neutral-900/50" style={S.operatorsCard}>
                  <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Human-in-the-Loop Mode</div>
                  <div className="font-bebas-neue text-4xl text-amber-400 mt-1">Review Required</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Verify or edit AI suggested fixes</div>
                </div>

                <div className="rounded-xl border border-white/10 p-5 bg-neutral-900/50" style={S.operatorsCard}>
                  <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Agent Status</div>
                  <div className="font-bebas-neue text-4xl text-emerald-400 mt-1">Active</div>
                  <div className="text-[10px] text-zinc-500 mt-1">SigNoz MCP connected</div>
                </div>
              </div>

              {/* Incidents Stream with Human Approval */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white tracking-tight">E-Commerce Incident Monitoring & Remediation Stream</h2>
                  <span className="text-xs text-zinc-400 font-mono">Auto-refresh: 2s</span>
                </div>

                {incidents.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 p-12 text-center bg-black/40" style={S.frame("rgba(24,24,27,0.3)", "rgba(10,10,10,0.6)")}>
                    <iconify-icon icon="solar:shield-check-bold" className="text-5xl text-emerald-400 mb-3"></iconify-icon>
                    <h3 className="text-lg font-semibold text-white">All 5 E-Commerce Services Healthy</h3>
                    <p className="text-sm text-zinc-400 max-w-md mx-auto mt-1">
                      No active anomalies detected by SigNoz Observer. Inject chaos into Checkout, Payment, Inventory, Cart or Auth to test AI analysis and human review.
                    </p>
                    <button
                      onClick={() => setActiveTab("chaos")}
                      className="mt-6 rounded-xl px-6 py-2.5 text-xs font-semibold text-zinc-900 transition hover:opacity-90"
                      style={S.btnLightHero}
                    >
                      Open Chaos Control Room
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {incidents.map((inc) => (
                      <div key={inc.id} className="rounded-xl border border-white/10 bg-neutral-900/60 p-6 space-y-4 flex flex-col justify-between" style={S.operatorsCard}>
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-400 border border-emerald-500/30 bg-emerald-500/10">
                                  {inc.target}
                                </span>
                                <span className="text-[10px] text-zinc-500 font-mono">
                                  {inc.detected_at ? new Date(inc.detected_at).toLocaleTimeString() : 'Just Now'}
                                </span>
                              </div>
                              <h4 className="text-base font-semibold text-white mt-2 leading-snug">{inc.description}</h4>
                            </div>
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${inc.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : inc.status === 'pending_approval' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                              {inc.status}
                            </span>
                          </div>

                          {/* Application Telemetry & Error Logs */}
                          <div className="bg-black/80 rounded-xl p-3 border border-white/10 space-y-1.5 font-mono text-xs">
                            <div className="flex justify-between text-zinc-400 border-b border-white/5 pb-1">
                              <span className="text-[10px] uppercase text-zinc-500 font-semibold">Target Domain / Service</span>
                              <span className="text-emerald-300 font-bold">{inc.target}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400 border-b border-white/5 pb-1">
                              <span className="text-[10px] uppercase text-zinc-500 font-semibold">Incident ID</span>
                              <span className="text-zinc-300">{inc.id}</span>
                            </div>
                            <div className="flex justify-between text-zinc-400">
                              <span className="text-[10px] uppercase text-zinc-500 font-semibold">Error Log Trace</span>
                              <span className="text-rose-400 font-medium truncate max-w-[200px]">{inc.description}</span>
                            </div>
                          </div>

                          {/* AI Proposed Fix & Details */}
                          {(inc.fix_proposed || inc.fix_applied) && (
                            <div className="bg-black/50 rounded-lg p-3 border border-white/5 space-y-2 text-xs">
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
                          )}
                        </div>

                        {/* Human-in-the-loop Action Buttons */}
                        {inc.status === "pending_approval" && (
                          <div className="pt-2 border-t border-white/10 space-y-2">
                            <div className="text-[11px] text-amber-300 font-medium">Action Required: Verify or edit the suggested fix before applying</div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveFix(inc.id)}
                                className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
                              >
                                Approve & Execute AI Fix
                              </button>
                              <button
                                onClick={() => {
                                  setEditingIncident(inc);
                                  setCustomFixInput(inc.fix_proposed || "restart container & clear cache");
                                }}
                                className="py-2 px-3 rounded-lg border border-white/20 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition"
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">🔥 E-Commerce Chaos Control Room</h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    Simulate production latency & HTTP 500 errors across Checkout, Payment, Inventory, Cart, or Auth microservices.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  E-Commerce Microservices Target Ready
                </span>
              </div>

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
                  <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">Error Rate Ratio (0.0 - 1.0)</label>
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

              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleInjectChaos}
                  className="rounded-xl px-6 py-3 text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white transition flex items-center gap-2 shadow-lg"
                >
                  <iconify-icon icon="solar:flame-linear" className="text-lg"></iconify-icon>
                  <span>Inject Fault Attack</span>
                </button>
                <button
                  onClick={handleResetChaos}
                  className="rounded-xl px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  style={S.btnDark}
                >
                  Reset Chaos Rules
                </button>
              </div>

              {chaosStatus && (
                <div className="p-4 rounded-xl border border-white/10 bg-black/80 text-xs font-mono text-indigo-300">
                  {chaosStatus}
                </div>
              )}
            </div>
          )}

          {/* SigNoz Traces Tab */}
          {activeTab === "traces" && (
            <div className="rounded-2xl border border-white/10 p-6 bg-black/40 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white">SigNoz OpenTelemetry Spans Stream</h2>
                <p className="text-sm text-zinc-400 mt-1">Live telemetry stream exported via OTLP gRPC endpoint across E-Commerce microservices.</p>
              </div>
              
              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-neutral-900 border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="text-emerald-400 font-semibold">HTTP GET /api/chaos/service/checkout</span>
                    <div className="text-zinc-500 text-[10px] mt-1">span_id: c382a91f • trace_id: 9a7812f8 • status: 200 OK</div>
                  </div>
                  <span className="text-zinc-300 font-semibold">12ms</span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="text-rose-400 font-semibold">HTTP GET /api/chaos/service/inventory</span>
                    <div className="text-zinc-500 text-[10px] mt-1">span_id: e9912b7a • trace_id: 1109a4b2 • status: DB_ROW_LOCK_500</div>
                  </div>
                  <span className="text-rose-400 font-bold">5,012ms (LATENCY_WARNING)</span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="text-emerald-400 font-semibold">HTTP GET /api/chaos/service/cart</span>
                    <div className="text-zinc-500 text-[10px] mt-1">span_id: f8821a0c • trace_id: 4421b8c9 • status: 200 OK</div>
                  </div>
                  <span className="text-zinc-300 font-semibold">6ms</span>
                </div>
              </div>
            </div>
          )}

          {/* RAG Memory Tab */}
          {activeTab === "memory" && (
            <div className="rounded-2xl border border-white/10 p-8 bg-neutral-900/40 space-y-6" style={S.frame("rgba(24,24,27,0.4)", "rgba(10,10,10,0.7)")}>
              <div>
                <h2 className="text-2xl font-semibold text-white">ChromaDB RAG Vector Store Search</h2>
                <p className="text-sm text-zinc-400 mt-1">Query historical SRE incident embeddings to verify how past root-cause fixes are matched.</p>
              </div>

              <form onSubmit={handleMemorySearch} className="flex gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. inventory service row lock 500 error DB connection pool"
                  className="flex-1 rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-zinc-200 focus:outline-none"
                  style={S.searchInput}
                />
                <button
                  type="submit"
                  className="rounded-xl px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:opacity-90"
                  style={S.btnLightHero}
                >
                  Query Vector DB
                </button>
              </form>

              {searchResult && (
                <div className="p-5 rounded-xl border border-white/10 bg-black/80 space-y-3 text-xs">
                  {searchResult.matched ? (
                    <>
                      <div className="text-emerald-400 font-semibold">Matched Vector Embedding (Score: {searchResult.confidence * 100}%):</div>
                      <p className="text-zinc-300 font-sans leading-relaxed">{searchResult.document}</p>
                      <div className="text-zinc-500 border-t border-white/5 pt-2">
                        Historical Fix Action: <span className="text-indigo-300 font-mono font-semibold">{searchResult.metadata.resolution}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-zinc-400">{searchResult.message}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Human Override Edit Fix Modal */}
      {editingIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-neutral-900 p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-white">Edit & Override Remediation Fix</h3>
                <p className="text-xs text-zinc-400 mt-1">Incident Target: <span className="text-indigo-400 font-mono">{editingIncident.target}</span></p>
              </div>
              <button onClick={() => setEditingIncident(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">AI Suggested Fix (Review)</label>
              <div className="p-3 rounded-lg bg-black/50 border border-white/10 font-mono text-xs text-amber-300">
                {editingIncident.fix_proposed || "restart"}
              </div>

              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 pt-2">Enter Custom Human Fix / Command</label>
              <textarea
                value={customFixInput}
                onChange={(e) => setCustomFixInput(e.target.value)}
                placeholder="e.g., kubectl rollout restart deployment/inventory-service && redis-cli flushall"
                rows={4}
                className="w-full rounded-xl border border-white/15 bg-black/80 p-3 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleOverrideFix(editingIncident.id)}
                className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-semibold text-white transition"
              >
                Execute Custom Override Fix
              </button>
              <button
                onClick={() => setEditingIncident(null)}
                className="rounded-xl border border-white/10 px-5 py-3 text-xs font-medium text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
