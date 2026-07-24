# ADR-010 — Demo CRM Emulator

## Context

The executable journey must prove the boundary between a successful web form
submission and a downstream CRM lifecycle without presenting the emulator as
Salesforce or storing real user information. The canonical identity contract
requires `form_instance_id`, `web_submission_id` and `lead_id_hash` to remain
separate.

## Decision

Implement the CRM emulator as server-only TypeScript modules called by a
Next.js Route Handler:

- the form collects only synthetic vehicle, dealer, form-type and explicit
  demo acknowledgement context; it has no PII input fields;
- Zod performs server-side request validation;
- successful acceptance creates a random opaque `web_submission_id`;
- the server creates a second random opaque internal lead reference;
- `lead_id_hash` is derived only from that opaque reference with a
  domain-separated SHA-256 operation;
- the internal lead reference is never returned to the browser or analytics;
- an append-only local NDJSON record stores the synthetic-safe CRM lifecycle;
- lifecycle transitions are validated in a server module for `New`,
  `Contacted`, `Qualified`, `Disqualified`, `Appointment Booked`, `Attended`
  and `Ordered`;
- no public admin or lifecycle-mutation route is created;
- a sanitised local export excludes the internal lead reference and is
  available only when the local export flag is enabled outside production.

The local event collector is a separate append-only NDJSON stream. It validates
the canonical event, applies the PII guard again at the server boundary, adds
`ingested_at_utc` and preserves in-process arrival order with a serial append
queue.

## Alternatives

- **Salesforce sandbox:** more realistic integration behaviour, but requires
  credentials, vendor configuration and data handling outside Sprint 3.
- **Browser-only CRM state:** easier, but exposes internal identity generation
  and cannot represent a server acceptance boundary.
- **SQLite or an external database:** supports concurrency and queries, but is
  unnecessary for the local single-process evidence surface.
- **Hashing contact details:** explicitly rejected; a hash of email or phone is
  still derived from PII and is not the approved join key.

## Consequences

- Accepted form submissions can be reconciled with browser events and
  sanitised CRM outcomes by `web_submission_id` and `lead_id_hash`.
- File append ordering is guaranteed only within one application process.
- The emulator supports lifecycle logic through tested server APIs, without an
  administration interface.
- Local files can be deleted to reset the demo and are never committed.
- Production durability, authentication, retries and vendor-specific mappings
  remain out of scope.

## Privacy implications

- The browser never sends name, email, phone, address, postcode or a
  person-linked raw financial value.
- Analytics receives only the accepted submission ID and the hash derived from
  an opaque server reference.
- Server logs must contain request status and opaque correlation IDs only; the
  implementation does not log request bodies.
- Local exports are sanitised and visibly labelled synthetic.

## Rollback

Disable the CRM submit and export Route Handlers and delete the ignored
`apps/web/.local-data` directory. Browser research, consent and tracking tests
can continue without CRM persistence. No external system requires cleanup.

## Status

Accepted for Sprint 3.
