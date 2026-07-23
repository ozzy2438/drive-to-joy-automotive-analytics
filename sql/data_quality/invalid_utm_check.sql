-- Purpose: identify paid source metadata failures.

select *
from `analytics_marts.dim_campaign`
where channel like 'Paid%'
  and (source is null or medium is null or campaign_id is null);
