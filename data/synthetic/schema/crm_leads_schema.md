# CRM Leads Schema

| Field | Type | Required | Description |
|---|---|---|---|
| crm_lead_id | STRING | Yes | CRM primary identifier |
| web_submission_id | STRING | Yes | Accepted web submission identifier |
| lead_id_hash | STRING | Yes | Analytics match key |
| web_submit_at | TIMESTAMP | Yes | Web conversion time |
| lead_created_at | TIMESTAMP | Yes | CRM creation time |
| lead_status | STRING | Yes | Lifecycle status |
| lead_status_updated_at | TIMESTAMP | Yes | Last lifecycle time |
| vehicle_model_interest | STRING | Yes | Interested model |
| dealer_id | STRING | Conditional | Assigned dealer |
| disqualification_reason | STRING | Conditional | Quality reason |
| appointment_booked_at | TIMESTAMP | Conditional | Booking time |
| appointment_attended_flag | BOOLEAN | Yes | Attendance outcome |
| vehicle_ordered_flag | BOOLEAN | Yes | Order outcome |
| order_value_band | STRING | Conditional | Value proxy |

`lead_id_hash` is derived from an opaque generated reference. It must never be
created by hashing raw email, phone, name or address data for analytics.
