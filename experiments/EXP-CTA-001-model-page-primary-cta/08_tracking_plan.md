# Tracking Plan

## Required events

| Event | Required fields |
|---|---|
| `experiment_exposure` | experiment_id, variant_id, user/session key, timestamp |
| CTA click event if implemented | CTA label, destination, experiment context |
| `configurator_start` / complete | vehicle and experiment context |
| `finance_calculator_start` / complete | vehicle and experiment context |
| `test_drive_submit` / `quote_submit` | lead hash, vehicle, dealer and experiment context |
| CRM qualification | lead hash and outcome |

## Validation

Exposure must occur before conversion. Variant assignment must remain stable. CRM outcomes must be joined only through approved lead hash.
