# Analysis Plan

## Unit of analysis

Eligible exposed user or browser-level identity according to implementation.

## Main comparison

Compare each treatment with control on qualified-lead rate.

Treat the two treatment-control comparisons as one confirmatory family. Report
unadjusted estimates and confidence intervals, but use Holm-adjusted p-values
for the frequentist decision rule.

## Validation

- Validate exposure counts.
- Validate Sample Ratio Mismatch.
- Validate CRM match rate by variant.
- Validate no material differences in major pre-exposure segmentation if available.
- Validate that every CRM outcome occurs after actual exposure and inside the
  registered outcome window.
- Validate that assignment, exposure and outcome joins use assignment,
  session, submission and lead keys rather than date-only joins.

## Segments

- Device category
- New versus returning user
- Vehicle model
- Channel/source where available
- Consent coverage where interpretably available

## Interpretation

Report effect size, uncertainty, guardrails and limitations. Avoid causal claims if assignment or exposure integrity fails.
