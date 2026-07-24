export default function PrivacyPage() {
  return (
    <article className="shell max-w-3xl py-16">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
        Demo privacy
      </p>
      <h1 className="mt-3 text-4xl font-black">Consent and data behaviour</h1>
      <div className="card mt-8 space-y-5 p-7 leading-7 text-[var(--muted)]">
        <p>
          This fictional site does not ask for a name, email address, phone
          number, postal address or postcode. Do not enter personal information.
        </p>
        <p>
          Analytics identity, experiment assignment and personalisation
          assignment are created only after analytics consent is granted.
          Revocation clears those identifiers and blocks future business events.
        </p>
        <p>
          The local CRM emulator creates opaque server-side references from
          synthetic journey context. It is not Salesforce and does not contact
          any person or external system.
        </p>
      </div>
    </article>
  );
}
