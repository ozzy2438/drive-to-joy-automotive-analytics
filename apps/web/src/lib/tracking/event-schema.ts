import type { ErrorObject } from "ajv";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import canonicalEventSchema from "../../../../../contracts/schemas/canonical_event.schema.json";
import {
  EVENT_NAMES,
  type CanonicalEvent,
  type EventName,
} from "./canonical-event";

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validateSchema = ajv.compile<CanonicalEvent>(canonicalEventSchema);
const eventAllowlist = new Set<string>(EVENT_NAMES);

const EVENT_REQUIRED_FIELDS: Partial<Record<EventName, string[]>> = {
  view_vehicle_model: ["vehicle_model", "journey_stage"],
  view_vehicle_variant: ["vehicle_model", "vehicle_variant"],
  view_specification: ["vehicle_model", "specification_section"],
  view_offer: ["vehicle_model", "offer_id"],
  compare_vehicle_models: ["vehicle_model", "comparison_model"],
  configurator_start: ["vehicle_model", "configurator_id", "entry_point"],
  configurator_step_complete: [
    "vehicle_model",
    "configurator_id",
    "configurator_step",
  ],
  configurator_complete: [
    "vehicle_model",
    "vehicle_variant",
    "configurator_id",
    "configurator_value_band",
  ],
  finance_calculator_start: ["vehicle_model", "entry_point"],
  finance_calculator_complete: [
    "vehicle_model",
    "loan_term_months",
    "repayment_band",
  ],
  dealer_search: ["search_method", "dealer_state"],
  dealer_select: ["dealer_id", "dealer_state", "vehicle_model"],
  test_drive_start: [
    "form_instance_id",
    "vehicle_model",
    "dealer_id",
    "form_type",
  ],
  quote_start: [
    "form_instance_id",
    "vehicle_model",
    "dealer_id",
    "form_type",
  ],
  form_error: [
    "form_instance_id",
    "form_type",
    "form_field",
    "form_error_type",
  ],
  test_drive_submit: [
    "form_instance_id",
    "web_submission_id",
    "lead_id_hash",
    "vehicle_model",
    "dealer_id",
    "form_type",
  ],
  quote_submit: [
    "form_instance_id",
    "web_submission_id",
    "lead_id_hash",
    "vehicle_model",
    "dealer_id",
    "form_type",
  ],
  experiment_exposure: [
    "experiment_assignment_id",
    "experiment_id",
    "variant_id",
  ],
  personalisation_exposure: [
    "personalisation_assignment_id",
    "audience_id",
    "experience_id",
    "holdout_flag",
  ],
  lead_qualified: ["lead_id_hash", "lead_status"],
  appointment_attended: ["lead_id_hash", "dealer_id"],
  vehicle_ordered: ["lead_id_hash", "vehicle_model", "order_value_band"],
};

function schemaErrorMessage(errors: ErrorObject[] | null | undefined): string {
  if (!errors?.length) {
    return "unknown schema failure";
  }
  return errors
    .map((error) => `${error.instancePath || "<root>"} ${error.message}`)
    .join("; ");
}

export function assertEventRequirements(event: CanonicalEvent): void {
  if (!eventAllowlist.has(event.event_name)) {
    throw new Error(`Event name is not allowlisted: ${event.event_name}`);
  }
  const required = EVENT_REQUIRED_FIELDS[event.event_name] ?? [];
  const missing = required.filter((field) => {
    const value = event[field as keyof CanonicalEvent];
    return value === null || value === undefined || value === "";
  });
  if (missing.length) {
    throw new Error(
      `${event.event_name} is missing required context: ${missing.join(", ")}`,
    );
  }
}

export function assertCanonicalEvent(
  candidate: unknown,
): asserts candidate is CanonicalEvent {
  if (!validateSchema(candidate)) {
    throw new Error(
      `Canonical event schema validation failed: ${schemaErrorMessage(
        validateSchema.errors,
      )}`,
    );
  }
  assertEventRequirements(candidate);
}

export function isCanonicalEvent(candidate: unknown): candidate is CanonicalEvent {
  try {
    assertCanonicalEvent(candidate);
    return true;
  } catch {
    return false;
  }
}
