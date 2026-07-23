# Experiment Implementation Plan

## Requirements

- Deterministic/stable assignment by browser/user key.
- Assignment before CTA render.
- Assignment persisted through session/return visit according to design.
- `experiment_exposure` fires only after actual experience render.
- Variant ID travels with downstream conversion events.
- Feature flag or environment setting allows rollback.
- Collision rules prevent incompatible tests.

## Personalisation

Personalisation assignment must be separate from experiment assignment and must include `audience_id`, `experience_id` and `holdout_flag`.
