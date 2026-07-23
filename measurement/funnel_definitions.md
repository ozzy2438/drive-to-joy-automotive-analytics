# Funnel Definitions

## Primary funnel

| Step | Qualification rule | Source event/outcome |
|---|---|---|
| Engaged session | Session meets approved engagement rule | `fct_sessions` |
| Model research | At least one model view | `view_vehicle_model` |
| High intent | Configurator, finance completion, dealer selection or form start | approved event set |
| Web lead | Successful quote or test-drive submit | `test_drive_submit` or `quote_submit` |
| CRM matched lead | Web lead joins CRM on approved hash | `fct_lead_funnel` |
| Qualified lead | CRM status equals approved qualified state | `lead_qualified` |
| Appointment booked | CRM booking timestamp populated | CRM |
| Appointment attended | Attendance flag true | CRM |
| Vehicle ordered | Order flag true | CRM/order extract |

## Sequencing rules

- A qualified lead must have a CRM-matched record.
- An appointment attended must have an appointment booked record.
- An order should normally have a qualified lead, unless a documented exception applies.
- A form submit may occur without a dealer only if business rules explicitly allow central lead routing.

## Reporting note

Funnel counts are not always strictly nested at user level due to multi-session journeys, deduplication, consent limits and operational exceptions. Reports must describe their grain and denominator.
