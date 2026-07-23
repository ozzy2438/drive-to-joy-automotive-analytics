# UTM Governance

## Required fields for paid traffic

- `utm_source`
- `utm_medium`
- `utm_campaign`

Recommended additional fields:

- `utm_content`
- `utm_term`
- `campaign_id`
- `creative_id`
- `landing_page_id`

## Naming convention

```text
{market}_{channel}_{objective}_{vehicle_or_audience}_{initiative}_{yyyy_mm}
```

Example:

```text
au_search_lead_aurora_hybrid_launch_2026_07
```

## Rules

- Lowercase only.
- Underscores only.
- No spaces.
- Campaign owner and landing page recorded in governance table.
- Paid traffic missing mandatory values is flagged.
- Changes to naming conventions require documentation.
