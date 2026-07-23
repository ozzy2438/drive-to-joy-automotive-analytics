# Detailed Event Taxonomy

Refer to `measurement/event_catalogue.md` for the concise catalogue. This document defines governance requirements.

## Event design rules

1. Events must represent customer or business actions, not implementation details.
2. Names are stable lower-snake-case verbs and objects.
3. Required parameters are defined before deployment.
4. A single successful form submit fires exactly once.
5. Error events are separate from success events.
6. Experiment exposure must be captured before downstream outcomes.
7. Personalisation exposure must include audience, experience and holdout context.
8. CRM events originate from warehouse/CRM integration, not browser emulation.

## Mandatory context groups

- Page context
- Vehicle context
- Dealer context
- Form context
- Campaign context
- Consent context
- Experiment context where active
- Personalisation context where active
- Privacy-safe identity context where relevant
