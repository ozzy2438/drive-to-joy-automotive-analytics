# GTM Implementation Plan

## Container design

Use web-container environments for development, staging and production. Publish only reviewed versions linked to a ticket.

## Required variable groups

- Vehicle: model, variant, powertrain, configurator ID
- Dealer: ID, state, type
- Form: type, field, error type, duration
- Campaign: UTM source, medium, campaign
- Experiment: experiment ID, variant ID
- Personalisation: audience ID, experience ID, holdout flag
- Consent: analytics and marketing state
- Identity: approved hashed lead key

## Required tags

- GA4 configuration and event tags
- Consent configuration
- Experiment exposure event tag
- Personalisation exposure event tag
- Optional approved marketing tags only after consent review

## Release controls

1. Ticket and specification exist.
2. GTM Preview evidence exists.
3. GA4 DebugView evidence exists.
4. BigQuery validation occurs after release.
5. Rollback version is identified.
