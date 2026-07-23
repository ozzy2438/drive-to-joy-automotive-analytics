# Lead Scoring Strategy

## Purpose

Create an explainable behavioural-intent prototype that can prioritise analysis and follow-up. It is not a production ML decision system.

## Example scoring

| Behaviour | Score |
|---|---:|
| Model view | 5 |
| Vehicle comparison | 8 |
| Configurator start | 12 |
| Configurator complete | 20 |
| Finance calculator complete | 15 |
| Dealer select | 15 |
| Returning high-intent session | 10 |
| Test drive/quote submit | 35 |
| Duplicate lead | -20 |
| Invalid contact outcome | -25 |

## Calibration

Compare score bands with CRM qualification, attendance and order outcomes. Monitor false positives, false negatives, drift and fairness risks.
