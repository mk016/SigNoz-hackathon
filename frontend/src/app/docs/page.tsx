"use client";

import { useState } from "react";
import Link from "next/link";
import * as S from "@/lib/styles";

export default function DocsPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"nextjs" | "python" | "signoz" | "human">("nextjs");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const nextjsCode = `// 1. Create src/copilot.ts in your Next.js project
const COPILOT_BACKEND = "https://observability-copilot-backend.onrender.com";

export async function trackError(errorMessage: string, serviceName = "my-nextjs-website") {
  try {
    await fetch(\`\${COPILOT_BACKEND}/api/incidents/\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: \`inc_\${Date.now()}\`,
        target: serviceName,
        status: "detected",
        description: errorMessage,
        detected_at: new Date().toISOString(),
        approval_mode: "manual"
      })
    });
    console.log("⚡ [Observability Copilot] Alert sent to Live Dashboard!");
  } catch (err) {
    console.error("Alert failed:", err);
  }
}`;

  const nextjsUsage = `// 2. Call trackError anywhere in your Next.js Page, API Route or Catch Block
import { trackError } from "@/copilot";

try {
  // Your website business logic (e.g. checkout, payment)
} catch (error) {
  // 1-Line Error Tracking to Observability Copilot
  trackError("Payment gateway connection failed", "my-ecommerce-store");
}`;

  const pythonCode = `# Install OpenTelemetry packages
pip install opentelemetry-distro opentelemetry-exporter-otlp
opentelemetry-bootstrap --action=install

# Set environment variables for SigNoz & run app
export OTEL_RESOURCE_ATTRIBUTES="service.name=my-python-app,service.version=1.0.0"
export OTEL_EXPORTER_OTLP_ENDPOINT="https://ingest.us2.signoz.cloud:443"
export OTEL_EXPORTER_OTLP_HEADERS="signoz-ingestion-key=YOUR_SIGNOZ_KEY"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"

opentelemetry-instrument python main.py`;

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col font-sans">
      {/* Background Overlays */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] mix-blend-screen noise-bg"></div>
      <div className="pointer-events-none fixed inset-0 opacity-20 grid-lines"></div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-neutral-950/90 px-6 py-4 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-xs font-medium text-white font-sans" style={S.logoBox}>
              VL
            </span>
            <span className="font-bebas-neue text-2xl tracking-tight text-white">Observability Copilot Docs</span>
          </Link>
          <span className="hidden md:flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-400 border border-emerald-500/20 bg-emerald-500/10">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
            Integration Documentation v1.0
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold text-zinc-900 bg-white hover:bg-zinc-200 transition font-sans"
          >
            Open Console →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-10 gap-8 relative z-10">
        {/* Navigation Sidebar */}
        <aside className="w-64 hidden lg:block space-y-2 sticky top-10 h-fit">
          <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 px-3">Documentation Index</div>
          <button
            onClick={() => setActiveTab("nextjs")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition flex items-center justify-between ${activeTab === 'nextjs' ? 'bg-white/10 text-white border border-white/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
          >
            <span>🚀 Next.js Quickstart</span>
            <span className="text-[10px] text-emerald-400 font-mono">2 Steps</span>
          </button>

          <button
            onClick={() => setActiveTab("python")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition flex items-center justify-between ${activeTab === 'python' ? 'bg-white/10 text-white border border-white/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
          >
            <span>🐍 Python & FastAPI</span>
            <span className="text-[10px] text-indigo-400 font-mono">OTel</span>
          </button>

          <button
            onClick={() => setActiveTab("signoz")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition flex items-center justify-between ${activeTab === 'signoz' ? 'bg-white/10 text-white border border-white/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
          >
            <span>📊 SigNoz Alert Webhooks</span>
            <span className="text-[10px] text-amber-400 font-mono">Cloud</span>
          </button>

          <button
            onClick={() => setActiveTab("human")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition flex items-center justify-between ${activeTab === 'human' ? 'bg-white/10 text-white border border-white/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
          >
            <span>🛡️ Human-in-the-Loop Fix</span>
            <span className="text-[10px] text-rose-400 font-mono">Control</span>
          </button>
        </aside>

        {/* Documentation Body */}
        <main className="flex-1 space-y-8 max-w-4xl">
          {/* Next.js Guide */}
          {activeTab === "nextjs" && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/30 bg-emerald-500/10">
                    Recommended Integration
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">Est. setup: 2 mins</span>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight mt-2">Next.js 1-Line Plug & Play Integration</h1>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                  Connect any Next.js app (App Router or Pages Router) to Observability Copilot. Instantly stream caught errors to your live SRE Dashboard for LLM Root Cause Analysis and Human Fix Approval.
                </p>
              </div>

              {/* Step 1 Card */}
              <div className="rounded-2xl border border-white/10 p-6 bg-neutral-900/50 space-y-4" style={S.frame("rgba(24,24,27,0.4)", "rgba(10,10,10,0.7)")}>
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">1</span>
                    Create <code className="text-emerald-300 font-mono text-xs">src/copilot.ts</code>
                  </h3>
                  <button
                    onClick={() => copyToClipboard(nextjsCode, "step1")}
                    className="px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 hover:bg-white/10 text-xs font-mono text-zinc-300 transition flex items-center gap-1.5"
                  >
                    <iconify-icon icon={copiedSection === 'step1' ? 'solar:check-circle-bold' : 'solar:copy-linear'} className="text-sm"></iconify-icon>
                    <span>{copiedSection === 'step1' ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-black/80 border border-white/5 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
                  <code>{nextjsCode}</code>
                </pre>
              </div>

              {/* Step 2 Card */}
              <div className="rounded-2xl border border-white/10 p-6 bg-neutral-900/50 space-y-4" style={S.frame("rgba(24,24,27,0.4)", "rgba(10,10,10,0.7)")}>
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">2</span>
                    Call <code className="text-emerald-300 font-mono text-xs">trackError()</code> Anywhere
                  </h3>
                  <button
                    onClick={() => copyToClipboard(nextjsUsage, "step2")}
                    className="px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 hover:bg-white/10 text-xs font-mono text-zinc-300 transition flex items-center gap-1.5"
                  >
                    <iconify-icon icon={copiedSection === 'step2' ? 'solar:check-circle-bold' : 'solar:copy-linear'} className="text-sm"></iconify-icon>
                    <span>{copiedSection === 'step2' ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-black/80 border border-white/5 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
                  <code>{nextjsUsage}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Python Guide */}
          {activeTab === "python" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Python & FastAPI OpenTelemetry Setup</h1>
                <p className="text-sm text-zinc-400 mt-2">
                  Instrument any Python application with OpenTelemetry SDK and export live OTLP traces directly to SigNoz Cloud and Observability Copilot.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 p-6 bg-neutral-900/50 space-y-4" style={S.frame("rgba(24,24,27,0.4)", "rgba(10,10,10,0.7)")}>
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-semibold text-white">Auto-Instrumentation Shell Commands</h3>
                  <button
                    onClick={() => copyToClipboard(pythonCode, "python")}
                    className="px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 hover:bg-white/10 text-xs font-mono text-zinc-300 transition flex items-center gap-1.5"
                  >
                    <iconify-icon icon={copiedSection === 'python' ? 'solar:check-circle-bold' : 'solar:copy-linear'} className="text-sm"></iconify-icon>
                    <span>{copiedSection === 'python' ? 'Copied!' : 'Copy Commands'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-black/80 border border-white/5 font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed">
                  <code>{pythonCode}</code>
                </pre>
              </div>
            </div>
          )}

          {/* SigNoz Webhook Guide */}
          {activeTab === "signoz" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">SigNoz Cloud Alertmanager Webhook</h1>
                <p className="text-sm text-zinc-400 mt-2">
                  Configure SigNoz Cloud to trigger automatic incident tickets on Observability Copilot whenever latency spikes or HTTP 500 error rates occur.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 p-6 bg-neutral-900/50 space-y-4" style={S.frame("rgba(24,24,27,0.4)", "rgba(10,10,10,0.7)")}>
                <h3 className="text-base font-semibold text-white">Configuration Steps in SigNoz UI</h3>
                <ol className="list-decimal list-inside space-y-3 text-xs text-zinc-300 leading-relaxed font-sans">
                  <li>Open your <strong className="text-white">SigNoz Cloud Dashboard</strong> (e.g. <code className="text-amber-300 font-mono">meet-stag.us2.signoz.cloud</code>).</li>
                  <li>Navigate to <strong className="text-white">Alerts ➔ Alert Rules ➔ New Alert Rule</strong>.</li>
                  <li>Set metric condition: <code className="text-amber-300 font-mono">P99 Latency &gt; 2000ms</code> OR <code className="text-amber-300 font-mono">Error Rate &gt; 1%</code>.</li>
                  <li>Under Alert Destination, select <strong className="text-white">Webhook</strong> and paste your Copilot Live URL:
                    <div className="p-3 mt-2 rounded-lg bg-black/80 border border-white/10 font-mono text-emerald-400">
                      https://observability-copilot-backend.onrender.com/api/incidents/
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* Human Control Guide */}
          {activeTab === "human" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Human-in-the-Loop Fix & Custom Override</h1>
                <p className="text-sm text-zinc-400 mt-2">
                  Learn how Observability Copilot ensures enterprise safety by requiring SRE review before executing remediation actions.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 p-5 bg-neutral-900/50 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">1-Click Approve AI Fix</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Review the AI Root Cause Analysis, Confidence score, and cost impact. Click <strong className="text-white">Approve & Execute</strong> to instantly apply the recommended fix.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 p-5 bg-neutral-900/50 space-y-2">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">Edit & Custom Override</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    If the AI proposed fix isn&apos;t optimal, click <strong className="text-white">Edit / Override Fix</strong> to type custom CLI commands, SQL queries, or container restarts before execution.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
