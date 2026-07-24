select *
from {{ source('raw_quality', 'canonical_events_controlled_defects') }}
