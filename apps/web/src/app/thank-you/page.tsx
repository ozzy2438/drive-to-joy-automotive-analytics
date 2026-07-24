import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="shell py-20">
      <section className="card mx-auto max-w-2xl p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
          Synthetic CRM handoff complete
        </p>
        <h1 className="mt-3 text-4xl font-black">Thank you</h1>
        <p className="mt-5 leading-7 text-[var(--muted)]">
          A local-only fictional lead record was created. No person will be
          contacted and no personal data was collected.
        </p>
        <Link className="button mt-7" href="/vehicles">
          Return to vehicle research
        </Link>
      </section>
    </div>
  );
}
