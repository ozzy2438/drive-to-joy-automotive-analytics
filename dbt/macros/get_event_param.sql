{% macro get_event_param(param_name) %}
  (
    select coalesce(value.string_value, cast(value.int_value as string), cast(value.double_value as string))
    from unnest(event_params)
    where key = '{{ param_name }}'
  )
{% endmacro %}
