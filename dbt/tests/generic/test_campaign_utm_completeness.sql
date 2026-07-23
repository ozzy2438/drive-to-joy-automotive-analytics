{% test campaign_utm_completeness(model) %}
select *
from {{ model }}
where channel like 'Paid%'
  and (source is null or medium is null or campaign_id is null)
{% endtest %}
