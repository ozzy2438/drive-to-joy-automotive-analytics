# dataLayer Specification

## Contract purpose

The application sends stable business context to GTM through `window.dataLayer`. GTM maps approved values to analytics destinations; it should not reconstruct critical commercial context from fragile DOM selectors.

## Example

```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'test_drive_submit',
  event_id: 'uuid',
  page_context: {
    page_type: 'test_drive_form',
    journey_stage: 'convert'
  },
  vehicle_context: {
    vehicle_model: 'Aurora SUV',
    vehicle_variant: 'Aurora Hybrid Touring',
    powertrain: 'hybrid',
    configurator_id: 'cfg_123'
  },
  dealer_context: {
    dealer_id: 'NSW-014',
    dealer_state: 'NSW'
  },
  form_context: {
    form_type: 'test_drive',
    form_completion_time_seconds: 78,
    form_error_count: 1
  },
  experimentation_context: {
    experiment_id: 'EXP-CTA-001',
    variant_id: 'treatment_a'
  },
  identity_context: {
    lead_id_hash: 'sha256-placeholder'
  }
});
```

## Rules

- The website owns value creation.
- GTM owns mapping and transport.
- No raw PII may enter the dataLayer payload intended for analytics.
- Every new parameter needs a documented tracking request.
- Every deprecation needs migration and QA.
