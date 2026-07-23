# Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Tracking implementation drifts from specification | Incorrect metrics | dataLayer contract, GTM QA, release checklist |
| Low demo traffic | Inconclusive experiments | Synthetic test dataset, sample-size disclosure, avoid false claims |
| GA4 UI and BigQuery mismatch | Conflicting reporting | Document metric source and reconciliation rules |
| Missing campaign metadata | Channel misattribution | UTM governance and compliance monitoring |
| CRM matching failures | Lead-quality blind spot | Hashed lead key, match-rate dashboard, incident runbook |
| Duplicate events/leads | Inflated performance | Deduplication logic and quality tests |
| Overlapping experiments | Invalid causal interpretation | Experiment registry and collision review |
| Personalisation without control | No incrementality evidence | Mandatory holdout groups |
| Privacy issue | High risk | No raw PII in analytics, security policy, synthetic data |
| Dashboard metric proliferation | Stakeholder confusion | Metric layer, dashboard inventory and ownership |
