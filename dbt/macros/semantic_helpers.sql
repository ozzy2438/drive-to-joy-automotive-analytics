{% macro business_date(timestamp_expression) %}
  {{ return(adapter.dispatch('business_date', 'drive_to_joy')(
    timestamp_expression
  )) }}
{% endmacro %}

{% macro duckdb__business_date(timestamp_expression) %}
  cast(
    (
      ({{ timestamp_expression }} at time zone 'UTC')
      at time zone 'Australia/Melbourne'
    )
    as date
  )
{% endmacro %}

{% macro bigquery__business_date(timestamp_expression) %}
  date({{ timestamp_expression }}, 'Australia/Melbourne')
{% endmacro %}

{% macro semantic_evaluated_at() %}
  {{ return(adapter.dispatch('semantic_evaluated_at', 'drive_to_joy')()) }}
{% endmacro %}

{% macro duckdb__semantic_evaluated_at() %}
  cast(
    '{{ var("semantic_evaluated_at_utc", "2026-10-01T00:00:00+00:00") }}'
    as timestamp
  )
{% endmacro %}

{% macro bigquery__semantic_evaluated_at() %}
  timestamp(
    '{{ var("semantic_evaluated_at_utc", "2026-10-01T00:00:00+00:00") }}'
  )
{% endmacro %}

{% macro freshness_status(data_through_expression, evaluated_expression) %}
  {{ return(adapter.dispatch('freshness_status', 'drive_to_joy')(
    data_through_expression,
    evaluated_expression
  )) }}
{% endmacro %}

{% macro duckdb__freshness_status(
  data_through_expression,
  evaluated_expression
) %}
  case
    when {{ data_through_expression }} is null then 'unknown'
    when {{ data_through_expression }}
      > {{ evaluated_expression }} + interval '1 day'
      then 'unknown'
    when {{ data_through_expression }}
      < {{ evaluated_expression }} - interval '48 hour'
      then 'stale'
    else 'pass'
  end
{% endmacro %}

{% macro bigquery__freshness_status(
  data_through_expression,
  evaluated_expression
) %}
  case
    when {{ data_through_expression }} is null then 'unknown'
    when {{ data_through_expression }}
      > timestamp_add({{ evaluated_expression }}, interval 1 day)
      then 'unknown'
    when {{ data_through_expression }}
      < timestamp_sub({{ evaluated_expression }}, interval 48 hour)
      then 'stale'
    else 'pass'
  end
{% endmacro %}
