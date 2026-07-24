/**
 * Decorative corner brackets rendered on every .frame-section.
 * `indigo` is used only on the hero (larger, indigo-tinted brackets).
 */
export default function FrameCorners({ indigo = false }: { indigo?: boolean }) {
  const color = indigo ? "border-indigo-500/40" : "border-zinc-300/40";
  const size = indigo ? "h-10 w-10" : "h-8 w-8";
  return (
    <>
      <span className={`pointer-events-none absolute left-0 top-0 ${size} border-l border-t ${color}`}></span>
      <span className={`pointer-events-none absolute right-0 top-0 ${size} border-r border-t ${color}`}></span>
      <span className={`pointer-events-none absolute bottom-0 left-0 ${size} border-b border-l ${color}`}></span>
      <span className={`pointer-events-none absolute bottom-0 right-0 ${size} border-b border-r ${color}`}></span>
    </>
  );
}

/** Small indigo dots sitting just inside the hero's corner brackets */
export function CornerDots() {
  return (
    <>
      <div className="absolute left-4 top-4 h-2 w-2 bg-indigo-500/50"></div>
      <div className="absolute right-4 top-4 h-2 w-2 bg-indigo-500/50"></div>
      <div className="absolute bottom-4 left-4 h-2 w-2 bg-indigo-500/50"></div>
      <div className="absolute bottom-4 right-4 h-2 w-2 bg-indigo-500/50"></div>
    </>
  );
}
