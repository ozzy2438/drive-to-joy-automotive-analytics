{% test valid_experiment_variant(model) %}
select *
from {{ model }}
where experiment_id is not null
  and variant_id is null
{% endtest %}
