"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as S from "@/lib/styles";

export default function SignupPage() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-[#070707] text-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] mix-blend-screen noise-bg"></div>
      <div className="pointer-events-none fixed inset-0 opacity-30 grid-lines"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 text-lg font-medium text-white font-sans"
              style={S.logoBox}
            >
              VL
            </span>
          </Link>
          <h1 className="font-bebas-neue text-4xl tracking-tight">Provision Workspace</h1>
          <p className="text-sm text-zinc-400 font-sans mt-1">
            Deploy your Observability Copilot node
          </p>
        </div>

        {/* Form Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 p-8" style={S.frame("rgba(24,24,27,0.5)", "rgba(10,10,10,0.8)")}>
          <form onSubmit={handleSubmit} className="space-y-5 font-sans">
            <div>
              <label htmlFor="orgName" className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
                Organization / Team Name
              </label>
              <input
                id="orgName"
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Acme Infrastructure"
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                style={S.searchInput}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
                Admin Work Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lead-sre@company.com"
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                style={S.searchInput}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
                Create Master Token
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                style={S.searchInput}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3.5 text-sm font-semibold text-zinc-900 transition-all hover:opacity-90 mt-2 flex items-center justify-center gap-2"
              style={S.btnLightHero}
            >
              {loading ? (
                <span>Provisioning Node...</span>
              ) : (
                <>
                  <span>Create SRE Workspace</span>
                  <iconify-icon icon="solar:rocket-2-linear" className="text-lg"></iconify-icon>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-white/5 pt-6">
            <p className="text-xs text-zinc-500 font-sans">
              Already have an active node?{" "}
              <Link href="/login" className="text-indigo-400 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 font-sans transition">
            ← Return to main portal
          </Link>
        </div>
      </div>
    </div>
  );
}
