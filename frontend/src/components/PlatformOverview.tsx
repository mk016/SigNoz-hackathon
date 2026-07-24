"use client";

import Link from "next/link";
import * as styles from "@/lib/styles";

export default function PlatformOverview() {
  const platformFeatures = [
    {
      id: "otlp",
      badge: "OpenTelemetry Native",
      title: "Real-Time OTLP Telemetry Pipeline",
      description: "Seamlessly streams HTTP traces, database span metrics, and API latency logs to SigNoz Cloud via standard gRPC and HTTP/Protobuf exporters.",
      metric: "5s Polling Interval",
      accent: "emerald"
    },
    {
      id: "llm",
      badge: "LLM + RAG Engine",
      title: "GPT-4o Root Cause Analysis",
      description: "Combines real-time telemetry metrics with ChromaDB vector embeddings of historical incidents to generate precise diagnoses and resolution plans.",
      metric: "94.2% AI Accuracy",
      accent: "indigo"
    },
    {
      id: "human",
      badge: "Human Governance",
      title: "Human-in-the-Loop Fix Approval",
      description: "Prevents accidental production outages by requiring human approval. SRE engineers can approve AI recommended fixes with 1 click or supply custom overrides.",
      metric: "Zero Bad Auto-Fixes",
      accent: "amber"
    },
    {
      id: "microservices",
      badge: "E-Commerce Topology",
      title: "Multi-Service Mesh Monitoring",
      description: "Monitors Checkout APIs, Payment Gateways, Stock Inventory DBs, Cart Redis Caches, and Auth JWT Services from a single consolidated dashboard.",
      metric: "5 Core Services",
      accent: "rose"
    }
  ];

  return (
    <section id="platform-overview" className="relative mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <span className="rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-400 border border-indigo-500/20 font-sans">
          Platform Capabilities
        </span>
        <h2 className="font-bebas-neue mt-4 text-4xl tracking-tight sm:text-5xl text-white">
          Autonomous Telemetry & AI Self-Healing Architecture
        </h2>
        <p className="mx-auto max-w-2xl text-zinc-400 font-sans mt-2 text-sm leading-relaxed">
          Explore the core technological primitives driving automated anomaly detection, intelligent root cause analysis, and human safety controls.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {platformFeatures.map((feat) => (
          <div
            key={feat.id}
            className="rounded-2xl border border-white/10 bg-neutral-900/40 p-8 flex flex-col justify-between backdrop-blur-sm"
            style={styles.operatorsCard}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest ${feat.accent === 'emerald' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : feat.accent === 'indigo' ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20' : feat.accent === 'amber' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'}`}>
                  {feat.badge}
                </span>
                <span className="text-xs font-mono text-zinc-500">{feat.metric}</span>
              </div>

              <h3 className="text-xl font-semibold text-white tracking-tight font-sans">
                {feat.title}
              </h3>

              <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                {feat.description}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 flex justify-between items-center text-xs font-mono text-zinc-400">
              <span>Status: Active Engine</span>
              <Link href="/docs" className="text-white hover:text-emerald-400 transition flex items-center gap-1 font-sans font-medium">
                Read Spec →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
