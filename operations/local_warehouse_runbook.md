# Local Warehouse Runbook

## Normal run

From the repository root:

```bash
make setup
make warehouse-smoke
```

A successful run ends with every dbt model, seed and test passing. Inspect
`data/processed/local_foundation/manifest.json` and
`warehouse_load_manifest.json` for source configuration, digests and counts.

## Failure triage

| Failure | First check | Owner |
|---|---|---|
| Source digest mismatch | Manifest and Parquet path came from the same run | Analytics Engineering |
| Contract or PII rejection | Generator/adapter change and forbidden-field guard | Digital Analytics |
| CRM match/lifecycle failure | Submission/hash agreement and UTC timestamps | CRM Analytics |
| Assignment validity/window failure | Assignment ID, key, exposure and window | Experimentation |
| Reference/UTM failure | Versioned registry and campaign active dates | Marketing Analytics |
| Controlled-defect test failure | Defect registry IDs still resolve | Analytics Engineering |
| Daily volume anomaly | Event/day row, absolute delta and generator change | Digital Analytics |

Do not weaken a critical threshold merely to make CI green. Reproduce with
the committed seed, isolate whether the source, adapter or transformation
changed, add a regression test and document an intentional contract change.

## Scale acceptance

Run `make warehouse-scale` outside routine CI. Confirm the manifest reports:

- 180 generated days;
- more than 100,000 identified consented sessions;
- more than 500,000 canonical events;
- passing clean quality results;
- registered controlled defects detected separately.

## Escalation boundary

This runbook covers local synthetic and local-demo data only. A production
credential, cloud deployment, real CRM extract, alert integration or
customer-data incident requires owner authorisation and a separate production
runbook.
