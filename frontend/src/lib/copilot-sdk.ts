/**
 * Observability Copilot - 1-Line Next.js Integration SDK
 * 
 * Drop this helper into any Next.js application to connect live error reporting
 * and automatic AI incident remediation.
 */

const COPILOT_BACKEND_URL = process.env.NEXT_PUBLIC_COPILOT_BACKEND || "https://observability-copilot-backend.onrender.com";

export interface CopilotErrorOptions {
  serviceName?: string;
  fixProposed?: string;
}

/**
 * Report an error/exception from any Next.js App Route or Component directly to Observability Copilot.
 */
export async function trackError(error: Error | string, options: CopilotErrorOptions = {}) {
  const serviceName = options.serviceName || "nextjs-website";
  const errorMessage = typeof error === "string" ? error : error.message || "Unhandled Next.js Application Error";

  try {
    const payload = {
      id: `inc_nextjs_${Date.now()}`,
      target: serviceName,
      status: "detected",
      description: errorMessage,
      detected_at: new Date().toISOString(),
      approval_mode: "manual"
    };

    const res = await fetch(`${COPILOT_BACKEND_URL}/api/incidents/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log(`[Observability Copilot] Alert sent to Live Dashboard for ${serviceName}`);
      return await res.json();
    }
  } catch (err) {
    console.error("[Observability Copilot] Alert delivery failed:", err);
  }
}
