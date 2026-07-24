# Canonical Analytics Contracts

## Purpose

These versioned contracts are the boundary between collection sources,
synthetic generation, CRM outcomes, warehouse transformations and
experimentation analysis.

Source-specific fields must be normalised through an adapter before they are
used by governed transformations. Dashboards and experiment reports must not
consume source-specific raw shapes directly.

## Contract version

The current contract version is `1.1.0`. It adds bounded journey fields needed
by the executable configurator, finance, dealer, form and downstream outcome
flows. Version `1.0.0` remains the initial baseline. A breaking field or
semantic change requires a new major version and a documented migration plan.

Reference registries have their own version lifecycle and remain at `1.0.0`;
their `schema_version` must not be inferred from the analytics-event version.

## Machine-readable schemas

| Schema | Grain | Purpose |
|---|---|---|
| `canonical_event.schema.json` | Event | Source-independent digital event |
| `web_submission.schema.json` | Accepted web submission | Form and lead identity bridge |
| `canonical_crm_lead.schema.json` | CRM lead | Downstream lead-quality outcome |
| `experiment_definition.schema.json` | Experiment | Statistical and operational plan |
| `experiment_assignment.schema.json` | User/browser × experiment | Stable assignment and exposure |
| `personalisation_assignment.schema.json` | Assignment key × audience | Holdout and outcome window |

Schemas use JSON Schema 2020-12 and reject undocumented properties.

## Identity separation

- `form_instance_id` identifies one rendered form attempt. It exists before a
  submit and links form starts and validation errors.
- `web_submission_id` identifies one accepted submission. It is created only
  after successful server-side acceptance.
- `lead_id_hash` is the privacy-safe CRM matching key. It is derived from a
  generated opaque submission reference, never from an email address, phone
  number, name or other raw PII.
- `user_pseudo_id` and `session_id` support anonymous web journey analysis.
  They do not replace the submission or CRM identifiers.
- An accepted submission may have a null analytics `session_id` when analytics
  consent is not granted; the server-side submission and lead identities
  remain valid and separate.
- Experiment and personalisation assignment IDs are separate so overlapping
  decision systems remain auditable.

All pseudonymous identifiers remain sensitive and must not appear in public
screenshots or unrestricted extracts.

## Source adapters

Two source shapes are supported:

1. Flat synthetic events used for deterministic local development.
2. Nested GA4 BigQuery export-style records containing repeated event
   parameters.

Both adapters must produce the exact canonical event columns and semantics.
Unknown source parameters are ignored until a contract change is approved.

See [source adapter contract](./source_adapter_contract.md) and
[identity and outcome contract](./identity_and_outcome_contract.md).

## Privacy invariants

- No raw names, email addresses, phone numbers, postal addresses, payment
  fields or free-text form values are permitted.
- Synthetic rows must set `data_origin` to `synthetic`.
- A hash of email or phone is still prohibited analytics data.
- CRM outcomes and experiment results must be joined through approved
  pseudonymous keys and bounded outcome windows.
