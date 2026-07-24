import * as styles from "@/lib/styles";

export default function CostImpact({ incidents }: { incidents: any[] }) {
  if (!incidents || incidents.length === 0) return null;
  
  const totalCost = incidents.reduce((sum, inc) => {
    // Mock downtime cost
    const downtimeCost = 0.15; 
    const fixCost = inc.cost_impact || 0;
    return sum + downtimeCost + fixCost;
  }, 0);

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#070707] p-5 shadow-lg">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-500 font-sans">
        <iconify-icon icon="solar:wallet-money-linear"></iconify-icon> Cumulative Cost Impact
      </h3>
      
      <div className="flex items-end gap-2">
        <span className="font-bebas-neue text-5xl text-white">${totalCost.toFixed(2)}</span>
        <span className="mb-1 text-sm text-zinc-500 font-sans">/ hr</span>
      </div>
      
      <div className="mt-6 flex h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div className="h-full bg-rose-500" style={{ width: '40%' }}></div>
        <div className="h-full bg-amber-500" style={{ width: '10%' }}></div>
        <div className="h-full bg-indigo-500" style={{ width: '50%' }}></div>
      </div>
      
      <div className="mt-3 flex justify-between text-[10px] font-semibold uppercase tracking-widest text-zinc-500 font-sans">
        <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-rose-500"></div> Downtime</span>
        <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-amber-500"></div> Scaling</span>
        <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-indigo-500"></div> API Inference</span>
      </div>
    </div>
  );
}
