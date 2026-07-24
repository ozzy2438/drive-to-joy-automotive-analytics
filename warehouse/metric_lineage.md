# Metric Lineage

| Metric family | Canonical sources | Governed output |
|---|---|---|
| Executive funnel | `fct_sessions`, `fct_lead_funnel` | `agg_executive_daily` |
| Journey progression | `fct_vehicle_journey` | `agg_journey_daily` |
| Marketing efficiency | `fct_media_performance`, sessions and matched leads | `agg_marketing_daily` |
| Data quality | Canonical events, sessions and quality results | `agg_data_quality_daily` |
| Experiment | Valid exposure and 30-day bounded outcomes | `agg_experiment_daily` |
| Personalisation | Assignment-key exposure, holdout and 14-day outcomes | `agg_personalisation_daily` |
| CRM reconciliation | Web/CRM full reconciliation | `fct_reconciliation_results` |

Each governed aggregate maps to metric IDs in
`measurement/metric_contracts.yml` and executable SQL under
`dashboards/reconciliation/`.

```text
Source adapter
→ canonical staging
→ session/form/assignment intermediates
→ canonical facts
→ governed daily aggregate
→ reconciliation SQL
→ future dashboard consumer
```

The dashboard allowlist prevents consumers from bypassing this lineage.
