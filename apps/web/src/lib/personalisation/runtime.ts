import audienceRegistry from "../../../../../data/reference/v1/personalisation_audience_registry.json";
import type { ConsentState } from "@/lib/tracking";
import { bucketFromHex, sha256Hex } from "@/lib/decisioning/hash";

export interface AudienceDefinition {
  audience_id: string;
  runtime_enabled: boolean;
  eligibility_version: string;
  holdout_allocation: number;
  cooldown_hours: number;
  priority: number;
  treatment_experience_id: string;
  holdout_experience_id: string;
  collision_namespace: string;
}

export interface AudienceSignals {
  currentPowertrain?: string;
  configuratorStarted?: boolean;
  configuratorCompleted?: boolean;
  financeCompletionCount?: number;
  visitCount?: number;
  highIntentActionCount?: number;
  selectedDealerRegionType?: "metro" | "regional";
}

export interface PersonalisationAssignment {
  schema_version: "1.1.0";
  personalisation_assignment_id: string;
  audience_id: string;
  assignment_key: string;
  experience_id: string;
  holdout_flag: boolean;
  collision_namespace: string;
  eligibility_version: string;
  assigned_at: string;
}

const IMPLEMENTED_AUDIENCES = new Set([
  "AUD-HYB-001",
  "AUD-CFG-002",
  "AUD-FIN-003",
  "AUD-RET-004",
  "AUD-REG-005",
]);

const audiences = (audienceRegistry as AudienceDefinition[])
  .filter(
    (audience) =>
      IMPLEMENTED_AUDIENCES.has(audience.audience_id) &&
      audience.runtime_enabled,
  )
  .sort((left, right) => right.priority - left.priority);

function isEligible(audienceId: string, signals: AudienceSignals): boolean {
  switch (audienceId) {
    case "AUD-HYB-001":
      return signals.currentPowertrain === "hybrid";
    case "AUD-CFG-002":
      return (
        signals.configuratorStarted === true &&
        signals.configuratorCompleted !== true
      );
    case "AUD-FIN-003":
      return (signals.financeCompletionCount ?? 0) >= 2;
    case "AUD-RET-004":
      return (
        (signals.visitCount ?? 0) >= 2 &&
        (signals.highIntentActionCount ?? 0) >= 2
      );
    case "AUD-REG-005":
      return signals.selectedDealerRegionType === "regional";
    default:
      return false;
  }
}

function assignmentKey(audienceId: string): string {
  return `dtj_pers_v1:${audienceId}`;
}

function cooldownKey(audienceId: string): string {
  return `dtj_cooldown_v1:${audienceId}`;
}

function isInCooldown(
  audience: AudienceDefinition,
  storage: Pick<Storage, "getItem">,
  now: Date,
): boolean {
  const value = storage.getItem(cooldownKey(audience.audience_id));
  if (!value) {
    return false;
  }
  const exposedAt = new Date(value);
  const cooldownEnds =
    exposedAt.getTime() + audience.cooldown_hours * 60 * 60 * 1000;
  return Number.isFinite(exposedAt.getTime()) && now.getTime() < cooldownEnds;
}

export function selectPrimaryAudience(
  signals: AudienceSignals,
  reservedCollisionNamespaces: ReadonlySet<string> = new Set(),
  storage: Pick<Storage, "getItem"> | null = null,
  now = new Date(),
): AudienceDefinition | null {
  const target =
    storage ?? (typeof window === "undefined" ? null : window.localStorage);
  return (
    audiences.find(
      (audience) =>
        isEligible(audience.audience_id, signals) &&
        !reservedCollisionNamespaces.has(audience.collision_namespace) &&
        (!target || !isInCooldown(audience, target, now)),
    ) ?? null
  );
}

export async function assignPersonalisation(
  browserId: string,
  audience: AudienceDefinition,
  now = new Date(),
): Promise<PersonalisationAssignment> {
  const digest = await sha256Hex(`${audience.audience_id}|${browserId}`);
  const holdout = bucketFromHex(digest) < audience.holdout_allocation;
  return {
    schema_version: "1.1.0",
    personalisation_assignment_id: `psa_${digest.slice(8, 32)}`,
    audience_id: audience.audience_id,
    assignment_key: browserId,
    experience_id: holdout
      ? audience.holdout_experience_id
      : audience.treatment_experience_id,
    holdout_flag: holdout,
    collision_namespace: audience.collision_namespace,
    eligibility_version: audience.eligibility_version,
    assigned_at: now.toISOString(),
  };
}

export async function getPersonalisationAssignment(
  browserId: string | null,
  consent: ConsentState,
  signals: AudienceSignals,
  reservedCollisionNamespaces: ReadonlySet<string> = new Set(),
  storage: Pick<Storage, "getItem" | "setItem"> | null = null,
  now = new Date(),
): Promise<PersonalisationAssignment | null> {
  if (!browserId || consent.analytics !== "granted") {
    return null;
  }
  const target =
    storage ?? (typeof window === "undefined" ? null : window.localStorage);
  if (!target) {
    return null;
  }
  const audience = selectPrimaryAudience(
    signals,
    reservedCollisionNamespaces,
    target,
    now,
  );
  if (!audience) {
    return null;
  }
  const key = assignmentKey(audience.audience_id);
  const existing = target.getItem(key);
  if (existing) {
    const candidate = JSON.parse(existing) as PersonalisationAssignment;
    if (
      candidate.audience_id === audience.audience_id &&
      candidate.assignment_key === browserId
    ) {
      return candidate;
    }
  }
  const assignment = await assignPersonalisation(browserId, audience, now);
  target.setItem(key, JSON.stringify(assignment));
  return assignment;
}

export function markPersonalisationExposure(
  assignment: PersonalisationAssignment,
  storage: Pick<Storage, "setItem"> | null = null,
  now = new Date(),
): void {
  const target =
    storage ?? (typeof window === "undefined" ? null : window.localStorage);
  target?.setItem(cooldownKey(assignment.audience_id), now.toISOString());
  target?.setItem("dtj_pers_active_v1", JSON.stringify(assignment));
}

export function readActivePersonalisationAssignment(
  storage: Pick<Storage, "length" | "key" | "getItem"> | null = null,
): PersonalisationAssignment | null {
  const target =
    storage ?? (typeof window === "undefined" ? null : window.localStorage);
  if (!target) {
    return null;
  }
  const active = target.getItem("dtj_pers_active_v1");
  if (active) {
    return JSON.parse(active) as PersonalisationAssignment;
  }
  for (let index = 0; index < target.length; index += 1) {
    const key = target.key(index);
    if (!key?.startsWith("dtj_pers_v1:")) {
      continue;
    }
    const value = target.getItem(key);
    if (value) {
      return JSON.parse(value) as PersonalisationAssignment;
    }
  }
  return null;
}

export function getImplementedAudiences(): AudienceDefinition[] {
  return [...audiences];
}
