# CRM Emulator

## Purpose

The emulator proves an accepted web submission and downstream CRM identity
boundary. It is not Salesforce and has no external connection.

## Acceptance flow

1. The browser creates `form_instance_id` after the form renders.
2. The form sends synthetic vehicle, dealer, consent-safe identity and
   assignment context to `POST /api/crm/submit`.
3. Zod and the PII guard validate the request on the server.
4. The server creates an opaque `web_submission_id`.
5. The server creates a different opaque internal lead reference.
6. `lead_id_hash` is derived from only that opaque reference with
   domain-separated SHA-256.
7. A canonical synthetic CRM lead starts in `new`.
8. The accepted IDs return to the browser.
9. Only then does the browser emit `test_drive_submit` or `quote_submit`.

The internal lead reference is never returned to the browser, data layer or
sanitised export.

## Lifecycle

The tested server module supports:

```text
new
→ contacted
→ qualified
→ appointment_booked
→ attended
→ ordered
```

Valid states may also transition to `disqualified` where defined. Terminal
states reject further transitions. There is no public lifecycle-mutation or
admin route in Sprint 3.

## Persistence and export

Records append to ignored `crm-records.ndjson`. Local export returns the
canonical submission and lead records but omits the internal reference.
Production mode returns `404` for the export route.

## Reconciliation

Browser conversion events and CRM records join on both:

- `web_submission_id`
- `lead_id_hash`

The local quality script requires matching values and unique conversion IDs.
