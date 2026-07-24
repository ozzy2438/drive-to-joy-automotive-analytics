# Versioned Synthetic Reference Data

`v1/` is the canonical source for fictional AstraDrive reference registries.
Python generators load these JSON records, committed dbt CSV seeds are checked
against them, and the demo application consumes the same definitions.

Every record carries:

- `schema_version`, which versions its structural contract;
- `record_version`, which versions the stable business identifier;
- `data_origin=synthetic`.

Identifiers are never recycled. A changed business meaning requires a new ID
or an explicit record-version migration. Honda models, dealers, campaigns,
assets and proprietary information are prohibited.
