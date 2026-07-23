# GTM Triggers

| Trigger | Event | Conditions |
|---|---|---|
| CE - view_vehicle_model | `view_vehicle_model` | Approved event name only |
| CE - configurator_start | `configurator_start` | Approved event name only |
| CE - configurator_complete | `configurator_complete` | Required model context present |
| CE - finance_calculator_complete | `finance_calculator_complete` | Approved event name only |
| CE - dealer_select | `dealer_select` | Dealer ID present |
| CE - test_drive_submit | `test_drive_submit` | Successful submit and approved consent logic |
| CE - quote_submit | `quote_submit` | Successful submit and approved consent logic |
| CE - form_error | `form_error` | Error type present |
| CE - experiment_exposure | `experiment_exposure` | Experiment and variant IDs present |
| CE - personalisation_exposure | `personalisation_exposure` | Audience and experience IDs present |

Never fire a conversion tag from a button click if the business action has not completed successfully.
