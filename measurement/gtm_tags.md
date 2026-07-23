# GTM Tags

| Tag | Trigger | Payload | Validation |
|---|---|---|---|
| GA4 Configuration | Consent-aware page load | Base configuration | DebugView and network |
| GA4 Vehicle Model Event | `view_vehicle_model` | Vehicle/page/journey fields | Preview + export |
| GA4 Configurator Event | Configurator custom events | Vehicle/configuration fields | Preview + export |
| GA4 Finance Event | Finance events | Vehicle/repayment context | Preview + export |
| GA4 Dealer Event | Dealer events | Dealer and vehicle fields | Preview + export |
| GA4 Lead Event | Successful form submits | Hash, vehicle, dealer, form fields | Preview + CRM match |
| GA4 Experiment Exposure | Exposure event | Experiment and variant | Variant persistence + export |
| GA4 Personalisation Exposure | Exposure event | Audience/experience/holdout | Holdout validation |

All tags must respect consent configuration and avoid raw PII.
