import { z } from "zod";

export const crmSubmissionRequestSchema = z
  .object({
    form_instance_id: z.string().min(8).max(128),
    form_type: z.enum(["test_drive", "quote"]),
    vehicle_model: z.string().min(2).max(120),
    vehicle_variant: z.string().min(2).max(160).nullable().optional(),
    dealer_id: z.string().min(3).max(80),
    dealer_state: z.string().min(2).max(8),
    user_pseudo_id: z.string().min(8).max(128).nullable(),
    session_id: z.string().min(8).max(128).nullable(),
    experiment_assignment_id: z.string().min(8).max(128).nullable().optional(),
    variant_id: z.string().min(2).max(80).nullable().optional(),
    personalisation_assignment_id: z
      .string()
      .min(8)
      .max(128)
      .nullable()
      .optional(),
    audience_id: z.string().min(3).max(80).nullable().optional(),
    experience_id: z.string().min(3).max(80).nullable().optional(),
    holdout_flag: z.boolean().nullable().optional(),
    demo_acknowledgement: z.literal(true),
  })
  .strict();

export type CrmSubmissionRequest = z.infer<typeof crmSubmissionRequestSchema>;

export const CRM_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "disqualified",
  "appointment_booked",
  "attended",
  "ordered",
] as const;

export type CrmStatus = (typeof CRM_STATUSES)[number];

export interface WebSubmission {
  schema_version: "1.1.0";
  form_instance_id: string;
  web_submission_id: string;
  lead_id_hash: string;
  submitted_at: string;
  form_type: "test_drive" | "quote";
  user_pseudo_id: string | null;
  session_id: string | null;
  vehicle_model: string;
  dealer_id: string;
  experiment_assignment_id: string | null;
  personalisation_assignment_id: string | null;
  data_origin: "synthetic";
}

export interface CanonicalCrmLead {
  schema_version: "1.1.0";
  crm_lead_id: string;
  web_submission_id: string;
  lead_id_hash: string;
  web_submit_at: string;
  lead_created_at: string;
  lead_status: CrmStatus;
  lead_status_updated_at: string;
  vehicle_model_interest: string | null;
  dealer_id: string | null;
  disqualification_reason:
    | "duplicate"
    | "invalid"
    | "uncontactable"
    | "out_of_area"
    | "low_intent"
    | "existing_customer"
    | null;
  appointment_booked_at: string | null;
  appointment_attended_flag: boolean;
  vehicle_ordered_flag: boolean;
  order_value_band:
    | "under_40000"
    | "40000_50000"
    | "50000_60000"
    | "60000_70000"
    | "70000_plus"
    | null;
  data_origin: "synthetic";
}

export interface StoredCrmEnvelope {
  internal_lead_reference: string;
  submission: WebSubmission;
  lead: CanonicalCrmLead;
}
