"use client";

import { useState } from "react";
import { useTracking } from "@/lib/tracking/tracking-context";

export function ConsentBanner() {
  const { consent, hydrated, updateConsent } = useTracking();
  const [busy, setBusy] = useState(false);

  if (!hydrated || consent.analytics !== "unknown") {
    return null;
  }

  async function choose(analytics: "granted" | "denied") {
    setBusy(true);
    try {
      await updateConsent(analytics, "denied");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-2xl"
      aria-label="Analytics consent"
    >
      <h2 className="font-extrabold">Choose demo analytics behaviour</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        Allow creates opaque anonymous IDs for local event, experiment and
        personalisation tests. Deny keeps those systems off. No personal
        details are collected.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          className="button"
          type="button"
          disabled={busy}
          onClick={() => void choose("granted")}
        >
          Allow analytics
        </button>
        <button
          className="button button-secondary"
          type="button"
          disabled={busy}
          onClick={() => void choose("denied")}
        >
          Deny analytics
        </button>
      </div>
    </section>
  );
}
