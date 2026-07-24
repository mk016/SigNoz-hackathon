import * as S from "@/lib/styles";

export default function Header() {
  return (
    <header className="relative z-20 border-b border-white/10 bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-stretch justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#"
          aria-label="Vectorline home"
          className="group relative flex min-h-20 items-center gap-3 border-x border-white/10 px-4 sm:px-6"
        >
          <span className="absolute -left-1 top-4 h-2 w-2 bg-zinc-500"></span>
          <span className="absolute -right-1 bottom-4 h-2 w-2 bg-zinc-500"></span>
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-sm font-medium text-white font-sans"
            style={S.logoBox}
          >
            VL
          </span>
          <span className="hidden leading-none sm:block">
            <span className="block text-sm font-medium tracking-tight text-white font-sans">
              Vectorline
            </span>
            <span className="mt-1 block text-xs font-normal uppercase tracking-widest text-zinc-500 font-sans">
              Spec console
            </span>
          </span>
        </a>

        <nav aria-label="Primary navigation" className="hidden items-stretch lg:flex">
          <a
            href="#model"
            className="flex items-center gap-2 border-r border-white/10 px-5 text-xs font-medium uppercase tracking-widest text-zinc-400 transition hover:text-white font-sans"
          >
            <iconify-icon icon="solar:box-minimalistic-linear" className="text-lg"></iconify-icon>
            Model
          </a>
          <a
            href="#signals"
            className="flex items-center gap-2 border-r border-white/10 px-5 text-xs font-medium uppercase tracking-widest text-zinc-400 transition hover:text-white font-sans"
          >
            <iconify-icon icon="solar:chart-square-linear" className="text-lg"></iconify-icon>
            Signals
          </a>
          <a
            href="#assets"
            className="flex items-center gap-2 border-r border-white/10 px-5 text-xs font-medium uppercase tracking-widest text-zinc-400 transition hover:text-white font-sans"
          >
            <iconify-icon icon="solar:gallery-wide-linear" className="text-lg"></iconify-icon>
            Assets
          </a>
          <a
            href="#protocol"
            className="flex items-center gap-2 border-r border-white/10 px-5 text-xs font-medium uppercase tracking-widest text-zinc-400 transition hover:text-white font-sans"
          >
            <iconify-icon icon="solar:code-square-linear" className="text-lg"></iconify-icon>
            Protocol
          </a>
        </nav>

        <div className="hidden items-center gap-3 py-4 lg:flex">
          <a
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 px-4 text-xs font-medium uppercase tracking-widest text-zinc-300 transition hover:border-white/25 hover:text-white font-sans"
            style={S.btnDark}
          >
            Log in
          </a>
          <a
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/20 px-4 text-xs font-medium uppercase tracking-widest text-black font-sans"
            style={S.btnLightHeader}
          >
            Open console
            <iconify-icon icon="solar:arrow-right-linear" className="text-base"></iconify-icon>
          </a>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          className="my-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-zinc-300 lg:hidden"
          style={S.mobileMenuBtn}
        >
          <iconify-icon icon="solar:hamburger-menu-linear" className="text-xl"></iconify-icon>
        </button>
      </div>
    </header>
  );
}
