# Consent Behaviour

## State classes

Consent and identity use separate first-party storage:

- `dtj_consent_v1` remembers only the consent decision and policy version.
- `dtj_journey_v1` carries functional non-personal vehicle, dealer and
  configurator context in the current session.
- Browser, session, assignment, audience, cooldown and de-duplication state is
  created only after analytics consent is granted.

## State matrix

| Analytics state | Business events | Analytics identity | Decisioning | Experience |
|---|---|---|---|---|
| `unknown` | Blocked | Not created | Off | Generic |
| `denied` | Blocked | Not created | Off | Generic |
| `granted` | Validated and collected | Opaque IDs | Eligible | Assigned |
| `revoked` | Blocked | Cleared | Cleared | Generic |

`consent_update` is the only event allowed without analytics consent. In that
case it has null user and session IDs.

## Revocation

Revocation clears:

- anonymous browser and session IDs;
- experiment and personalisation assignments;
- behavioural audience state;
- exposure de-duplication keys;
- cooldown timestamps.

The consent preference itself remains so the denied or revoked decision can be
honoured on the next page.

## Measurement consequence

Experiment and personalisation eligibility begins only for consent-granted
browsers. Reports must describe that observable population boundary and must
not extrapolate demo behaviour to non-consenting users.
