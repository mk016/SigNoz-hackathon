import * as styles from "@/lib/styles";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 pt-16">
      <div className="absolute inset-0 z-0 bg-neutral-950" style={styles.footerFrame}></div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-1">
            <a href="#" aria-label="Vectorline home" className="mb-6 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-xs font-medium text-white font-sans" style={styles.logoBox}>VL</span>
              <span className="text-sm font-medium tracking-tight text-white font-sans">Vectorline</span>
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-500 font-sans">
              Spec console for translating ambiguous ideas into functional structural patterns.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-300 font-sans">Platform</h3>
            <ul className="flex flex-col gap-3 text-sm text-zinc-500 font-sans">
              <li><a href="#" className="transition-colors hover:text-white">Topology</a></li>
              <li><a href="#" className="transition-colors hover:text-white">State memory</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Access control</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Edge sync</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-300 font-sans">Company</h3>
            <ul className="flex flex-col gap-3 text-sm text-zinc-500 font-sans">
              <li><a href="#" className="transition-colors hover:text-white">About us</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Changelog</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Careers</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-300 font-sans">Legal</h3>
            <ul className="flex flex-col gap-3 text-sm text-zinc-500 font-sans">
              <li><a href="#" className="transition-colors hover:text-white">Privacy policy</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Terms of service</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Cookie policy</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 border-t border-white/5 py-6" style={styles.footerBar}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-zinc-600 font-sans">© 2024 Vectorline Console. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-zinc-600 transition-colors hover:text-zinc-400" aria-label="Twitter">
              <iconify-icon icon="mdi:twitter" className="text-lg"></iconify-icon>
            </a>
            <a href="#" className="text-zinc-600 transition-colors hover:text-zinc-400" aria-label="GitHub">
              <iconify-icon icon="mdi:github" className="text-lg"></iconify-icon>
            </a>
            <a href="#" className="text-zinc-600 transition-colors hover:text-zinc-400" aria-label="Discord">
              <iconify-icon icon="ic:baseline-discord" className="text-lg"></iconify-icon>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
