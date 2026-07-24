# Event Runtime

## Contract boundary

The runtime uses `contracts/schemas/canonical_event.schema.json` version
`1.1.0` as the machine-readable source of truth. Event-specific required fields
and the approved event-name allowlist are applied in addition to JSON Schema.

The web runtime labels events as:

- `source_system=synthetic_flat`
- `data_origin=synthetic`
- `schema_version=1.1.0`

The local site is a flat synthetic source. It does not pretend to be a GA4
BigQuery export; the nested GA4 adapter remains a separate warehouse boundary.

## Runtime sequence

1. Build the complete canonical event with IDs, UTC time, page and consent.
2. Reject forbidden fields or PII-shaped values.
3. Validate JSON Schema and event-specific requirements.
4. Apply consent and semantic de-duplication.
5. Push a wrapper to `window.dataLayer`.
6. Copy the canonical event to `POST /api/events`.
7. Revalidate and append `ingested_at_utc` at the server boundary.

The data layer wrapper is:

```json
{
  "event": "view_vehicle_model",
  "canonical_event": {
    "schema_version": "1.1.0",
    "event_name": "view_vehicle_model"
  }
}
```

The nested `canonical_event` remains schema-valid; the outer `event` key is
only a data-layer dispatch label.

## De-duplication

- Page events use a route-semantic key.
- Experiment exposure uses the experiment assignment ID.
- Personalisation exposure uses assignment and placement plus audience
  cooldown.
- Conversion events rely on server-created unique submission IDs and are
  checked again by local quality validation.

## Failure behaviour

Invalid events are rejected before data-layer or collector dispatch. The
collector returns a generic error without echoing the request body. A collector
failure rejects the dispatch promise so tests and callers can observe it.
