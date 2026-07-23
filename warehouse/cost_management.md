# Cost Management

- Require partition filters.
- Avoid `SELECT *` in reporting models.
- Use incremental models for large append-only sources.
- Materialise expensive repeated joins.
- Limit dashboard queries to marts.
- Review scheduled-query bytes scanned.
- Keep exploratory sandbox usage separate.
- Document estimated cost for new recurring workloads.
