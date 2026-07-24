import type { CSSProperties } from "react";

/* ------------------------------------------------------------------ */
/*  Reusable inline-style recipes — 1:1 with the original design      */
/* ------------------------------------------------------------------ */

/** Logo / monogram box ("VL") with deep inset glass shading */
export const logoBox: CSSProperties = {
  background: "linear-gradient(to bottom, rgba(255,255,255,0.16), rgba(255,255,255,0.045))",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.9), 0 1rem 2rem rgba(0,0,0,0.35)",
  textShadow: "0 1px 0 rgba(0,0,0,0.8)",
};

/** Dark glass button (header "Log in", deployment "Initialize sync") */
export const btnDark: CSSProperties = {
  background: "linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.025))",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.85)",
};

/** Dark glass button — hero variant ("Inspect assets") */
export const btnDarkAlt: CSSProperties = {
  background: "linear-gradient(to bottom, rgba(255,255,255,0.09), rgba(255,255,255,0.02))",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.13), inset 0 -1px 0 rgba(0,0,0,0.85)",
};

/** Light metallic button — header ("Open console") */
export const btnLightHeader: CSSProperties = {
  background: "linear-gradient(to bottom, #f8fafc, #a1a1aa)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.35), 0 1rem 2.5rem rgba(255,255,255,0.08)",
};

/** Light metallic button — hero ("Start mapping") */
export const btnLightHero: CSSProperties = {
  background: "linear-gradient(to bottom, #fafafa, #a3a3a3)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(0,0,0,0.35), 0 1rem 2rem rgba(255,255,255,0.08)",
};

/** Mobile hamburger button */
export const mobileMenuBtn: CSSProperties = {
  background: "linear-gradient(to bottom, rgba(255,255,255,0.11), rgba(255,255,255,0.035))",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.8)",
};

/** Rounded status pill ("Diagnostic layer active", "System Active") */
export const pillBadge: CSSProperties = {
  background: "linear-gradient(to bottom, rgba(255,255,255,0.09), rgba(255,255,255,0.025))",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.7)",
};

/** Floating label cards over the hero canvas ("Sync mesh", "Route memory", ...) */
export const labelCard: CSSProperties = {
  background: "linear-gradient(to bottom, rgba(24,24,27,0.92), rgba(0,0,0,0.68))",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.9), 0 1.5rem 3rem rgba(0,0,0,0.35)",
};

/** Numbered step badge (protocol 01 / 02 / 03) */
export const stepBadge: CSSProperties = {
  background: "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.035))",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.88)",
};

/** Small inset tile for deployment icons */
export const iconTile: CSSProperties = {
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
};

/** Hero frame — the only section with the large outer drop shadow */
export const heroFrame: CSSProperties = {
  background: "linear-gradient(180deg, rgba(39,39,42,0.72), rgba(10,10,10,0.88))",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.95), 0 2rem 5rem rgba(0,0,0,0.45)",
};

/** Standard frame-section background (vertical zinc→black gradient + inset edges) */
export const frame = (top: string, bottom: string): CSSProperties => ({
  background: `linear-gradient(180deg, ${top}, ${bottom})`,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.95)",
});

/** "Session operators" card */
export const operatorsCard: CSSProperties = {
  background: "linear-gradient(to bottom, rgba(255,255,255,0.075), rgba(0,0,0,0.2))",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.9)",
};

/** Large blueprint grid overlay inside the hero canvas area */
export const gridOverlay4rem: CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)",
  backgroundSize: "4rem 4rem",
};

/** Dense grid overlay behind the architecture 3D canvases */
export const gridOverlay2rem: CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
  backgroundSize: "2rem 2rem",
};

/** Footer wide panel */
export const footerFrame: CSSProperties = {
  background: "linear-gradient(180deg, rgba(24,24,27,0.4), rgba(10,10,10,0.6))",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.8)",
};

/** Footer bottom legal bar */
export const footerBar: CSSProperties = {
  background: "linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(0,0,0,0.18))",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.85)",
};

/** Asset search input inset */
export const searchInput: CSSProperties = {
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.9)",
};

/** Indigo gradient text ("measured") */
export const gradientText: CSSProperties = {
  background: "linear-gradient(to right, #818cf8, #c7d2fe)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};
