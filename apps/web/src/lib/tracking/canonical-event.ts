export const CANONICAL_SCHEMA_VERSION = "1.1.0" as const;

export const EVENT_NAMES = [
  "view_homepage",
  "view_vehicle_range",
  "view_vehicle_model",
  "view_vehicle_variant",
  "view_specification",
  "view_offer",
  "compare_vehicle_models",
  "configurator_start",
  "configurator_step_complete",
  "configurator_complete",
  "finance_calculator_start",
  "finance_calculator_complete",
  "dealer_search",
  "dealer_select",
  "test_drive_start",
  "quote_start",
  "form_error",
  "test_drive_submit",
  "quote_submit",
  "consent_update",
  "experiment_exposure",
  "personalisation_exposure",
  "lead_qualified",
  "appointment_attended",
  "vehicle_ordered",
] as const;

export type EventName = (typeof EVENT_NAMES)[number];
export type ConsentValue = "granted" | "denied" | "unknown" | "revoked";
export type JourneyStage =
  | "discover"
  | "research"
  | "configure"
  | "evaluate"
  | "convert"
  | "progress";

export const CANONICAL_CONTEXT_FIELDS = [
  "page_type",
  "journey_stage",
  "device_category",
  "traffic_source",
  "traffic_medium",
  "campaign_id",
  "campaign_name",
  "entry_point",
  "comparison_model",
  "specification_section",
  "offer_id",
  "cta_id",
  "vehicle_model",
  "vehicle_variant",
  "powertrain",
  "configurator_id",
  "configurator_step",
  "configurator_value_band",
  "colour_id",
  "option_ids",
  "loan_term_months",
  "repayment_band",
  "dealer_id",
  "dealer_state",
  "search_method",
  "form_type",
  "form_instance_id",
  "web_submission_id",
  "lead_id_hash",
  "form_field",
  "form_error_type",
  "form_completion_time_seconds",
  "form_error_count",
  "experiment_id",
  "experiment_assignment_id",
  "variant_id",
  "audience_id",
  "personalisation_assignment_id",
  "experience_id",
  "holdout_flag",
  "cmp_version",
  "lead_status",
  "order_value_band",
] as const;

export type CanonicalContextField = (typeof CANONICAL_CONTEXT_FIELDS)[number];
export type CanonicalFieldValue = string | number | boolean | null;
export type CanonicalEventFields = Partial<
  Record<CanonicalContextField, CanonicalFieldValue>
>;

export type CanonicalEvent = {
  schema_version: typeof CANONICAL_SCHEMA_VERSION;
  source_system: "synthetic_flat";
  data_origin: "synthetic";
  event_id: string;
  event_date: string;
  event_at: string;
  event_name: EventName;
  user_pseudo_id: string | null;
  session_id: string | null;
  consent_analytics: ConsentValue;
  consent_marketing: ConsentValue;
} & Record<CanonicalContextField, CanonicalFieldValue>;

export interface ConsentState {
  analytics: ConsentValue;
  marketing: ConsentValue;
  cmpVersion: string;
  updatedAt?: string;
}

export interface TrackingIdentity {
  userPseudoId: string | null;
  sessionId: string | null;
}

export interface EventBuildContext {
  consent: ConsentState;
  identity: TrackingIdentity;
  pageType?: string | null;
  journeyStage?: JourneyStage | null;
  deviceCategory?: "mobile" | "desktop" | "tablet" | null;
}
