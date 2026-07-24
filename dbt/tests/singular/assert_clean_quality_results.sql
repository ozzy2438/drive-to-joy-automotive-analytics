select *
from {{ ref('fct_data_quality_results') }}
where status != 'pass'
   or failure_count != 0
