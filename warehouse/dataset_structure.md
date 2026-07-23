# Dataset Structure

| Dataset | Content | Retention/role |
|---|---|---|
| raw_ga4 | Raw event export | Source preservation |
| raw_crm | CRM outcome extracts | Restricted operational source |
| raw_media | Spend/campaign extracts | Marketing source |
| raw_reference | Vehicle/dealer/campaign/experiment dimensions | Reference source |
| analytics_staging | Standardised models | Transformation |
| analytics_intermediate | Reusable logic | Transformation |
| analytics_marts | Governed reporting tables | BI consumption |
| analytics_quality | Check outputs | Monitoring |
| analytics_sandbox | Ad hoc analysis | Controlled exploration |
