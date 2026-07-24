# Repository Governance and Reproducible Baseline

## Scope

This policy governs the Sprint 0–1 engineering baseline. It covers repository
changes, canonical contracts, synthetic data and local warehouse validation.
It does not authorise frontend, dashboard, live experiment or cloud deployment
work.

## GitHub workflow

- Every implementation starts from a bounded GitHub issue.
- Direct commits to `main` are prohibited.
- Changes use a topic branch and a pull request.
- Pull requests remain draft until required checks and review evidence are
  complete.
- CODEOWNERS establishes the default review owner.
- Dependency update pull requests are limited to GitHub Actions and the Python
  package ecosystems configured in Dependabot.

Recommended `main` protection settings are:

1. Require a pull request before merging.
2. Require one approving review and dismissal of stale approvals.
3. Require conversation resolution.
4. Require applicable CI checks to pass.
5. Block force pushes and branch deletion.

Repository settings are owner-controlled external state. They must be enabled
only after the owner confirms the desired merge strategy and required-check
names. The project licence is also an explicit owner decision and is not
inferred by contributors.

## Required evidence

The repository baseline has five independently useful checks:

| Check | Evidence |
|---|---|
| Markdown Lint | Documentation syntax is valid |
| Python Tests | Contract, adapter, generator and statistics tests pass |
| Data Quality Checks | Generated foundation passes DuckDB validations |
| dbt Tests | The complete dbt graph parses without cloud credentials |
| Documentation Release Check | Required disclosure and contract files exist |

Path filters may skip an irrelevant check. A check must not report success by
printing instructions or running a placeholder command.

## Contract change policy

- The schemas in `contracts/schemas/` are the machine-readable source of truth.
- Additive, backwards-compatible fields require a documented minor version.
- Removed fields, renamed fields or changed semantics require a major version
  and migration plan.
- Both source adapters must produce the same canonical event columns.
- Downstream models depend on the canonical staging relation, not raw source
  shapes.
- `form_instance_id`, `web_submission_id` and `lead_id_hash` are not
  interchangeable.
- Experiment and personalisation outcomes require the approved assignment key
  and a bounded post-exposure window.

## Data policy

Core project data remains synthetic. Public or external data may be used only
for schema practice, methodology or market context and must carry its origin.

The public repository must never contain:

- Honda Australia proprietary or customer data;
- raw or hashed email addresses, phone numbers, names or addresses;
- real campaign, CRM or experiment results;
- claims presented as real Honda performance;
- credentials, production exports or unrestricted pseudonymous extracts.

Generated files live under `data/processed/`, are ignored by Git, and declare
`data_origin=synthetic`. Controlled defect cases are isolated from clean
canonical datasets.

## Reproducibility

`make setup` creates the local Python 3.11 environment. `make check` runs tests,
regenerates the deterministic foundation, validates the dbt graph and lints
Markdown. The data manifest records configuration, file digests and validation
results so two runs can be compared without committing generated data.
