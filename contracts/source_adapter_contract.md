# Source Adapter Contract

## Boundary

Raw source records are immutable inputs. Adapters convert source-specific
shapes into `canonical_event` without adding business outcomes or silently
repairing quality defects.

## Flat synthetic adapter

The flat adapter accepts one row per event with top-level event and context
columns. It:

- labels every row as synthetic;
- accepts `session_id` as the source session key;
- normalises dates and UTC timestamps;
- adds nullable canonical fields when the source does not provide them;
- preserves approved identifiers without reconstructing context.

## Nested GA4 BigQuery adapter

The nested adapter accepts GA4 export-style rows. It:

- reads `event_date` and microsecond `event_timestamp`;
- extracts approved repeated `event_params`;
- maps `ga_session_id` to canonical `session_id`;
- reads approved device and traffic-source context;
- does not export arbitrary source parameters;
- does not infer CRM qualification from GA4 events.

## Parity rule

Equivalent flat and nested source fixtures must yield the same business
context after normalisation. Source metadata may differ:

- `source_system`
- `data_origin`

## Failure behaviour

Adapters fail on missing required source fields, invalid timestamps, duplicate
event IDs or undocumented data origins. Missing conditional business context
is retained as null and assessed by data-quality checks.
