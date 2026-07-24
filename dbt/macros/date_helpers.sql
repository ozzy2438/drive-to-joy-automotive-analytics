{% macro add_days(timestamp_expression, days) %}
  {{ return(adapter.dispatch('add_days', 'drive_to_joy')(
    timestamp_expression,
    days
  )) }}
{% endmacro %}

{% macro duckdb__add_days(timestamp_expression, days) %}
  ({{ timestamp_expression }} + interval '{{ days }} day')
{% endmacro %}

{% macro bigquery__add_days(timestamp_expression, days) %}
  timestamp_add({{ timestamp_expression }}, interval {{ days }} day)
{% endmacro %}

{% macro date_spine(start_date, end_date) %}
  {{ return(adapter.dispatch('date_spine', 'drive_to_joy')(
    start_date,
    end_date
  )) }}
{% endmacro %}

{% macro duckdb__date_spine(start_date, end_date) %}
  select cast(date_day as date) as date_day
  from generate_series(
    cast({{ start_date }} as date),
    cast({{ end_date }} as date),
    interval '1 day'
  ) as dates(date_day)
{% endmacro %}

{% macro bigquery__date_spine(start_date, end_date) %}
  select date_day
  from unnest(generate_date_array(
    date({{ start_date }}),
    date({{ end_date }})
  )) as date_day
{% endmacro %}

{% macro month_name(date_expression) %}
  {{ return(adapter.dispatch('month_name', 'drive_to_joy')(
    date_expression
  )) }}
{% endmacro %}

{% macro duckdb__month_name(date_expression) %}
  strftime({{ date_expression }}, '%B')
{% endmacro %}

{% macro bigquery__month_name(date_expression) %}
  format_date('%B', {{ date_expression }})
{% endmacro %}

{% macro iso_week_number(date_expression) %}
  {{ return(adapter.dispatch('iso_week_number', 'drive_to_joy')(
    date_expression
  )) }}
{% endmacro %}

{% macro duckdb__iso_week_number(date_expression) %}
  cast(strftime({{ date_expression }}, '%V') as integer)
{% endmacro %}

{% macro bigquery__iso_week_number(date_expression) %}
  extract(isoweek from {{ date_expression }})
{% endmacro %}

{% macro iso_day_of_week(date_expression) %}
  {{ return(adapter.dispatch('iso_day_of_week', 'drive_to_joy')(
    date_expression
  )) }}
{% endmacro %}

{% macro duckdb__iso_day_of_week(date_expression) %}
  cast(strftime({{ date_expression }}, '%u') as integer)
{% endmacro %}

{% macro bigquery__iso_day_of_week(date_expression) %}
  mod(extract(dayofweek from {{ date_expression }}) + 5, 7) + 1
{% endmacro %}
