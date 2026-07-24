# ADR-008 — Demo Site Technology

## Context

Sprint 3 needs an executable analytics test surface for the fictional
AstraDrive customer journey. The site must exercise canonical tracking,
consent, experiment and personalisation behaviour without becoming a visual
showcase or introducing cloud infrastructure.

The repository already treats versioned JSON Schema and synthetic reference
registries as canonical sources. The web application must consume those
sources rather than create a parallel event or domain model.

## Decision

Build `apps/web` with:

- Next.js App Router and TypeScript;
- React Server Components by default and Client Components only where browser
  state or interaction is required;
- Tailwind CSS for a small accessible presentation layer;
- Zod for form, API and event-specific validation;
- Ajv for the repository's canonical JSON Schema validation;
- Next.js Route Handlers for the local event collector and CRM emulator;
- Vitest and Testing Library for unit and component tests;
- Playwright for browser journey and persistence tests.

The app imports the versioned synthetic reference registries and canonical
event schema from the repository. It has no required third-party runtime,
credential or network dependency. Routes and components exist to prove
analytics behaviour, not to imitate a production vehicle-commerce experience.

## Alternatives

- **Static HTML and vanilla TypeScript:** smaller dependency surface, but weak
  route, server-handler and lifecycle coverage for the required test surface.
- **A separate API service:** clearer deployment boundary, but adds operational
  complexity without improving the local demonstration.
- **A client-only SPA:** simple hosting, but cannot keep CRM identity creation
  and file persistence on the server boundary.
- **A design-system-heavy frontend:** useful for a customer-facing product,
  but outside the analytics capability objective.

## Consequences

- One application can test browser rendering and server-side handoff locally.
- Runtime types and validators must stay aligned with repository contracts.
- Server and Client Component boundaries require deliberate module placement.
- Local filesystem persistence is suitable only for a single-process demo.
- Accessibility and responsive basics remain required, while visual polish is
  intentionally constrained.

## Privacy implications

- No analytics, CRM or application module may log or persist raw PII.
- The forms intentionally collect no name, email, phone, address, postcode or
  person-linked financial value.
- All local records are synthetic, labelled and stored under an ignored
  `.local-data` directory.
- No third-party script, pixel, font or analytics endpoint is required.

## Rollback

Remove `apps/web` and its CI jobs. The canonical contracts, synthetic
registries and warehouse foundation remain independently usable. A later
client can consume the same contracts without migrating stored production
data because this application is local-only.

## Status

Accepted for Sprint 3.
