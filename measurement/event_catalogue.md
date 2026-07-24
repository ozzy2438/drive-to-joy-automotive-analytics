# Event Catalogue

## Naming Convention

All events use lower snake case and follow `verb_object`.

## Core events

| Event | Trigger | Required parameters | Purpose |
|---|---|---|---|
| `view_vehicle_model` | Model page viewed | `vehicle_model`, `journey_stage` | Vehicle interest |
| `view_vehicle_variant` | Variant viewed | `vehicle_model`, `vehicle_variant` | Variant interest |
| `compare_vehicle_models` | Comparison initiated | `vehicle_model`, `comparison_model` | Consideration |
| `configurator_start` | Configurator begins | `vehicle_model`, `entry_point` | High intent |
| `configurator_step_complete` | Configurator step ends | `vehicle_model`, `configurator_step` | Friction analysis |
| `configurator_complete` | Configuration completed | `vehicle_model`, `vehicle_variant`, `configurator_id`, `configurator_value_band` | Strong intent |
| `finance_calculator_start` | Calculator starts | `vehicle_model`, `entry_point` | Finance consideration |
| `finance_calculator_complete` | Result generated | `vehicle_model`, `loan_term_months`, `repayment_band` | Finance intent |
| `dealer_search` | Dealer search begins | `search_method`, `dealer_state` | Local intent |
| `dealer_select` | Dealer selected | `dealer_id`, `dealer_state`, `vehicle_model` | Dealer handoff |
| `test_drive_start` | Form begins | `form_instance_id`, `vehicle_model`, `dealer_id`, `form_type` | Form funnel |
| `quote_start` | Quote form begins | `form_instance_id`, `vehicle_model`, `dealer_id`, `form_type` | Form funnel |
| `form_error` | Validation issue | `form_instance_id`, `form_type`, `form_field`, `form_error_type` | UX friction |
| `test_drive_submit` | Submission accepted | `form_instance_id`, `web_submission_id`, `lead_id_hash`, `vehicle_model`, `dealer_id`, `form_type` | Primary web conversion |
| `quote_submit` | Submission accepted | `form_instance_id`, `web_submission_id`, `lead_id_hash`, `vehicle_model`, `dealer_id`, `form_type` | Primary web conversion |
| `experiment_exposure` | Assigned variant is rendered | `experiment_assignment_id`, `experiment_id`, `variant_id` | Experiment analysis |
| `personalisation_exposure` | Assigned experience is rendered | `personalisation_assignment_id`, `audience_id`, `experience_id`, `holdout_flag` | Personalisation analysis |
| `consent_update` | Consent changes | `consent_analytics`, `consent_marketing` | Consent reporting |
| `lead_qualified` | CRM outcome imported | `lead_id_hash`, `lead_status` | Lead quality |
| `appointment_attended` | CRM attendance imported | `lead_id_hash`, `dealer_id` | Sales progression |
| `vehicle_ordered` | Order imported | `lead_id_hash`, `vehicle_model`, `order_value_band` | Commercial outcome |

## Global parameter policy

Where applicable, events must provide `page_type`, `journey_stage`, consent context, campaign context, and active experiment/personalisation context. No raw PII may be passed to analytics events.

Identity fields follow the versioned contracts in `contracts/`. A hash of an
email address or phone number is not an approved `lead_id_hash`.
