# Web Demo Requirements

## Implementation

The Sprint 3 local implementation lives in `apps/web`. Start with
[implementation status](./implementation_status.md) and
[local development](./local_development.md).

## Purpose

The demo site is a fictional automotive website used to generate real, consent-aware, GA4-style events and exercise the measurement contract.

## Required pages

- Homepage
- Vehicle range
- Vehicle model page
- Configurator
- Finance calculator
- Dealer locator
- Test-drive form
- Quote form
- Thank-you page
- Privacy and consent page

## Required instrumentation

- Structured dataLayer events
- Vehicle context
- Dealer context
- Form and error context
- Campaign context
- Experiment exposure
- Personalisation exposure
- Consent state
- Lead hash derived from an opaque server-side synthetic reference

## Safety requirements

- Brand must be fictional.
- Do not imitate Honda branding closely enough to imply affiliation.
- Do not transmit raw PII to analytics.
- Test forms should use synthetic/demo data only.
