# Web Demo Product Requirements

## Product name

AstraDrive Australia — fictional automotive research and lead-generation website.

## Goal

Provide a realistic but safe environment for measuring the journey from vehicle discovery to test-drive/quote request and for running controlled CTA, form and personalisation experiments.

## Functional scope

- Explore vehicle range
- View model and variant details
- Compare models
- Configure a vehicle
- Estimate repayments
- Find/select dealer
- Submit test-drive request
- Submit quote request
- Manage consent
- Receive fictional confirmation

## Non-functional scope

- Mobile-first
- Accessible
- Fast loading
- Privacy-safe
- Instrumented through approved dataLayer contract
- Supports stable experiment assignment and personalisation holdout

## Acceptance criteria

- Every key journey action emits approved event context.
- No raw PII is sent to analytics payloads.
- Forms create a synthetic lead reference.
- Test/demo mode is visibly stated.
- Website does not imply Honda affiliation.
