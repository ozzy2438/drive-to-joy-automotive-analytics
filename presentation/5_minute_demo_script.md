# Five-Minute Demo Script

## Opening — 30 seconds

Drive to Joy is a fictional, production-style automotive digital analytics and experimentation platform. It is designed to demonstrate how an Analytics Specialist can connect website behaviour to qualified CRM leads, test-drive attendance and vehicle orders.

## Problem — 45 seconds

Automotive teams can often see traffic and form submissions, but that does not tell them whether a channel, model page or CTA generates commercially meaningful demand. This project separates web conversions from CRM-qualified leads and downstream outcomes.

## Measurement and architecture — 75 seconds

The platform starts with a governed dataLayer and GTM/GA4-style event taxonomy. It captures model research, configuration, finance evaluation, dealer selection, forms, experiment exposure, personalisation exposure and consent state. BigQuery-style raw data is transformed with dbt into session, journey, lead, campaign, experiment and quality marts.

## Decision layer — 75 seconds

Dashboards serve different audiences: leadership sees qualified leads and cost efficiency; product sees journey friction; marketing sees channel quality; engineering/analytics sees data health; CRO sees experiment readiness and guardrails.

## Optimisation — 75 seconds

The flagship test compares model-page CTAs: book a test drive, build a vehicle or estimate repayment. It uses pre-registration, sample-size planning, exposure logging, CRM-quality outcomes, SRM checks and guardrails. Personalisation audiences also retain holdouts so incremental value can be measured.

## Close — 40 seconds

The repository includes operating model, runbooks, Jira stories, Confluence templates and limitations. It is synthetic by design, but demonstrates the exact end-to-end thinking required to make digital analytics reliable, customer-centred and commercially useful.
