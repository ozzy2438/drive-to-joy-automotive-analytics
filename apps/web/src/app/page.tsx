import Link from "next/link";

export default function HomePage() {
  return (
    <div className="shell py-16 sm:py-24">
      <section className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
            Executable analytics test surface
          </p>
          <h1 className="max-w-3xl text-5xl font-black tracking-[-0.04em] sm:text-7xl">
            Research a fictional vehicle. Inspect a real event contract.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            AstraDrive Lab exercises consent-aware journeys, stable identities,
            experiment exposure and synthetic CRM handoff without real customer
            data or external credentials.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="button" href="/vehicles">
              Explore vehicle range
            </Link>
            <Link className="button button-secondary" href="/privacy">
              Review data behaviour
            </Link>
          </div>
        </div>
        <aside className="card p-7" aria-label="Demonstration guardrails">
          <h2 className="text-xl font-extrabold">What this demo proves</h2>
          <ul className="mt-5 space-y-4 text-[var(--muted)]">
            <li>Canonical event validation before collection</li>
            <li>Consent-gated anonymous identity and assignment</li>
            <li>Separate form, submission and CRM lead identifiers</li>
            <li>Deterministic experiment and holdout behaviour</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
