# GA4 Events Schema

| Field | Type | Required | Description |
|---|---|---|---|
| event_date | DATE/STRING | Yes | Event date |
| event_timestamp | INTEGER/TIMESTAMP | Yes | UTC event time |
| event_name | STRING | Yes | Approved event name |
| user_pseudo_id | STRING | Conditional | Anonymous analytics identifier |
| session_id | STRING | Conditional | Session key |
| page_type | STRING | Yes for page/journey events | Approved page type |
| journey_stage | STRING | Yes for journey events | Discover/research/configure/evaluate/convert |
| vehicle_model | STRING | Required where applicable | Model context |
| vehicle_variant | STRING | Conditional | Variant context |
| dealer_id | STRING | Conditional | Dealer context |
| form_type | STRING | Conditional | Form context |
| experiment_id | STRING | Conditional | Active experiment |
| variant_id | STRING | Conditional | Experiment variant |
| experiment_assignment_id | STRING | Conditional | Stable experiment assignment |
| form_instance_id | STRING | Conditional | One rendered form attempt |
| web_submission_id | STRING | Conditional | One accepted web submission |
| lead_id_hash | STRING | Conditional | Privacy-safe join key |
| personalisation_assignment_id | STRING | Conditional | Audience and holdout assignment |
| consent_analytics | STRING | Yes | Consent state |

Nested GA4-style parameters may be represented in raw source and flattened in staging.

Flat synthetic and nested GA4-style inputs are separate raw shapes. Both must
be normalised to `contracts/schemas/canonical_event.schema.json` before
governed transformations.
