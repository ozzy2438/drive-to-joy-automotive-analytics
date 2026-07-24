# CRM Integration Strategy

## Core principle

Web form submit, CRM-qualified lead and vehicle order are distinct outcomes.

## Flow

```text
Form instance → accepted web submission → generated opaque lead key
→ hashed analytics key → CRM lead
→ qualification/disqualification → appointment → attendance → order
```

## Required CRM fields

- `crm_lead_id`
- `web_submission_id`
- `lead_id_hash`
- `lead_created_at`
- `lead_status`
- `lead_status_updated_at`
- `vehicle_model_interest`
- `dealer_id`
- `disqualification_reason`
- `appointment_booked_at`
- `appointment_attended_flag`
- `vehicle_ordered_flag`
- `order_value_band`

## Match monitoring

Measure match rate by date, form, model, device, channel and dealer. Treat sudden decline as a quality incident.

## Identity rules

- `form_instance_id` joins start and error behaviour before submission.
- `web_submission_id` identifies exactly one accepted submission.
- `lead_id_hash` closes the accepted submission to CRM outcomes.
- CRM qualification must not be inferred from a form event.
- Hashed email, phone, name or address values are prohibited in analytics.

The machine-readable identity contract lives in `contracts/`.
