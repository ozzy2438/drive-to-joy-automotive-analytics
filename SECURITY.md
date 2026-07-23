# Security Policy

## Reporting a vulnerability

Do not open a public issue for secrets, credentials, personal data or security vulnerabilities.

Contact the repository owner privately through GitHub instead.

## Repository security rules

- Never commit API keys, access tokens or passwords.
- Never commit raw customer data or PII.
- Use `.env` locally and commit only `.env.example`.
- Treat experiment and CRM identifiers as sensitive even when hashed.
- Rotate any accidentally exposed credential immediately.
