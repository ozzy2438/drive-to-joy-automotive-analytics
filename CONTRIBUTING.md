# Contributing

## Principles

This is a documentation-led, production-minded portfolio project.

1. Do not commit secrets.
2. Do not commit raw PII.
3. Do not represent synthetic data as real Honda data.
4. Do not change KPI logic without updating definitions.
5. Do not change event names without updating the event catalogue.
6. Do not launch experiments without a documented brief.
7. Do not publish dashboard metrics without lineage.
8. Do not merge data-model changes without tests.
9. Do not modify tracking without QA evidence.
10. Keep Markdown documentation current.

## Change workflow

1. Open or link a GitHub issue with bounded acceptance criteria.
2. Create a branch from the current `main`; do not commit directly to `main`.
3. Use `feat/`, `fix/`, `docs/`, or `chore/` as the branch prefix.
4. Keep generated data, credentials and local dbt profiles out of Git.
5. Run `make check` before requesting review.
6. Open a pull request and keep it draft until its checks and evidence are
   complete.
7. Merge only through a reviewed pull request after required checks pass.

The recommended required checks are `Markdown Lint`, `Python Tests`,
`Data Quality Checks`, `dbt Tests`, and `Documentation Release Check` when
their path filters apply.

## Pull-request checklist

- [ ] Linked issue.
- [ ] Documentation updated.
- [ ] Tests added or updated.
- [ ] No secrets included.
- [ ] No PII included.
- [ ] Data-quality impact assessed.
- [ ] Dashboard impact assessed.
- [ ] Experiment impact assessed.
- [ ] Rollback considered.
- [ ] QA evidence attached where relevant.
- [ ] Canonical contract compatibility assessed.
- [ ] Synthetic/public/proprietary data origin is explicit.
