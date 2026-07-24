"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as S from "@/lib/styles";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-neutral-900/60 p-8 text-center space-y-6" style={S.operatorsCard}>
        <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest text-rose-400 border border-rose-500/20 bg-rose-500/10">
          Application Exception
        </span>

        <h2 className="text-2xl font-semibold tracking-tight text-white">Something went wrong</h2>
        
        <p className="text-xs text-zinc-400 leading-relaxed font-mono bg-black/60 p-3 rounded-xl border border-white/5 break-words">
          {error.message || "An unexpected error occurred while rendering the page."}
        </p>

        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl border border-white/20 text-xs font-semibold text-zinc-300 hover:text-white transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
