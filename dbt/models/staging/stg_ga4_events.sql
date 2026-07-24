{% if var('event_source_adapter', 'synthetic_flat') == 'ga4_bigquery' %}
  select * from {{ ref('stg_ga4_bigquery_events') }}
{% elif var('event_source_adapter', 'synthetic_flat') == 'synthetic_flat' %}
  select * from {{ ref('stg_synthetic_flat_events') }}
{% else %}
  {{ exceptions.raise_compiler_error(
    "event_source_adapter must be 'synthetic_flat' or 'ga4_bigquery'"
  ) }}
{% endif %}
