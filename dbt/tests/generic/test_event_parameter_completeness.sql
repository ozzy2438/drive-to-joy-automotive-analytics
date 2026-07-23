{% test event_parameter_completeness(model, event_name, parameter) %}
select *
from {{ model }}
where event_name = '{{ event_name }}'
  and {{ parameter }} is null
{% endtest %}
