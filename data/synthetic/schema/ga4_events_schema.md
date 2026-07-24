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
| entry_point | STRING | Conditional | Governed journey entry point |
| comparison_model | STRING | Conditional | Compared model context |
| specification_section | STRING | Conditional | Viewed specification section |
| offer_id | STRING | Conditional | Synthetic offer reference |
| cta_id | STRING | Conditional | Rendered or selected CTA |
| vehicle_model | STRING | Required where applicable | Model context |
| vehicle_variant | STRING | Conditional | Variant context |
| powertrain | STRING | Conditional | Vehicle powertrain context |
| configurator_id | STRING | Conditional | Stable configuration journey |
| configurator_step | STRING | Conditional | Completed configuration step |
| configurator_value_band | STRING | Conditional | Bounded non-personal vehicle value band |
| colour_id | STRING | Conditional | Synthetic colour selection |
| option_ids | STRING | Conditional | Semicolon-delimited synthetic option IDs |
| loan_term_months | INTEGER | Conditional | Illustrative calculator term |
| repayment_band | STRING | Conditional | Bounded illustrative repayment result |
| dealer_id | STRING | Conditional | Dealer context |
| dealer_state | STRING | Conditional | Dealer state |
| search_method | STRING | Conditional | Governed dealer search method |
| form_type | STRING | Conditional | Form context |
| experiment_id | STRING | Conditional | Active experiment |
| variant_id | STRING | Conditional | Experiment variant |
| experiment_assignment_id | STRING | Conditional | Stable experiment assignment |
| form_instance_id | STRING | Conditional | One rendered form attempt |
| web_submission_id | STRING | Conditional | One accepted web submission |
| lead_id_hash | STRING | Conditional | Privacy-safe join key |
| form_completion_time_seconds | FLOAT | Conditional | Non-negative form duration |
| form_error_count | INTEGER | Conditional | Non-negative form error count |
| personalisation_assignment_id | STRING | Conditional | Audience and holdout assignment |
| lead_status | STRING | Conditional | Sanitised CRM lifecycle outcome |
| order_value_band | STRING | Conditional | Bounded synthetic order outcome |
| consent_analytics | STRING | Yes | Consent state |

Nested GA4-style parameters may be represented in raw source and flattened in staging.

Flat synthetic and nested GA4-style inputs are separate raw shapes. Both must
be normalised to `contracts/schemas/canonical_event.schema.json` before
governed transformations.
