# Web Demo Local Development

## Prerequisites

- Node.js 20.9 or newer. CI uses Node.js 24.
- npm.
- Chromium installed through Playwright for browser tests.

## Install and run

```bash
cd apps/web
cp .env.example .env.local
npm ci
npm run dev
```

Open `http://localhost:3000`. The application requires no BigQuery, GTM, GA4,
GCP or Salesforce credential.

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
DTJ_LOCAL_DATA_DIR=.local-data/e2e npm run quality:local
```

The Playwright server uses port `3113` to avoid common development-port
collisions.

## Local data

- Browser events: `apps/web/.local-data/events.ndjson`
- CRM envelopes: `apps/web/.local-data/crm-records.ndjson`
- Playwright evidence: `apps/web/.local-data/e2e/`

All paths are ignored by Git. Set `DTJ_LOCAL_DATA_DIR` to use a different
directory. Move or delete the directory to reset local evidence.

Set `ENABLE_LOCAL_DEMO_EXPORT=true` outside production to enable:

- `GET /api/events/export`
- `GET /api/crm/export`

## Safety

Do not enter real personal data. The form deliberately contains no contact,
address, postcode or person-linked financial input. Do not commit local data,
screenshots containing pseudonymous identifiers or environment files.
