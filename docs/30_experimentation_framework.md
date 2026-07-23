# Experimentation Framework

## Objective

Run experiments that produce reliable learning and commercially meaningful decisions.

## Lifecycle

```text
Opportunity → Evidence → Hypothesis → Prioritisation → Pre-registration
→ Experience Design → Tracking → Power Plan → QA → Launch
→ Monitoring → Analysis → Decision → Documentation → Follow-up
```

## Required pre-registration fields

- Experiment ID and owner
- Business problem
- Research evidence
- Hypothesis
- Control and treatment
- Eligibility and exclusions
- Allocation ratio
- Primary, secondary and guardrail metrics
- Minimum detectable effect
- Statistical power and alpha
- Sample-size plan
- Planned duration
- Segment-analysis plan
- Sample Ratio Mismatch check
- Decision rule
- Rollback plan

## Decision rules

| Outcome | Decision |
|---|---|
| Primary metric improves and guardrails pass | Consider rollout |
| Primary metric neutral and guardrails pass | Stop or iterate |
| Primary metric worsens | Stop |
| Guardrail worsens materially | Stop or redesign |
| SRM detected | Invalidate and investigate |
| Sample size insufficient | Continue or stop for feasibility |

## Integrity rules

- Do not declare winners from small samples.
- Do not change primary metrics after results are visible.
- Do not ignore CRM quality or downstream outcomes.
- Do not treat clicks as the only success outcome when qualified leads are the business goal.
- Do not report inconclusive outcomes as wins.
