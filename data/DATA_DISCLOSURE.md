# Data Disclosure

## No proprietary data

This repository does not include Honda Australia data, customer information, analytics exports, CRM data, dealership data, campaign data, financial data or employee data.

## Core data policy

The project uses:

1. Synthetic automotive website events.
2. Synthetic CRM lead and sales outcomes.
3. Synthetic media spend, vehicle and dealer dimensions.
4. Public/open data for market, geography and search-interest context.
5. Official GA4 sample-data references for schema and analytics modelling practice.

## Prohibited representation

Do not describe any project result as Honda Australia performance, Honda customer behaviour, Honda campaign result or Honda experimentation result.

## Privacy rules

- Do not send raw PII to GA4-style events.
- Use generated pseudonymous submission references for web-to-CRM matching.
- Never derive analytics identifiers from email addresses, phone numbers,
  names or other raw PII, even when hashed.
- Never commit secrets or credentials.
- Do not commit production exports to Git.
- Label outputs as `Synthetic demonstration data`, `Public open-data context`, or `Official sample analytics data`.
