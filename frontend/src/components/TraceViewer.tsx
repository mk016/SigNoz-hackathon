import * as styles from "@/lib/styles";

export default function TraceViewer() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#070707] shadow-lg">
      <div className="border-b border-white/5 bg-black/40 px-5 py-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-300 font-sans">
          <iconify-icon icon="solar:history-linear"></iconify-icon> Live Traces
        </h3>
      </div>
      
      <div className="flex flex-col p-5 space-y-4">
        <div className="group flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white font-sans">POST /checkout</span>
            <span className="text-xs text-zinc-500 font-mono mt-1">trace_id: 8a4f...3c92</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-1.5 rounded-full bg-white/5">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: '90%' }}></div>
            </div>
            <span className="text-xs font-semibold text-rose-500 font-mono">5.2s</span>
          </div>
        </div>
        
        <div className="group flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white font-sans">GET /api/chaos/service/payment</span>
            <span className="text-xs text-zinc-500 font-mono mt-1">trace_id: 1b2e...9f41</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-1.5 rounded-full bg-white/5">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '40%' }}></div>
            </div>
            <span className="text-xs font-semibold text-indigo-400 font-mono">2.1s</span>
          </div>
        </div>

        <div className="group flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white font-sans">GET /health</span>
            <span className="text-xs text-zinc-500 font-mono mt-1">trace_id: 5d7a...1e88</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-1.5 rounded-full bg-white/5">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '5%' }}></div>
            </div>
            <span className="text-xs font-semibold text-emerald-400 font-mono">12ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
