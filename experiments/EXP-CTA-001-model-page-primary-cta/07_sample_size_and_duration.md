# Sample Size and Duration

## Inputs to set before launch

- Baseline qualified-lead rate
- Minimum detectable effect
- Statistical power, default 80%
- Alpha, default 0.05
- Allocation ratio
- Expected eligible traffic/day
- Expected consent coverage

## Three-arm comparison family

EXP-CTA-001 has one control and two treatments. The confirmatory comparison
family is:

1. Treatment A versus control.
2. Treatment B versus control.

The family-wise two-sided alpha is 0.05. Final p-values use Holm adjustment.
Until a validated three-arm simulation is available, sample-size planning uses
a conservative alpha of 0.025 for each treatment-control comparison and 80%
target power.

The experiment remains `blocked_pending_baseline` until the following values
are approved:

- Baseline qualified-lead rate
- Minimum detectable absolute effect
- CRM outcome window
- Expected eligible traffic and consent coverage

The machine-readable draft is stored in
`contracts/examples/EXP-CTA-001.definition.json`.

## SRM rule

Use a chi-square goodness-of-fit check against the registered 1:1:1 allocation.
An allocation-gap percentage is useful for triage but is not the statistical
SRM decision test.

## Duration rule

Run until the planned sample is reached and at least one representative business cycle is covered. Do not stop early only because a dashboard looks favourable.

## Feasibility rule

If live demo traffic cannot reach the planned sample, label the result as instrumentation/operational validation or inconclusive rather than claiming a winner.
