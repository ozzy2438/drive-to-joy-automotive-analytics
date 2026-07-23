# Access Control

## Principle

Grant least privilege based on job responsibility.

| Role | Typical permissions |
|---|---|
| Analytics viewer | Read marts only |
| Analyst | Read marts and sandbox query |
| Analytics engineer | Transform datasets and dbt jobs |
| CRM operations | Controlled raw CRM access |
| Web developer | No unrestricted CRM access |
| Service account | Only required pipeline datasets |

Do not use personal owner credentials for automated jobs.
