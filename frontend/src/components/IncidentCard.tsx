import * as styles from "@/lib/styles";

export default function IncidentCard({ incident }: { incident: any }) {
  if (!incident) return null;
  
  const isResolved = incident.status === "resolved";
  const badgeColor = isResolved ? "text-emerald-400" : "text-rose-500 bg-rose-500/10";
  const statusIcon = isResolved ? "solar:check-circle-bold" : "solar:danger-triangle-bold";
  
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#070707] p-5 shadow-lg transition-all hover:border-white/20">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <iconify-icon icon={statusIcon} className={`text-2xl ${isResolved ? "text-emerald-400" : "text-rose-500 animate-pulse"}`}></iconify-icon>
          <div>
            <h3 className="text-base font-semibold text-white font-sans tracking-tight">{incident.target}</h3>
            <p className="text-xs text-zinc-500 font-sans mt-0.5">ID: {incident.id.split('-')[0]}</p>
          </div>
        </div>
        <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${badgeColor} font-sans border border-white/5`}>
          {incident.status}
        </span>
      </div>
      
      <div className="mb-5 rounded-lg border border-white/5 bg-black/40 p-3">
        <p className="text-sm leading-relaxed text-zinc-300 font-sans">
          {incident.description}
        </p>
      </div>
      
      {incident.fix_applied && (
        <div className="mt-4 border-t border-white/5 pt-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500 font-sans flex items-center gap-2">
            <iconify-icon icon="solar:magic-stick-3-linear"></iconify-icon> AI Auto-Remediation
          </h4>
          <div className="flex items-center justify-between">
            <code className="rounded bg-indigo-500/10 px-2 py-1 text-xs text-indigo-300 font-mono">
              {incident.fix_applied}
            </code>
            <span className="text-xs font-semibold text-emerald-400 font-sans bg-emerald-400/10 px-2 py-0.5 rounded-full">
              {incident.confidence_score}% Confidence
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
