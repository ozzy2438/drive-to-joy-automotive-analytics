# Integration Map

| Integration | Direction | Purpose | Key controls |
|---|---|---|---|
| Demo site → dataLayer | Client-side | Business context | Contract/versioning |
| dataLayer → GTM | Client-side | Tag mapping | Preview/QA |
| GTM → GA4 | Client-side | Event collection | Consent/no PII |
| GA4 → BigQuery | Batch export | Raw events | Freshness/schema checks |
| Forms → CRM | API/webhook/mock | Lead creation | Hash key and status contract |
| CRM → Warehouse | Batch/API/mock | Outcome closure | Match/freshness checks |
| Media → Warehouse | Batch/API/mock | Cost context | UTM/campaign governance |
| Warehouse → BI | Query/connector | Reporting | Governed marts only |
