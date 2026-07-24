{{ config(enabled=var('event_source_adapter', 'synthetic_flat') == 'ga4_bigquery') }}

with source as (
  select * from {{ source('raw_ga4', 'events') }}
),

renamed as (
  select
    '1.1.0' as schema_version,
    'ga4_bigquery' as source_system,
    cast('{{ var("data_origin", "live_demo") }}' as string) as data_origin,
    coalesce(
      {{ get_event_param('event_id') }},
      to_hex(sha256(concat(
        coalesce(user_pseudo_id, ''),
        cast(event_timestamp as string),
        event_name
      )))
    ) as event_id,
    parse_date('%Y%m%d', cast(event_date as string)) as event_date,
    timestamp_micros(event_timestamp) as event_at,
    event_name,
    user_pseudo_id,
    cast(
      (
        select value.int_value
        from unnest(event_params)
        where key = 'ga_session_id'
      ) as string
    ) as session_id,
    {{ get_event_param('page_type') }} as page_type,
    {{ get_event_param('journey_stage') }} as journey_stage,
    device.category as device_category,
    traffic_source.source as traffic_source,
    traffic_source.medium as traffic_medium,
    {{ get_event_param('campaign_id') }} as campaign_id,
    coalesce(
      {{ get_event_param('campaign_name') }},
      traffic_source.name
    ) as campaign_name,
    {{ get_event_param('entry_point') }} as entry_point,
    {{ get_event_param('comparison_model') }} as comparison_model,
    {{ get_event_param('specification_section') }} as specification_section,
    {{ get_event_param('offer_id') }} as offer_id,
    {{ get_event_param('cta_id') }} as cta_id,
    {{ get_event_param('vehicle_model') }} as vehicle_model,
    {{ get_event_param('vehicle_variant') }} as vehicle_variant,
    {{ get_event_param('powertrain') }} as powertrain,
    {{ get_event_param('configurator_id') }} as configurator_id,
    {{ get_event_param('configurator_step') }} as configurator_step,
    {{ get_event_param('configurator_value_band') }} as configurator_value_band,
    {{ get_event_param('colour_id') }} as colour_id,
    {{ get_event_param('option_ids') }} as option_ids,
    safe_cast({{ get_event_param('loan_term_months') }} as int64) as loan_term_months,
    {{ get_event_param('repayment_band') }} as repayment_band,
    {{ get_event_param('dealer_id') }} as dealer_id,
    {{ get_event_param('dealer_state') }} as dealer_state,
    {{ get_event_param('search_method') }} as search_method,
    {{ get_event_param('form_type') }} as form_type,
    {{ get_event_param('form_instance_id') }} as form_instance_id,
    {{ get_event_param('web_submission_id') }} as web_submission_id,
    {{ get_event_param('lead_id_hash') }} as lead_id_hash,
    {{ get_event_param('form_field') }} as form_field,
    {{ get_event_param('form_error_type') }} as form_error_type,
    safe_cast(
      {{ get_event_param('form_completion_time_seconds') }} as float64
    ) as form_completion_time_seconds,
    safe_cast({{ get_event_param('form_error_count') }} as int64) as form_error_count,
    {{ get_event_param('experiment_id') }} as experiment_id,
    {{ get_event_param('experiment_assignment_id') }} as experiment_assignment_id,
    {{ get_event_param('variant_id') }} as variant_id,
    {{ get_event_param('audience_id') }} as audience_id,
    {{ get_event_param('personalisation_assignment_id') }} as personalisation_assignment_id,
    {{ get_event_param('experience_id') }} as experience_id,
    safe_cast({{ get_event_param('holdout_flag') }} as bool) as holdout_flag,
    {{ get_event_param('consent_analytics') }} as consent_analytics,
    {{ get_event_param('consent_marketing') }} as consent_marketing,
    {{ get_event_param('cmp_version') }} as cmp_version,
    {{ get_event_param('lead_status') }} as lead_status,
    {{ get_event_param('order_value_band') }} as order_value_band
  from source
)

select * from renamed
