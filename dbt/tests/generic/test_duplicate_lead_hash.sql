{% test duplicate_lead_hash(model) %}
select lead_id_hash
from {{ model }}
group by 1
having count(*) > 1
{% endtest %}
