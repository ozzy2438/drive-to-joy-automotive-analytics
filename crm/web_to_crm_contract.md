# Web-to-CRM Contract

## Input contract

A successful web form must produce a generated lead reference. The CRM integration must preserve this reference or a deterministic linked value so it can be hashed and matched in the warehouse.

## Required fields at submission

- Form type
- Submission timestamp
- Vehicle model/variant where known
- Selected dealer where known
- Lead key
- Campaign and page context where policy permits

## Privacy

Do not export raw email, phone or name to analytics tables. The CRM source retains operational PII under its own access controls; analytics receives only approved hash and outcome fields.

## Matching SLA

Document expected delay from web submit to CRM availability. Freshness checks must distinguish delayed operational processing from technical failure.
