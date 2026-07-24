"use client";

import { useState } from "react";
import * as styles from "@/lib/styles";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FaqItem[] = [
  {
    category: "Architecture & Detection",
    question: "What is Observability Copilot and how does it detect anomalies?",
    answer: "Observability Copilot is an AI-powered Self-Healing SRE Platform. It monitors your application telemetry via native OpenTelemetry (OTLP) tracers and SigNoz Cloud. Every 5 seconds, the AI Observer Agent evaluates service latency and HTTP response codes. If latency exceeds 2000ms or 5xx server errors occur, an anomaly incident is automatically created."
  },
  {
    category: "Safety & Governance",
    question: "How does the Human-in-the-Loop approval mechanism work?",
    answer: "To prevent autonomous AI agents from executing destructive commands in production, Observability Copilot uses a Human-in-the-Loop review state. When an anomaly is detected, the AI generates a Root Cause Analysis, confidence score, and cost impact, but sets the ticket status to 'Awaiting Approval'. SRE engineers can approve the fix with 1 click or edit the remediation command before execution."
  },
  {
    category: "Integrations & Setup",
    question: "How do I integrate Observability Copilot into my existing website or app?",
    answer: "You can integrate Observability Copilot into any website in under 2 minutes. For Next.js applications, drop our 1-line helper SDK into your app and call trackError(). For Python, Node.js, Go, or Java backends, configure standard OpenTelemetry OTLP environment variables pointing to SigNoz Cloud or our REST API."
  },
  {
    category: "AI & Vector Memory",
    question: "How does the ChromaDB RAG Vector Store assist in Root Cause Analysis?",
    answer: "Every incident and past resolution is indexed into ChromaDB vector embeddings. When a new anomaly occurs, the AI Engine performs semantic similarity search against past incidents. If a matching historical outage is found, its proven resolution is injected into the GPT-4o LLM prompt for higher accuracy."
  },
  {
    category: "Performance & Impact",
    question: "What is the Mean Time to Repair (MTTR) improvement?",
    answer: "Traditional manual incident response takes an average of 25 to 45 minutes for SREs to receive alerts, search logs in Datadog/SigNoz, and execute fixes. Observability Copilot reduces MTTR to 45 seconds through automated detection, instant RCA, and 1-click remediation."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative mx-auto mt-32 max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <span className="rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400 border border-emerald-500/20 font-sans">
          Frequently Asked Questions
        </span>
        <h2 className="font-bebas-neue mt-4 text-4xl tracking-tight sm:text-5xl text-white">
          Everything You Need to Know
        </h2>
        <p className="mx-auto max-w-2xl text-zinc-400 font-sans mt-2 text-sm leading-relaxed">
          Comprehensive answers about Observability Copilot, SigNoz OpenTelemetry tracing, LLM root cause analysis, and human safety controls.
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-sm transition-all duration-200"
              style={styles.frame("rgba(24,24,27,0.4)", "rgba(10,10,10,0.7)")}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-6 text-left flex justify-between items-center gap-4 transition hover:bg-white/5"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">{item.category}</span>
                  <h3 className="text-base font-semibold text-white mt-1 tracking-tight font-sans">
                    {item.question}
                  </h3>
                </div>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/50 text-xs font-mono text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white border-emerald-500/40' : ''}`}>
                  ↓
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-white/5 text-sm text-zinc-300 leading-relaxed font-sans">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
