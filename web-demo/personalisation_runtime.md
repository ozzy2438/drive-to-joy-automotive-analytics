# Personalisation Runtime

## Implemented audiences

- `AUD-HYB-001` — current hybrid research context.
- `AUD-CFG-002` — configuration started but not completed.
- `AUD-FIN-003` — repeated illustrative finance completion.
- `AUD-RET-004` — returning, high-intent synthetic journey.
- `AUD-REG-005` — selected regional dealer.

`AUD-OWN-006` remains a disabled placeholder and has no runtime rule.

## Decision sequence

1. Require analytics consent.
2. Evaluate the versioned audience eligibility rule.
3. Exclude audiences whose collision namespace is reserved.
4. Exclude audiences still in cooldown.
5. Select the one highest-priority eligible audience.
6. Assign deterministically to treatment or generic holdout.
7. Render one primary experience.
8. Emit `personalisation_exposure` after render.
9. Start the audience cooldown only after successful dispatch.

Every exposure includes audience, experience, holdout and personalisation
assignment IDs.

## Collision rule

The active CTA experiment reserves `model_primary_action`. Personalisation in
that namespace is suppressed while the experiment assignment is active.
Dealer and finance namespaces remain independently eligible.

## Measurement

The generic holdout is a rendered experience and therefore receives an
exposure event with `holdout_flag=true`. Downstream incrementality analysis
must join on the personalisation assignment ID and a bounded outcome window,
not only on session engagement.
