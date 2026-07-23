# Sample Size and Duration

## Inputs to set before launch

- Baseline qualified-lead rate
- Minimum detectable effect
- Statistical power, default 80%
- Alpha, default 0.05
- Allocation ratio
- Expected eligible traffic/day
- Expected consent coverage

## Example Python use

Use `python/src/experimentation/sample_size.py` to calculate users required per variant.

## Duration rule

Run until the planned sample is reached and at least one representative business cycle is covered. Do not stop early only because a dashboard looks favourable.

## Feasibility rule

If live demo traffic cannot reach the planned sample, label the result as instrumentation/operational validation or inconclusive rather than claiming a winner.
