# Assumptions and Constraints

## Assumptions

- The demo brand operates a web-first automotive research journey.
- Vehicle research, configuration, finance evaluation and dealer selection are meaningful intent signals.
- A CRM can return lead status and sales-progression data to a warehouse.
- GA4-style event data can be exported to BigQuery or represented with equivalent synthetic tables.
- Experiment assignment can be stable at user or browser level.

## Constraints

- No proprietary Honda data or systems are available.
- Core event, CRM and media datasets must be synthetic.
- Demo traffic may be insufficient for statistically conclusive live tests.
- Consent choices may reduce session-level observability.
- Identity resolution across devices is uncertain.
- Public data provides external context, not first-party truth.

## Design response

The repository documents limitations, creates controlled synthetic imperfections and treats live demo experimentation as instrumentation validation unless adequate sample size is reached.
