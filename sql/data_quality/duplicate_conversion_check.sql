-- Purpose: identify duplicate lead submissions.

select lead_id_hash, count(*) as records
from `analytics_marts.fct_lead_funnel`
group by 1
having count(*) > 1;
