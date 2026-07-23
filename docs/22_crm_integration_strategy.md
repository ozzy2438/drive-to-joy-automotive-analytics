# CRM Integration Strategy

## Core principle

Web form submit, CRM-qualified lead and vehicle order are distinct outcomes.

## Flow

```text
Web form submit → generated lead key → hashed analytics key → CRM lead
→ qualification/disqualification → appointment → attendance → order
```

## Required CRM fields

- `crm_lead_id`
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
