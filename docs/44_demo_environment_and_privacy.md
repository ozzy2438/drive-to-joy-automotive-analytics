# Demo Environment and Privacy

## Environment statement

AstraDrive is a fictional portfolio demonstration. It is not a real vehicle
sales website and is not affiliated with a real automotive brand or dealer
network.

The local environment uses only synthetic reference data and runtime records.
It requires no production cloud account, analytics credential or CRM tenant.

## Prohibited data

The application, tests and local collectors must not store or transmit:

- names or contact details;
- physical addresses or postcodes;
- raw financial values tied to a person;
- proprietary automotive-brand data;
- real campaign results or performance claims.

The form deliberately has no contact or address input. Test fixtures use
visibly synthetic example identifiers.

## Identifier policy

- Browser and session IDs are opaque and consent-gated.
- Form instance IDs exist before submission.
- Submission IDs exist only after server acceptance.
- Lead hashes derive from a random opaque server reference, never contact data.
- Assignment IDs remain separate for experiments and personalisation.

All pseudonymous IDs are still sensitive and should be omitted from public
screenshots and unrestricted extracts.

## Local boundaries

NDJSON files are ignored by Git and use local filesystem permissions. Export
routes are disabled in production and require an explicit local environment
flag. The emulator has no public admin interface or lifecycle mutation route.

## Production gap

The demo does not provide authentication, encryption-at-rest management,
multi-process write coordination, retention automation, data-subject workflows
or production consent-management integration. Those controls are required
before adapting the design to real people or systems.
