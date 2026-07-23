# Experiment Incident Runbook

## Trigger

SRM, wrong variant rendering, missing exposure, collision, broken conversion tracking or guardrail issue.

## Actions

1. Pause new allocation if needed.
2. Preserve existing logs.
3. Verify assignment and exposure order.
4. Check control/treatment rendering.
5. Check conversion and CRM matching.
6. Invalidate experiment if integrity cannot be restored.
7. Document decision; never salvage invalid results.
