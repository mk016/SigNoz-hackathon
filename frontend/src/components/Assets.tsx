import * as styles from "@/lib/styles";
import FrameCorners from "./FrameCorners";

export default function Assets() {
  return (
    <section id="assets" className="relative mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h2 className="font-bebas-neue mb-4 text-4xl tracking-tight sm:text-5xl">
          Asset Registry
        </h2>
        <p className="max-w-xl text-zinc-400 font-sans">
          Centralized management for 3D primitives and texture materials.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 p-6 sm:p-12" style={styles.frame("rgba(24,24,27,0.3)", "rgba(10,10,10,0.6)")}>
        <FrameCorners />

        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <label htmlFor="asset-search" className="sr-only font-sans">Search assets</label>
            <input 
              id="asset-search" 
              type="search" 
              defaultValue="abstract architecture headshot"
              className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
              style={styles.searchInput}
            />
            <iconify-icon icon="solar:magnifer-linear" className="absolute left-3.5 top-3 text-zinc-500"></iconify-icon>
          </div>
          
          <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-hover hover:bg-white/10 font-sans">
            <iconify-icon icon="solar:filter-linear"></iconify-icon>
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="asset-card group relative overflow-hidden rounded-xl border border-white/10 bg-[#070707]">
              <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                <img 
                  src={`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`} 
                  alt="Asset placeholder" 
                  className="h-full w-full object-cover opacity-60 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                />
              </div>
              <div className="p-4" style={styles.operatorsCard}>
                <h3 className="mb-1 text-sm font-semibold text-white font-sans">Material_{i.toString().padStart(2, '0')}</h3>
                <p className="text-xs text-zinc-500 font-sans">4096 x 4096 PBR</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
