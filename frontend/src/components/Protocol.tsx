import * as styles from "@/lib/styles";
import FrameCorners from "./FrameCorners";

export default function Protocol() {
  return (
    <section id="protocol" className="relative mx-auto mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h2 className="font-bebas-neue mb-4 text-4xl tracking-tight sm:text-5xl">
          Protocol Standards
        </h2>
        <p className="max-w-xl text-zinc-400 font-sans">
          Strict encoding guidelines for data transmission and storage.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 p-6 sm:p-12" style={styles.frame("rgba(24,24,27,0.3)", "rgba(10,10,10,0.6)")}>
        <FrameCorners />

        <div className="flex flex-col gap-4">
          <div className="protocol-row group relative flex items-center justify-between rounded-xl border border-white/5 bg-black/40 p-4 hover:border-white/20 transition-all">
            <div className="flex items-center gap-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-indigo-400 font-sans" style={styles.stepBadge}>
                01
              </span>
              <div>
                <h3 className="text-sm font-semibold text-zinc-200 font-sans">Vector Encoding</h3>
                <p className="text-xs text-zinc-500 font-sans">Convert geometric data to Base64 binaries</p>
              </div>
            </div>
            <iconify-icon icon="solar:arrow-right-linear" className="text-zinc-500 transition-colors group-hover:text-indigo-400"></iconify-icon>
          </div>

          <div className="protocol-row group relative flex items-center justify-between rounded-xl border border-white/5 bg-black/40 p-4 hover:border-white/20 transition-all">
            <div className="flex items-center gap-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-indigo-400 font-sans" style={styles.stepBadge}>
                02
              </span>
              <div>
                <h3 className="text-sm font-semibold text-zinc-200 font-sans">State Hydration</h3>
                <p className="text-xs text-zinc-500 font-sans">Map incoming payloads to scene graph nodes</p>
              </div>
            </div>
            <iconify-icon icon="solar:arrow-right-linear" className="text-zinc-500 transition-colors group-hover:text-indigo-400"></iconify-icon>
          </div>

          <div className="protocol-row group relative flex items-center justify-between rounded-xl border border-white/5 bg-black/40 p-4 hover:border-white/20 transition-all">
            <div className="flex items-center gap-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-indigo-400 font-sans" style={styles.stepBadge}>
                03
              </span>
              <div>
                <h3 className="text-sm font-semibold text-zinc-200 font-sans">Hash Validation</h3>
                <p className="text-xs text-zinc-500 font-sans">Confirm data integrity against Merkle root</p>
              </div>
            </div>
            <iconify-icon icon="solar:arrow-right-linear" className="text-zinc-500 transition-colors group-hover:text-indigo-400"></iconify-icon>
          </div>
        </div>
      </div>
    </section>
  );
}
