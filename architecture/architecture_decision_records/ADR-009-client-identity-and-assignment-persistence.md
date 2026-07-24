# ADR-009 — Client Identity and Assignment Persistence

## Context

The demo must show stable anonymous journey, experiment and personalisation
behaviour while respecting consent. It must also preserve functional vehicle,
dealer and configurator context through a browser journey. These needs do not
justify collecting or deriving identity from personal information.

Assignment and exposure have different meanings: an assignment is a decision;
an exposure exists only after the assigned experience is actually rendered.
React development rendering and navigation retries must not create duplicate
exposures.

## Decision

Use three explicitly separated first-party state classes:

1. `dtj_consent_v1` in local storage records only analytics and marketing
   consent choices plus the consent-policy version. It is necessary to honour
   the user's choice and contains no analytics identifier.
2. `dtj_journey_v1` in session storage carries functional, non-personal
   vehicle, dealer and configurator context. It is available even when
   analytics consent is denied, but is never emitted while tracking is
   blocked.
3. Analytics identity and decision keys are created only after analytics
   consent is granted. An opaque random browser ID and deterministic
   assignment records use local storage; an opaque session ID and exposure
   de-duplication keys use session storage.

Revoking analytics consent removes the browser ID, session ID, experiment and
personalisation assignments, cooldown timestamps, behavioural audience state
and exposure de-duplication keys. It does not remove the consent record itself.

`EXP-CTA-001` assigns deterministically from the opaque browser ID. Each
personalisation audience assigns independently from the browser ID and
audience ID. Assignment IDs are derived from these opaque, non-PII keys.
Exposure events are emitted in a post-render effect and are de-duplicated by
assignment, experience or variant, route and session.

When analytics consent is unknown, denied or revoked:

- no analytics browser/session identity is created;
- no experiment or personalisation assignment is made;
- the generic experience renders;
- business events are not sent to `dataLayer` or the local collector;
- `consent_update` may be sent as a cookieless event with null user and session
  identifiers so the state transition itself is auditable.

## Alternatives

- **Always-on local identifiers:** simpler assignment, but violates the chosen
  consent boundary.
- **First-party cookies:** viable, but unnecessary for a local single-browser
  demonstration and adds server/client synchronisation.
- **Server-issued identity:** closer to some production systems, but adds
  endpoint and storage complexity before consent.
- **Random assignment on every render:** invalid because it causes
  re-randomisation and exposure duplication.

## Consequences

- Consent-denied users always see generic content and cannot enter experiment
  or personalisation analysis.
- Consent selection creates an explicit eligibility boundary that reports must
  document.
- Browser storage inspection can demonstrate each identity lifecycle.
- Clearing site data starts a new browser assignment, as expected for an
  anonymous local demo.
- Cross-device or authenticated identity is intentionally unsupported.

## Privacy implications

- Stored identifiers are opaque and never derived from name, email, phone,
  address, postcode or another personal value.
- No raw form value is written to storage, URLs, analytics payloads or logs.
- Pseudonymous identifiers are still treated as sensitive and excluded from
  public screenshots and unrestricted documentation.
- Marketing consent is recorded for demonstration but does not trigger any
  outbound marketing integration.

## Rollback

Disable experiment and personalisation feature flags, clear all `dtj_*`
analytics keys and render generic experiences. Functional session context and
the consent preference can remain. A storage-key version change forces a clean
client migration if semantics later change.

## Status

Accepted for Sprint 3.
