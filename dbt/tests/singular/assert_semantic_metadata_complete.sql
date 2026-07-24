{% set aggregate_models = [
  'agg_executive_daily',
  'agg_journey_daily',
  'agg_marketing_daily',
  'agg_data_quality_daily',
  'agg_experiment_daily',
  'agg_personalisation_daily'
] %}

{% for model_name in aggregate_models %}
select '{{ model_name }}' as model_name
from {{ ref(model_name) }}
where metric_contract_version is null
   or reporting_timezone != 'Australia/Melbourne'
   or data_origin is null
   or synthetic_watermark is null
   or data_through_at_utc is null
   or evaluated_at_utc is null
   or freshness_status is null
   or quality_status is null
   or limitation_code is null
{% if not loop.last %}
union all
{% endif %}
{% endfor %}
