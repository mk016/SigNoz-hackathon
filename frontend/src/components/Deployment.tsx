import * as styles from "@/lib/styles";
import FrameCorners from "./FrameCorners";

export default function Deployment() {
  return (
    <section id="deployment" className="relative mx-auto mb-32 mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 p-8 text-center sm:p-16 lg:p-24" style={styles.frame("rgba(24,24,27,0.3)", "rgba(10,10,10,0.6)")}>
        <FrameCorners />

        <div className="mx-auto flex max-w-2xl flex-col items-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/40 border border-white/10 text-xl text-zinc-300" style={styles.iconTile}>
              <iconify-icon icon="solar:server-minimalistic-linear"></iconify-icon>
            </div>
            <div className="h-px w-8 bg-zinc-700"></div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/40 border border-white/10 text-xl text-indigo-400" style={styles.iconTile}>
              <iconify-icon icon="solar:global-linear"></iconify-icon>
            </div>
            <div className="h-px w-8 bg-zinc-700"></div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/40 border border-white/10 text-xl text-zinc-300" style={styles.iconTile}>
              <iconify-icon icon="solar:shield-check-linear"></iconify-icon>
            </div>
          </div>
          
          <h2 className="font-bebas-neue mb-6 text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            Deploy your <span style={styles.gradientText}>environment</span>
          </h2>
          
          <p className="mb-10 text-base text-zinc-400 sm:text-lg font-sans">
            Push structural changes to edge nodes instantly. Zero downtime mapping.
          </p>
          
          <button className="rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/5 font-sans" style={styles.btnDark}>
            Initialize sync
          </button>
        </div>
      </div>
    </section>
  );
}
