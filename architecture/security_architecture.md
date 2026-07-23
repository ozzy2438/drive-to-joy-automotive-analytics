# Security Architecture

## Controls

- No raw PII in event analytics.
- CRM raw source access is limited.
- Hashed lead key used for analytics matching.
- Service accounts use least privilege.
- Secrets stored outside Git.
- Development/staging/production separated where feasible.
- Audit release changes through GitHub and ticket references.
- Public repository contains only synthetic or approved public data.
