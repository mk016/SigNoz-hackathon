"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-[#070707] text-white font-sans">
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
          <h2 className="text-2xl font-semibold">Critical Application Error</h2>
          <p className="text-xs text-zinc-400 max-w-md font-mono bg-black/80 p-4 rounded-xl border border-white/10">
            {error.message || "Root layout error."}
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
