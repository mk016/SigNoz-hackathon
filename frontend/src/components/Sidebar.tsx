"use client";

import Link from "next/link";
import * as S from "@/lib/styles";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  incidentCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, incidentCount }: SidebarProps) {
  const navItems = [
    { id: "overview", label: "System Overview", icon: "solar:widget-3-linear" },
    { id: "incidents", label: "Active Incidents", icon: "solar:danger-triangle-linear", badge: incidentCount },
    { id: "chaos", label: "Chaos Control Room", icon: "solar:flame-linear", highlight: true },
    { id: "traces", label: "SigNoz Traces", icon: "solar:history-linear" },
    { id: "memory", label: "RAG Incident Memory", icon: "solar:database-linear" },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-neutral-950/90 backdrop-blur-xl flex flex-col justify-between min-h-[calc(100vh-65px)] font-sans">
      <div className="p-4 space-y-6">
        {/* Workspace Switcher */}
        <div className="rounded-xl border border-white/10 p-3 bg-black/40 flex items-center justify-between" style={S.operatorsCard}>
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-white font-sans" style={S.logoBox}>
              VL
            </span>
            <div>
              <div className="text-xs font-semibold text-white">Prod Cluster A</div>
              <div className="text-[10px] text-zinc-500 font-mono">eu-west-1 • 99.99%</div>
            </div>
          </div>
          <iconify-icon icon="solar:alt-arrow-down-linear" className="text-zinc-500 text-xs"></iconify-icon>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white/10 text-white border border-white/15 shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <iconify-icon
                    icon={item.icon}
                    className={`text-base ${
                      isActive ? "text-indigo-400" : item.highlight ? "text-rose-400" : "text-zinc-500"
                    }`}
                  ></iconify-icon>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* System Diagnostics Links */}
        <div className="space-y-1 pt-4 border-t border-white/5">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            Engine Specs
          </div>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition"
          >
            <iconify-icon icon="solar:code-square-linear" className="text-base text-zinc-500"></iconify-icon>
            <span>FastAPI OpenAPI Docs</span>
          </a>
          <a
            href="#signoz"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition"
          >
            <iconify-icon icon="solar:server-minimalistic-linear" className="text-base text-zinc-500"></iconify-icon>
            <span>SigNoz OTLP Collector</span>
          </a>
        </div>
      </div>

      {/* Footer Profile Node */}
      <div className="p-4 border-t border-white/10 bg-black/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300">
              SR
            </div>
            <div>
              <div className="text-xs font-semibold text-white">SRE Engineer</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Node Active
              </div>
            </div>
          </div>
          <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm">
            <iconify-icon icon="solar:logout-2-linear"></iconify-icon>
          </Link>
        </div>
      </div>
    </aside>
  );
}
