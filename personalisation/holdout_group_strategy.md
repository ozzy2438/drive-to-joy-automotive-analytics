# Holdout Group Strategy

## Principle

For each eligible audience, randomly assign a documented percentage to a generic/control experience.

## Required fields

- audience_id
- eligibility timestamp
- experience_id
- holdout_flag
- assignment key
- exposure timestamp
- outcome window

## Monitoring

- Allocation balance
- Exposure integrity
- Outcome completeness
- Collision with experiments
- Guardrails by holdout/treatment

## Decision rule

Do not claim personalisation value from engagement alone. Compare outcome rate and guardrails against holdout.
