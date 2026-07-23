# Personalisation Strategy

## Core rule

Personalisation creates value only when it produces incremental improvement compared with a valid generic-experience holdout group.

## Priority audiences

| Audience | Eligibility | Proposed experience | Primary metric |
|---|---|---|---|
| Hybrid Researchers | Hybrid model and finance-content views | Hybrid ownership-cost message | Qualified lead rate |
| Configurator Abandoners | Started but did not complete configurator | Resume configuration CTA | Configurator completion |
| Finance-Anxious Visitors | Repeated calculator use and no form submit | Repayment support CTA | Lead progression |
| Returning High-Intent Visitors | Multiple high-intent actions in 7 days | Recently viewed vehicle/dealer CTA | Test-drive booking |
| Regional Dealer Searchers | Regional dealer-search behaviour | Local availability experience | Dealer-selected lead rate |

## Holdout design

```text
Eligible audience
→ Random assignment
→ Personalised experience or generic holdout
→ Exposure logging
→ Outcome measurement
→ Incrementality analysis
```

## Safety rules

- No sensitive targeting.
- No unconsented identity use.
- No individual-level demographic inference.
- Every audience requires explicit eligibility, exclusion and measurement logic.
- Every experience must retain a holdout or generic comparison group.
