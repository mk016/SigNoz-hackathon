import * as styles from "@/lib/styles";
import FrameCorners from "./FrameCorners";

export default function Signals() {
  return (
    <section id="signals" className="relative mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h2 className="font-bebas-neue mb-4 text-4xl tracking-tight sm:text-5xl">
            Signal Processing
          </h2>
          <p className="max-w-xl text-zinc-400 font-sans">
            Injest and filter raw structural data with deterministic accuracy.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/5 font-sans" style={styles.btnDarkAlt}>
            <iconify-icon icon="solar:settings-linear"></iconify-icon> Configure rules
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 p-6 sm:p-12" style={styles.frame("rgba(24,24,27,0.5)", "rgba(10,10,10,0.8)")}>
        <FrameCorners />
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="metric-card rounded-xl border border-white/5 bg-black/40 p-6">
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-widest text-zinc-500 font-sans">Event Volume</h3>
            <p className="font-bebas-neue mb-4 text-4xl text-white">14.2M/s</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[78%] bg-indigo-500"></div>
            </div>
          </div>
          
          <div className="metric-card rounded-xl border border-white/5 bg-black/40 p-6">
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-widest text-zinc-500 font-sans">Payload Size</h3>
            <p className="font-bebas-neue mb-4 text-4xl text-white">4.8 KB</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[42%] bg-emerald-400"></div>
            </div>
          </div>
          
          <div className="metric-card rounded-xl border border-white/5 bg-black/40 p-6">
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-widest text-zinc-500 font-sans">Drop Rate</h3>
            <p className="font-bebas-neue mb-4 text-4xl text-white">0.001%</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[2%] bg-rose-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
