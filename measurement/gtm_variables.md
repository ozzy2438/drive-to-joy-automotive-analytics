# GTM Variables

## Required data-layer variables

| GTM Variable | dataLayer path | Purpose |
|---|---|---|
| DLV - event_id | `event_id` | Deduplication/audit |
| DLV - page_type | `page_context.page_type` | Content context |
| DLV - journey_stage | `page_context.journey_stage` | Funnel context |
| DLV - vehicle_model | `vehicle_context.vehicle_model` | Model analysis |
| DLV - vehicle_variant | `vehicle_context.vehicle_variant` | Variant analysis |
| DLV - powertrain | `vehicle_context.powertrain` | Segmentation |
| DLV - dealer_id | `dealer_context.dealer_id` | Handoff analysis |
| DLV - dealer_state | `dealer_context.dealer_state` | Geography |
| DLV - form_type | `form_context.form_type` | Form reporting |
| DLV - experiment_id | `experimentation_context.experiment_id` | A/B tests |
| DLV - variant_id | `experimentation_context.variant_id` | A/B tests |
| DLV - lead_id_hash | `identity_context.lead_id_hash` | Privacy-safe matching |
| DLV - consent_analytics | `user_context.consent_analytics` | Consent-aware logic |
