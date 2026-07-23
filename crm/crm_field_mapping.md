# CRM Field Mapping

| Web/analytics concept | CRM field | Warehouse field | Notes |
|---|---|---|---|
| Web lead key | generated on submit | `lead_id_hash` | Hash before analytics use |
| Vehicle interest | vehicle selection | `vehicle_model_interest` | Standardise against vehicle dimension |
| Dealer choice | dealer selection | `dealer_id` | Validate against dealer dimension |
| Submission time | form completion time | `web_submit_at` | Use UTC standard |
| CRM record | lead primary key | `crm_lead_id` | Keep raw ID in restricted source layer if needed |
| Qualification | lead status | `lead_status` | Controlled accepted values |
| Rejection reason | disqualification reason | `disqualification_reason` | Categorised values |
| Attendance | appointment status | `appointment_attended_flag` | Boolean/controlled field |
| Order | sale/order status | `vehicle_ordered_flag` | Downstream outcome |
