# Identity and Outcome Contract

## Web form lifecycle

1. A rendered form receives a `form_instance_id`.
2. Form start and error events carry the same `form_instance_id`.
3. A successful server-side acceptance creates one `web_submission_id`.
4. The accepted submission receives a `lead_id_hash` derived from its opaque
   generated reference.
5. The CRM source preserves `web_submission_id` and `lead_id_hash`.
6. Qualification, attendance and order outcomes remain CRM outcomes.

Form submit and qualified lead are never interchangeable metrics.

## Experiment outcome bridge

An experiment assignment contains a stable assignment key and planned variant.
An exposure is valid only after the assigned experience is actually rendered.
Downstream web and CRM outcomes require:

- matching experiment assignment and assignment-key/user context;
- an outcome timestamp after exposure;
- an outcome timestamp inside the registered outcome window;
- retained exposure and conversion session IDs for same-session versus
  cross-session analysis;
- a valid web submission and CRM match for qualified-lead analysis.

## Personalisation outcome bridge

Personalisation uses its own assignment ID. Every eligible audience includes a
generic holdout. Incrementality analysis compares exposed treatment and
holdout assignments over the same outcome window. Outcomes join on both the
personalisation assignment ID and its assignment-key/user context.

## Join grains

- Exposure to web outcome: assignment ID plus assignment key/user, with both
  exposure and conversion session IDs retained.
- Web outcome to CRM outcome: `web_submission_id` plus `lead_id_hash`.
- Same-session analysis: the exposure and conversion `session_id` values must
  also match.
- Cross-session analysis: session equality is not required, but the assignment
  and user keys plus the registered time window remain mandatory.

## Prohibited joins

- Date-only exposure-to-lead joins
- Variant-only joins
- Unbounded post-exposure joins
- Hashed email or phone matching in analytics
- Treating CTA clicks or form submits as CRM-qualified leads
