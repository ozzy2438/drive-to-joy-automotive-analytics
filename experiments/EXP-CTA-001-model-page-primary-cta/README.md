# EXP-CTA-001 — Model Page Primary CTA

## Business problem

Vehicle-model-page visitors may be ready for different next steps. A single generic CTA may not produce the highest-quality downstream lead outcome.

## Research question

Does directing users to a vehicle configurator instead of directly to a test-drive form increase CRM-qualified lead rate?

## Variants

| Variant | Experience |
|---|---|
| Control | `Book a Test Drive` |
| Treatment A | `Build Your Vehicle` |
| Treatment B | `Estimate Your Repayment` |

## Primary metric

```text
Qualified Lead Rate =
CRM-qualified leads / eligible exposed users
```

## Secondary metrics

- Test-drive booking rate
- Quote request rate
- Configurator completion rate
- Finance-calculator completion rate
- CRM match rate
- Appointment booking rate
- Appointment attendance rate
- Vehicle-order rate

## Guardrails

- Form error rate
- Exit rate
- Page-performance metrics
- Duplicate lead rate
- Lead rejection rate
- Dealer-capacity flags
- Mobile error rate

## Required controls

- Stable user-level assignment.
- Exposure recorded before outcomes.
- Concurrent variants.
- Sample-size plan.
- Sample Ratio Mismatch check.
- Segment analysis by device, channel, new/returning user and model.
- No rollout before the planned evidence threshold or documented stopping rule.
