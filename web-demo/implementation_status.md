# Web Demo Implementation Status

## Sprint 2–3 status

The AstraDrive demo is an executable analytics test surface in `apps/web`.
It is not a production vehicle-sales site and has no external analytics or CRM
dependency.

## Implemented routes

- `/`
- `/vehicles`
- `/vehicles/[model]`
- `/compare`
- `/build/[model]`
- `/finance/[model]`
- `/dealers`
- `/test-drive`
- `/quote`
- `/thank-you`
- `/privacy`

## Implemented capabilities

- Canonical event contract `1.1.0` validation in browser and collector.
- Consent-gated browser/session identity and event collection.
- Separate form instance, accepted submission and opaque CRM lead identities.
- Local ordered NDJSON event collection.
- Local CRM acceptance, lifecycle module and sanitised export.
- Three-arm `EXP-CTA-001` deterministic assignment and post-render exposure.
- Five implemented personalisation audiences with stable generic holdouts,
  cooldowns, priority and collision handling.
- Versioned synthetic vehicle, dealer, campaign, experiment and audience
  registries shared by generators, dbt and the site.

## Validation evidence

- Vitest covers event building, PII controls, identity, consent, experiment,
  personalisation, CRM lifecycle, reference data and server reconciliation.
- Playwright covers research, configurator, finance, test-drive, quote,
  consent-denied, experiment persistence and holdout journeys.
- The local quality script validates schema conformance, CRM reconciliation,
  forbidden PII and duplicate conversion/exposure rules.

## Not implemented

- Production hosting, GCP, BigQuery deployment or credentials.
- GTM/GA4 container publication.
- Salesforce or another external CRM.
- Authentication or an admin interface.
- Live experiment analysis, winner declaration or commercial performance claim.
