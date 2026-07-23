-- Purpose: data-quality dashboard extract.

select *
from `analytics_marts.fct_data_quality_results`
order by check_date desc, check_name;
