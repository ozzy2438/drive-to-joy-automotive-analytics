# Architecture Specification

## System context

The system receives web interaction events from a fictional automotive demo site, campaign metadata, CRM lead outcomes and reference dimensions. It transforms these into governed marts for reporting, data-quality controls, experimentation and personalisation measurement.

## Functional requirements

- Preserve raw source data separately from transformed logic.
- Make business metrics reusable and documented.
- Track web-to-CRM linkage through privacy-aware hashed keys.
- Support daily quality checks and scheduled dashboard refresh.
- Support experiment exposure before outcome measurement.
- Support personalisation holdout analysis.

## Non-functional requirements

- Reproducible synthetic data generation.
- Cost-aware warehouse querying.
- No raw PII in analytics layer.
- Clear ownership and runbooks.
- Testable transformations.
- Versioned specifications and releases.
