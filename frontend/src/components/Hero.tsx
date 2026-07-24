import * as styles from "@/lib/styles";
import WireframeCanvas from "./three/WireframeCanvas";
import FrameCorners from "./FrameCorners";

export default function Hero() {
  return (
    <section id="model" className="relative mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-white/10" style={styles.heroFrame}>
        <FrameCorners indigo={true} />
        
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="relative z-10 flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest text-zinc-300" style={styles.pillBadge}>
                <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400"></span>
                Diagnostic layer active
              </span>
            </div>
            
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500 font-sans">Build node</p>
            
            <h1 className="font-bebas-neue mb-6 text-5xl font-normal leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Map ideas as a <br />
              <span style={styles.gradientText}>measured</span> <br />
              system.
            </h1>
            
            <p className="mb-8 max-w-md text-lg leading-relaxed text-zinc-400 font-sans">
              Vectorline is a spec console that translates ambiguous ideas into functional prototypes and architectural patterns.
            </p>
            
            <div className="mb-8 grid grid-cols-2 gap-6">
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-zinc-300 font-sans">Topology</h3>
                <p className="text-xs text-zinc-500 font-sans">Real-time edge rendering</p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-zinc-300 font-sans">State</h3>
                <p className="text-xs text-zinc-500 font-sans">Synced memory allocation</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <a href="#architecture" className="rounded-xl px-6 py-3 text-sm font-semibold text-zinc-900 transition-all hover:opacity-90 font-sans" style={styles.btnLightHero}>
                Start mapping
              </a>
              <button className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/5 font-sans" style={styles.btnDarkAlt}>
                Inspect assets <iconify-icon icon="solar:magnifer-linear"></iconify-icon>
              </button>
            </div>
          </aside>
          
          <div className="relative min-h-[400px] border-l border-white/5 lg:min-h-full">
            <div className="absolute inset-0 opacity-40" style={styles.gridOverlay4rem}></div>
            <WireframeCanvas />
            
            <div className="absolute right-6 top-6 flex items-center gap-2 rounded-lg bg-black/40 px-3 py-1.5 backdrop-blur-md border border-white/10 text-xs font-medium text-zinc-300">
              <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
              Active Simulation
            </div>
            
            <div className="absolute bottom-16 right-12 z-20 hidden lg:block">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 rounded-xl px-4 py-2 border border-white/10" style={styles.labelCard}>
                  <iconify-icon icon="solar:server-square-linear" className="text-zinc-400"></iconify-icon>
                  <span className="text-xs font-medium text-zinc-300 font-sans">Sync mesh</span>
                </div>
                <div className="flex items-center gap-3 rounded-xl px-4 py-2 border border-white/10 ml-8" style={styles.labelCard}>
                  <iconify-icon icon="solar:cpu-bold-duotone" className="text-indigo-400"></iconify-icon>
                  <span className="text-xs font-medium text-zinc-300 font-sans">Route memory</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 bg-black/20 p-4 sm:px-12 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-6 text-xs text-zinc-500 font-sans">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-400">Latency:</span>
              <span>12ms (EU-WEST)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-400">Throughput:</span>
              <span>9.4 TB/s</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-400">Integrity:</span>
              <span>Verified SHA-256</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
