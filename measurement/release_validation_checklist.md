# Release Validation Checklist

## Before publish

- [ ] Ticket references correct specification.
- [ ] Event names and parameters match catalogue.
- [ ] GTM Preview shows expected trigger and variables.
- [ ] Consent states tested.
- [ ] No raw PII visible in payload.
- [ ] Rollback version identified.

## After publish

- [ ] GA4 DebugView receives event.
- [ ] Raw export receives event within expected delay.
- [ ] Parameter completeness is above threshold.
- [ ] Event volume is plausible.
- [ ] CRM match works for test lead where relevant.
- [ ] Dashboard metric aligns with mart output.
- [ ] Monitoring remains green.
