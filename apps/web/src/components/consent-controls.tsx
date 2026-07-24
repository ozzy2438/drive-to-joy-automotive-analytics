"use client";

import { useState } from "react";
import { useTracking } from "@/lib/tracking/tracking-context";

export function ConsentControls() {
  const { consent, hydrated, updateConsent } = useTracking();
  const [busy, setBusy] = useState(false);

  async function apply(analytics: "granted" | "denied" | "revoked") {
    setBusy(true);
    try {
      await updateConsent(analytics, analytics === "granted" ? "denied" : analytics);
    } finally {
      setBusy(false);
    }
  }

  if (!hydrated) {
    return <p>Loading local consent state…</p>;
  }

  return (
    <section className="card mt-8 p-7">
      <h2 className="text-xl font-extrabold">Local consent controls</h2>
      <p className="mt-2 text-[var(--muted)]">
        Analytics: <strong>{consent.analytics}</strong>. Marketing:{" "}
        <strong>{consent.marketing}</strong>.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          className="button"
          type="button"
          disabled={busy}
          onClick={() => void apply("granted")}
        >
          Allow analytics
        </button>
        <button
          className="button button-secondary"
          type="button"
          disabled={busy}
          onClick={() => void apply("denied")}
        >
          Deny analytics
        </button>
        <button
          className="button button-secondary"
          type="button"
          disabled={busy}
          onClick={() => void apply("revoked")}
        >
          Revoke and clear analytics state
        </button>
      </div>
    </section>
  );
}
