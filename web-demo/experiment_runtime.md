# Experiment Runtime

## Active implementation

Only `EXP-CTA-001` is runtime-enabled. It has:

- `control`
- `treatment_a`
- `treatment_b`

The other registry experiments remain inactive contracts.

## Assignment

- Allocation unit: consent-granted opaque browser ID.
- Rule: SHA-256 of experiment ID and browser ID mapped to registry allocation.
- Persistence: first-party local storage.
- Assignment ID: deterministic opaque identifier separate from browser ID.
- Kill switch: `NEXT_PUBLIC_EXP_CTA_001_ENABLED=false`.
- Collision namespace: `model_primary_action`.

## Exposure

Assignment does not create exposure. The model CTA component emits
`experiment_exposure` only in a post-render effect after the assigned CTA is
present. The exposure is de-duplicated by assignment ID across navigation and
React development re-rendering.

The assignment and variant travel into accepted CRM requests and later
conversion events. Direct form entry does not create a new experiment
assignment because an unexposed assignment must not be attributed.

## Interpretation

The UI displays no uplift, winner or performance claim. Synthetic events prove
instrumentation only. Statistical power, pairwise comparisons and error-rate
control remain governed by the experiment design documents.
