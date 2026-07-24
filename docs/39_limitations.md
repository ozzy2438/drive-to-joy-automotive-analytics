# Limitations

## Data limitations

- Core automotive events, CRM, media, vehicle and dealer data is synthetic.
- Synthetic data is behaviourally coherent but cannot reproduce actual customer behaviour.
- Public market data provides context, not first-party conversion truth.
- GA4 demo data is ecommerce-oriented rather than automotive-specific.
- CRM matching is conceptual unless demonstrated in a controlled demo environment.

## Experiment limitations

- Low-traffic demo environments may not reach adequate sample sizes.
- A live demo can validate instrumentation but remain statistically inconclusive.
- Synthetic experiment outcomes demonstrate methodology, not market impact.
- No result may be represented as Honda Australia performance.
- `EXP-CTA-001` runtime assignment and exposure validate instrumentation only;
  the repository declares no winner or uplift.

## Demo runtime limitations

- The Next.js site and Route Handlers are a single-process local demonstration.
- NDJSON append order is not a multi-process durability guarantee.
- The CRM emulator is not Salesforce and has no authentication or admin UI.
- Anonymous identity and decisioning are browser-local and do not resolve
  cross-device users.
- Consent is a demonstrable first-party policy state, not a production CMP.
- No real GTM, GA4, BigQuery or CRM credential is configured.
- Local export routes are disabled in production and are not a production
  access-control design.
- Responsive layouts use native accessible controls, but a formal WCAG audit
  and cross-browser/mobile device matrix have not been completed.

## Attribution limitations

- Automotive journeys are long and multi-touch.
- Offline outcomes are difficult to attribute perfectly.
- Consent affects observed journey coverage.
- CRM and analytics timestamps may differ.

## Local warehouse limitations

- DuckDB demonstrates the complete canonical graph but is not a deployed
  BigQuery environment.
- Nested GA4 support is parse-validated only; no real export or credential is
  used.
- Local-demo NDJSON is sanitised runtime evidence, not GA4 or Salesforce data.
- Production partitioning, clustering, orchestration, freshness alerts and
  access controls remain design specifications.
- Assignment context can persist beyond an analytical outcome window; marts
  correctly retain the context but exclude it from attributed outcomes.

## Semantic-layer limitations

- The metric registry and aggregates are executable locally but are not a
  deployed BI semantic service.
- Dashboard acceptance fixtures validate known synthetic scenarios, not visual
  layout, accessibility or stakeholder usability.
- The local evaluation clock is deterministic and must be supplied by
  production orchestration in a future deployment.
- Melbourne business dates are tested across DST boundaries; no other business
  timezone is supported by metric contract version `1.0.0`.
- Daily ratios cannot be averaged. Future consumers must use the preserved
  additive numerator and denominator fields.

## Portfolio statement

This repository demonstrates how a production-quality analytics capability can
be designed and implemented. It does not claim that its fictional data,
conversion rates, experiment results or dashboards reflect Honda Australia
systems or commercial performance.
