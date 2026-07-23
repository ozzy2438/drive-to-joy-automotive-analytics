# GA4 Configuration Plan

## Core settings

- Configure correct timezone and currency.
- Use a web stream for the demo site.
- Document enhanced measurement decisions.
- Add internal traffic and test-environment filtering rules.
- Document cross-domain measurement if external booking flow exists.
- Enable BigQuery export or equivalent synthetic export flow.

## Conversion events

Primary web conversions:

- `test_drive_submit`
- `quote_submit`

CRM events such as `lead_qualified` and `vehicle_ordered` are downstream warehouse outcomes and should be reported through the CRM-connected mart layer.

## Required custom dimensions

`vehicle_model`, `vehicle_variant`, `powertrain`, `dealer_id`, `dealer_state`, `form_type`, `form_error_type`, `experiment_id`, `variant_id`, `audience_id`, `experience_id`, `holdout_flag`, `journey_stage`.

## QA

Validate each approved event in GTM Preview, DebugView and raw export before reporting use.
