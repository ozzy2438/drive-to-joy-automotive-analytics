import type { CanonicalCrmLead, CrmStatus } from "./contracts";

const ALLOWED_TRANSITIONS: Record<CrmStatus, CrmStatus[]> = {
  new: ["contacted", "qualified", "disqualified"],
  contacted: ["qualified", "disqualified"],
  qualified: ["appointment_booked", "disqualified"],
  disqualified: [],
  appointment_booked: ["attended", "disqualified"],
  attended: ["ordered", "disqualified"],
  ordered: [],
};

export function transitionCrmLead(
  lead: CanonicalCrmLead,
  nextStatus: CrmStatus,
  now = new Date(),
  orderValueBand: CanonicalCrmLead["order_value_band"] = null,
): CanonicalCrmLead {
  if (!ALLOWED_TRANSITIONS[lead.lead_status].includes(nextStatus)) {
    throw new Error(
      `Invalid CRM lifecycle transition: ${lead.lead_status} -> ${nextStatus}`,
    );
  }
  const transitionedAt = now.toISOString();
  return {
    ...lead,
    lead_status: nextStatus,
    lead_status_updated_at: transitionedAt,
    appointment_booked_at:
      nextStatus === "appointment_booked"
        ? transitionedAt
        : lead.appointment_booked_at,
    appointment_attended_flag:
      lead.appointment_attended_flag || nextStatus === "attended",
    vehicle_ordered_flag:
      lead.vehicle_ordered_flag || nextStatus === "ordered",
    order_value_band:
      nextStatus === "ordered" ? orderValueBand : lead.order_value_band,
  };
}

export function allowedTransitions(status: CrmStatus): CrmStatus[] {
  return [...ALLOWED_TRANSITIONS[status]];
}
