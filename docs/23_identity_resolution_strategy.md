# Identity Resolution Strategy

## Identity levels

| Level | Identifier | Use |
|---|---|---|
| Anonymous browser | `user_pseudo_id` | Web behaviour |
| Session | `session_id` | Funnel analysis |
| Configuration | `configurator_id` | Resume/build journey |
| Web lead | `lead_id_hash` | Privacy-safe match |
| CRM lead | `crm_lead_id` | CRM record |
| CRM customer | `crm_contact_id` | Optional known-customer context |

## Rules

- No raw PII in analytics layer.
- Do not assume cross-device identity without approved evidence.
- Keep unmatched records for match-rate reporting.
- Do not join records on weak descriptive signals.
- Document every join rule and uncertainty.
