import { createHash, randomUUID } from "node:crypto";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import canonicalCrmLeadSchema from "../../../../../contracts/schemas/canonical_crm_lead.schema.json";
import webSubmissionSchema from "../../../../../contracts/schemas/web_submission.schema.json";
import { getDealer, getVehicleModels } from "@/lib/reference-data";
import { assertNoRawPii } from "@/lib/tracking";
import {
  crmSubmissionRequestSchema,
  type CanonicalCrmLead,
  type CrmSubmissionRequest,
  type StoredCrmEnvelope,
  type WebSubmission,
} from "./contracts";

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validateSubmission = ajv.compile<WebSubmission>(webSubmissionSchema);
const validateLead = ajv.compile<CanonicalCrmLead>(canonicalCrmLeadSchema);
const vehicleModels = getVehicleModels();

export interface CrmCreationOptions {
  now?: () => Date;
  opaqueId?: () => string;
}

function prefixedId(prefix: string, value: string): string {
  return `${prefix}_${value}`;
}

function deriveLeadHash(internalLeadReference: string): string {
  return `lead_${createHash("sha256")
    .update(`drive-to-joy:opaque-lead:v1|${internalLeadReference}`)
    .digest("hex")}`;
}

function assertReferenceIntegrity(request: CrmSubmissionRequest): void {
  const vehicle = vehicleModels.find(
    (candidate) => candidate.vehicleModel === request.vehicle_model,
  );
  if (!vehicle) {
    throw new Error("CRM submission references an unknown vehicle model");
  }
  if (
    request.vehicle_variant &&
    !vehicle.variants.some(
      (variant) => variant.vehicle_variant === request.vehicle_variant,
    )
  ) {
    throw new Error(
      "CRM submission variant does not belong to the selected vehicle model",
    );
  }

  const dealer = getDealer(request.dealer_id);
  if (!dealer?.active_flag || dealer.availability_state === "inactive") {
    throw new Error("CRM submission references an unavailable dealer");
  }
  if (dealer.state !== request.dealer_state) {
    throw new Error("CRM submission dealer state does not match the registry");
  }
}

function assertContract(
  valid: boolean,
  errors: typeof validateLead.errors,
  contractName: string,
): void {
  if (!valid) {
    const detail =
      errors?.map((error) => error.instancePath || error.keyword).join(", ") ??
      "unknown";
    throw new Error(`${contractName} validation failed at ${detail}`);
  }
}

export function createCrmEnvelope(
  candidate: unknown,
  options: CrmCreationOptions = {},
): StoredCrmEnvelope {
  assertNoRawPii(candidate);
  const request: CrmSubmissionRequest =
    crmSubmissionRequestSchema.parse(candidate);
  assertReferenceIntegrity(request);
  const now = (options.now ?? (() => new Date()))().toISOString();
  const idFactory = options.opaqueId ?? randomUUID;
  const webSubmissionId = prefixedId("sub", idFactory());
  const internalLeadReference = prefixedId("internal", idFactory());
  const leadIdHash = deriveLeadHash(internalLeadReference);

  const submission: WebSubmission = {
    schema_version: "1.1.0",
    form_instance_id: request.form_instance_id,
    web_submission_id: webSubmissionId,
    lead_id_hash: leadIdHash,
    submitted_at: now,
    form_type: request.form_type,
    user_pseudo_id: request.user_pseudo_id,
    session_id: request.session_id,
    vehicle_model: request.vehicle_model,
    dealer_id: request.dealer_id,
    experiment_assignment_id: request.experiment_assignment_id ?? null,
    personalisation_assignment_id:
      request.personalisation_assignment_id ?? null,
    data_origin: "synthetic",
  };
  const lead: CanonicalCrmLead = {
    schema_version: "1.1.0",
    crm_lead_id: prefixedId("crm", idFactory()),
    web_submission_id: webSubmissionId,
    lead_id_hash: leadIdHash,
    web_submit_at: now,
    lead_created_at: now,
    lead_status: "new",
    lead_status_updated_at: now,
    vehicle_model_interest: request.vehicle_model,
    dealer_id: request.dealer_id,
    disqualification_reason: null,
    appointment_booked_at: null,
    appointment_attended_flag: false,
    vehicle_ordered_flag: false,
    order_value_band: null,
    data_origin: "synthetic",
  };

  assertContract(
    validateSubmission(submission),
    validateSubmission.errors,
    "web_submission",
  );
  assertContract(validateLead(lead), validateLead.errors, "canonical_crm_lead");

  return {
    internal_lead_reference: internalLeadReference,
    submission,
    lead,
  };
}

export function sanitiseCrmEnvelope(envelope: StoredCrmEnvelope) {
  return {
    data_origin: "synthetic" as const,
    submission: envelope.submission,
    lead: envelope.lead,
  };
}
