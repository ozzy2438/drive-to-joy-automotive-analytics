# Consent Measurement Plan

## Objective

Respect consent choices while making observability limitations visible.

| State | Treatment |
|---|---|
| Granted | Include in approved session/user analysis where available |
| Denied | Handle as limited/cookieless measurement according to implementation |
| Unknown | Treat as configuration issue until resolved |
| Revoked | Stop applicable future processing per platform policy |

## Metrics

- Consent acceptance/decline rate
- Consent by channel and device
- Consent trend and release impact
- Events without session ID
- Session/funnel coverage limitations

## Non-negotiable rules

- Do not send raw PII.
- Do not overstate coverage for consent-denied traffic.
- Document GA4 UI versus raw-export differences where relevant.
- Test CMP releases as measurement changes.
