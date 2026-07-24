# Phase 07 — Data Quality

## Objective

Operationalise analytics data integrity.

## Required checks

- Daily event anomaly
- Required parameter completeness
- UTM compliance
- Duplicate lead detection
- CRM match rate
- Data freshness
- Consent-rate shift
- Experiment Sample Ratio Mismatch
- Invalid funnel progression

## Exit criteria

- [ ] Every critical check has an owner.
- [ ] Every critical check has an alert path.
- [ ] Every critical alert has a runbook.
- [ ] Dashboard quality status is visible.
- [x] At least one simulated incident is executable through controlled defects.

Local critical checks have explicit owners in `fct_data_quality_results` and a
local runbook. External alert routing and dashboard visibility remain pending.
