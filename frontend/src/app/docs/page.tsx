"use client";

import { useState } from "react";
import Link from "next/link";
import * as S from "@/lib/styles";

export default function DocsPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"nextjs" | "python" | "nodejs" | "api" | "signoz">("nextjs");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const nextjsSdkCode = `// File: src/lib/copilot-sdk.ts
export interface CopilotPayload {
  serviceName: string;
  errorMessage: string;
  environment?: string;
  metadata?: Record<string, any>;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_COPILOT_BACKEND || "https://observability-copilot-backend.onrender.com";

/**
 * Sends an application error report to Observability Copilot.
 * Automatically triggers LLM Root Cause Analysis and creates an incident ticket.
 */
export async function trackError(payload: CopilotPayload): Promise<void> {
  try {
    const response = await fetch(\`\${BACKEND_URL}/api/incidents/\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: \`inc_\${Date.now()}\`,
        target: payload.serviceName,
        status: "detected",
        description: payload.errorMessage,
        detected_at: new Date().toISOString(),
        approval_mode: "manual"
      })
    });

    if (!response.ok) {
      console.warn("[Observability Copilot] Incident report rejected with status:", response.status);
    }
  } catch (error) {
    console.error("[Observability Copilot] Failed to deliver error payload:", error);
  }
}`;

  const nextjsUsageCode = `// File: app/api/checkout/route.ts (or any Server Action / Route)
import { NextResponse } from "next/server";
import { trackError } from "@/lib/copilot-sdk";

export async function POST(request: Request) {
  try {
    // Business logic: Process payment transaction
    const body = await request.json();
    if (!body.paymentToken) {
      throw new Error("Payment gateway connection timeout during authorization step");
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Send telemetry alert to Observability Copilot
    await trackError({
      serviceName: "checkout-service",
      errorMessage: error.message,
      environment: "production"
    });

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}`;

  const pythonOtelCode = `# Install OpenTelemetry distribution and OTLP exporter
pip install opentelemetry-distro opentelemetry-exporter-otlp python-dotenv

# Auto-instrument all installed dependencies
opentelemetry-bootstrap --action=install

# Configure environment variables in .env
OTEL_RESOURCE_ATTRIBUTES=service.name=payment-service,service.version=1.0.0
OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.us2.signoz.cloud:443
OTEL_EXPORTER_OTLP_HEADERS=signoz-ingestion-key=YOUR_SIGNOZ_INGESTION_KEY
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf

# Launch application with auto-instrumentation
opentelemetry-instrument python app/main.py`;

  const nodejsOtelCode = `// File: tracing.js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'https://ingest.us2.signoz.cloud:443/v1/traces',
    headers: {
      'signoz-ingestion-key': process.env.SIGNOZ_INGESTION_KEY
    }
  }),
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();`;

  const apiCurlCode = `# 1. Report an Incident / Error Alert
curl -X POST "https://observability-copilot-backend.onrender.com/api/incidents/" \\
  -H "Content-Type: application/json" \\
  -d '{
    "id": "inc_102938",
    "target": "inventory-service",
    "status": "detected",
    "description": "Database connection pool exhausted on stock verification",
    "detected_at": "2026-07-24T12:00:00Z",
    "approval_mode": "manual"
  }'

# 2. Approve AI Proposed Fix
curl -X POST "https://observability-copilot-backend.onrender.com/api/incidents/inc_102938/approve"

# 3. Override Fix with Custom Human Command
curl -X POST "https://observability-copilot-backend.onrender.com/api/incidents/inc_102938/override" \\
  -H "Content-Type: application/json" \\
  -d '{
    "custom_fix": "kubectl rollout restart deployment/inventory-service && redis-cli flushall"
  }'`;

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col font-sans">
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] mix-blend-screen noise-bg"></div>
      <div className="pointer-events-none fixed inset-0 opacity-20 grid-lines"></div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-neutral-950/90 px-6 py-4 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-xs font-medium text-white font-sans" style={S.logoBox}>
              VL
            </span>
            <span className="font-bebas-neue text-2xl tracking-tight text-white">Observability Copilot Documentation</span>
          </Link>
          <span className="hidden md:flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-300 border border-white/10" style={S.pillBadge}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Technical Specification v1.0.0
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg border border-white/20 px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white transition font-sans"
            style={S.btnDark}
          >
            Open Console
          </Link>
        </div>
      </header>

      {/* Main Documentation Container */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-10 gap-8 relative z-10">
        {/* Navigation Sidebar */}
        <aside className="w-64 hidden lg:block space-y-2 sticky top-10 h-fit">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-3 px-3">Integration Modules</div>
          
          <button
            onClick={() => setActiveTab("nextjs")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition flex items-center justify-between ${activeTab === 'nextjs' ? 'bg-white/10 text-white border border-white/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
          >
            <span>Next.js Application SDK</span>
            <span className="text-[10px] text-emerald-400 font-mono">SDK</span>
          </button>

          <button
            onClick={() => setActiveTab("python")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition flex items-center justify-between ${activeTab === 'python' ? 'bg-white/10 text-white border border-white/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
          >
            <span>Python & OpenTelemetry</span>
            <span className="text-[10px] text-indigo-400 font-mono">OTel</span>
          </button>

          <button
            onClick={() => setActiveTab("nodejs")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition flex items-center justify-between ${activeTab === 'nodejs' ? 'bg-white/10 text-white border border-white/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
          >
            <span>Node.js / Express Tracing</span>
            <span className="text-[10px] text-zinc-400 font-mono">Node</span>
          </button>

          <button
            onClick={() => setActiveTab("api")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition flex items-center justify-between ${activeTab === 'api' ? 'bg-white/10 text-white border border-white/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
          >
            <span>REST API Reference</span>
            <span className="text-[10px] text-amber-400 font-mono">HTTP</span>
          </button>

          <button
            onClick={() => setActiveTab("signoz")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition flex items-center justify-between ${activeTab === 'signoz' ? 'bg-white/10 text-white border border-white/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
          >
            <span>SigNoz Alertmanager Setup</span>
            <span className="text-[10px] text-rose-400 font-mono">Cloud</span>
          </button>
        </aside>

        {/* Content Body */}
        <main className="flex-1 space-y-10 max-w-4xl">
          {/* Section: Next.js SDK */}
          {activeTab === "nextjs" && (
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest text-emerald-400 border border-emerald-500/20 bg-emerald-500/10">
                    Client Integration
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">Next.js 13+ / 14+</span>
                </div>
                <h1 className="text-3xl font-semibold text-white tracking-tight mt-3">Next.js Application Integration Guide</h1>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed font-sans">
                  Follow this step-by-step reference to connect any Next.js application to Observability Copilot. This enables automated error capture, LLM Root Cause Analysis, and Human-in-the-Loop remediation workflows.
                </p>
              </div>

              {/* Step 1 */}
              <div className="rounded-2xl border border-white/10 p-6 bg-neutral-900/50 space-y-4" style={S.frame("rgba(24,24,27,0.4)", "rgba(10,10,10,0.7)")}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Step 1 of 2</span>
                    <h3 className="text-base font-semibold text-white mt-0.5">Create SDK Helper File</h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(nextjsSdkCode, "nextjs_sdk")}
                    className="px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 hover:bg-white/10 text-xs font-mono text-zinc-300 transition"
                  >
                    {copiedSection === 'nextjs_sdk' ? 'Copied' : 'Copy SDK Code'}
                  </button>
                </div>
                <p className="text-xs text-zinc-400">
                  Save the following file in your Next.js project as <code className="text-emerald-300 font-mono">src/lib/copilot-sdk.ts</code>.
                </p>
                <pre className="p-4 rounded-xl bg-black/80 border border-white/5 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
                  <code>{nextjsSdkCode}</code>
                </pre>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border border-white/10 p-6 bg-neutral-900/50 space-y-4" style={S.frame("rgba(24,24,27,0.4)", "rgba(10,10,10,0.7)")}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Step 2 of 2</span>
                    <h3 className="text-base font-semibold text-white mt-0.5">Invoke Error Reporter</h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(nextjsUsageCode, "nextjs_usage")}
                    className="px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 hover:bg-white/10 text-xs font-mono text-zinc-300 transition"
                  >
                    {copiedSection === 'nextjs_usage' ? 'Copied' : 'Copy Example'}
                  </button>
                </div>
                <p className="text-xs text-zinc-400">
                  Import <code className="text-emerald-300 font-mono">trackError</code> inside your API routes, Server Actions, or catch blocks.
                </p>
                <pre className="p-4 rounded-xl bg-black/80 border border-white/5 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
                  <code>{nextjsUsageCode}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Section: Python */}
          {activeTab === "python" && (
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest text-indigo-400 border border-indigo-500/20 bg-indigo-500/10">
                    OpenTelemetry Protocol
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">Python 3.9+</span>
                </div>
                <h1 className="text-3xl font-semibold text-white tracking-tight mt-3">Python & FastAPI Instrumentation</h1>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                  Configure OpenTelemetry Python SDK to export traces to SigNoz Cloud via OTLP gRPC/HTTP endpoints.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 p-6 bg-neutral-900/50 space-y-4" style={S.frame("rgba(24,24,27,0.4)", "rgba(10,10,10,0.7)")}>
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-semibold text-white">Environment & Execution Commands</h3>
                  <button
                    onClick={() => copyToClipboard(pythonOtelCode, "python_otel")}
                    className="px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 hover:bg-white/10 text-xs font-mono text-zinc-300 transition"
                  >
                    {copiedSection === 'python_otel' ? 'Copied' : 'Copy Commands'}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-black/80 border border-white/5 font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed">
                  <code>{pythonOtelCode}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Section: Node.js */}
          {activeTab === "nodejs" && (
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest text-zinc-300 border border-white/10 bg-white/5">
                    Node.js Runtime
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">Express / NestJS</span>
                </div>
                <h1 className="text-3xl font-semibold text-white tracking-tight mt-3">Node.js Tracing Setup</h1>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                  Export HTTP server requests, database queries, and error traces to SigNoz Cloud OTLP collector.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 p-6 bg-neutral-900/50 space-y-4" style={S.frame("rgba(24,24,27,0.4)", "rgba(10,10,10,0.7)")}>
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-semibold text-white">OpenTelemetry NodeSDK Initialization</h3>
                  <button
                    onClick={() => copyToClipboard(nodejsOtelCode, "nodejs_otel")}
                    className="px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 hover:bg-white/10 text-xs font-mono text-zinc-300 transition"
                  >
                    {copiedSection === 'nodejs_otel' ? 'Copied' : 'Copy Code'}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-black/80 border border-white/5 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
                  <code>{nodejsOtelCode}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Section: API Reference */}
          {activeTab === "api" && (
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest text-amber-400 border border-amber-500/20 bg-amber-500/10">
                    REST API Specification
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">OpenAPI 3.1</span>
                </div>
                <h1 className="text-3xl font-semibold text-white tracking-tight mt-3">Backend REST API Reference</h1>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                  Direct HTTP endpoint contracts for incident ingestion, human approval, and custom fix overrides.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 p-6 bg-neutral-900/50 space-y-4" style={S.frame("rgba(24,24,27,0.4)", "rgba(10,10,10,0.7)")}>
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-semibold text-white">cURL Commands Reference</h3>
                  <button
                    onClick={() => copyToClipboard(apiCurlCode, "api_curl")}
                    className="px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 hover:bg-white/10 text-xs font-mono text-zinc-300 transition"
                  >
                    {copiedSection === 'api_curl' ? 'Copied' : 'Copy Commands'}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-black/80 border border-white/5 font-mono text-xs text-amber-300 overflow-x-auto leading-relaxed">
                  <code>{apiCurlCode}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Section: SigNoz */}
          {activeTab === "signoz" && (
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest text-rose-400 border border-rose-500/20 bg-rose-500/10">
                    Alerting Pipeline
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">SigNoz Cloud</span>
                </div>
                <h1 className="text-3xl font-semibold text-white tracking-tight mt-3">SigNoz Cloud Alertmanager Webhook Integration</h1>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                  Connect SigNoz Cloud anomaly alerts to automatically trigger LLM Root Cause Analysis and SRE tickets.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 p-6 bg-neutral-900/50 space-y-4" style={S.frame("rgba(24,24,27,0.4)", "rgba(10,10,10,0.7)")}>
                <h3 className="text-base font-semibold text-white">Step-by-Step Webhook Setup</h3>
                <ol className="list-decimal list-inside space-y-3 text-xs text-zinc-300 leading-relaxed font-sans">
                  <li>Log in to your <strong className="text-white">SigNoz Cloud Console</strong>.</li>
                  <li>Navigate to <strong className="text-white">Alerts ➔ Alert Rules ➔ New Alert Rule</strong>.</li>
                  <li>Configure metric or trace latency trigger (e.g. <code className="text-amber-300 font-mono">P99 Latency &gt; 2000ms</code>).</li>
                  <li>Under Alert Destination, select <strong className="text-white">Webhook</strong> and set endpoint URL to:
                    <div className="p-3 mt-2 rounded-lg bg-black/80 border border-white/10 font-mono text-emerald-400">
                      https://observability-copilot-backend.onrender.com/api/incidents/
                    </div>
                  </li>
                  <li>Save rule. Alerts will now stream live to your SRE Copilot Dashboard.</li>
                </ol>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
