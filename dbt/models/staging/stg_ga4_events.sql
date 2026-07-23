with source as (
  select * from {{ source('raw_ga4', 'events') }}
),

renamed as (
  select
    parse_date('%Y%m%d', cast(event_date as string)) as event_date,
    timestamp_micros(event_timestamp) as event_at,
    event_name,
    user_pseudo_id,
    cast((select value.int_value from unnest(event_params) where key = 'ga_session_id') as string) as ga_session_id,
    {{ get_event_param('page_type') }} as page_type,
    {{ get_event_param('journey_stage') }} as journey_stage,
    {{ get_event_param('vehicle_model') }} as vehicle_model,
    {{ get_event_param('vehicle_variant') }} as vehicle_variant,
    {{ get_event_param('powertrain') }} as powertrain,
    {{ get_event_param('dealer_id') }} as dealer_id,
    {{ get_event_param('dealer_state') }} as dealer_state,
    {{ get_event_param('form_type') }} as form_type,
    {{ get_event_param('form_error_type') }} as form_error_type,
    {{ get_event_param('experiment_id') }} as experiment_id,
    {{ get_event_param('variant_id') }} as variant_id,
    {{ get_event_param('audience_id') }} as audience_id,
    {{ get_event_param('experience_id') }} as experience_id,
    {{ get_event_param('holdout_flag') }} as holdout_flag,
    {{ get_event_param('lead_id_hash') }} as lead_id_hash,
    {{ get_event_param('consent_analytics') }} as consent_analytics
  from source
)

select * from renamed
