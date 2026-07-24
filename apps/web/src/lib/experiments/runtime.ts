import experimentRegistry from "../../../../../data/reference/v1/experiment_registry.json";
import type { ConsentState } from "@/lib/tracking";
import { bucketFromHex, sha256Hex } from "@/lib/decisioning/hash";

export interface ExperimentDefinition {
  experiment_id: string;
  collision_namespace: string;
  status: string;
  runtime_enabled: boolean;
  allocation_unit: "browser";
  variant_ids: string;
  allocation: string;
  feature_flag: string;
}

export interface ExperimentAssignment {
  schema_version: "1.1.0";
  experiment_assignment_id: string;
  experiment_id: string;
  assignment_key: string;
  variant_id: string;
  collision_namespace: string;
  assigned_at: string;
}

const CTA_EXPERIMENT = (
  experimentRegistry as ExperimentDefinition[]
).find((experiment) => experiment.experiment_id === "EXP-CTA-001");

function parseAllocation(definition: ExperimentDefinition) {
  const allocations = Object.fromEntries(
    definition.allocation.split(";").map((entry) => {
      const [variantId, proportion] = entry.split(":");
      return [variantId, Number(proportion)];
    }),
  );
  return definition.variant_ids.split(";").map((variantId) => ({
    variantId,
    proportion: allocations[variantId] ?? 0,
  }));
}

function assignmentStorageKey(experimentId: string): string {
  return `dtj_exp_v1:${experimentId}`;
}

export function isCtaExperimentEnabled(
  environmentValue = process.env.NEXT_PUBLIC_EXP_CTA_001_ENABLED,
): boolean {
  return CTA_EXPERIMENT?.runtime_enabled === true && environmentValue !== "false";
}

export async function assignExperimentVariant(
  browserId: string,
  definition: ExperimentDefinition,
  now = new Date(),
): Promise<ExperimentAssignment> {
  const digest = await sha256Hex(`${definition.experiment_id}|${browserId}`);
  const bucket = bucketFromHex(digest);
  let cumulative = 0;
  const allocation = parseAllocation(definition);
  const selected =
    allocation.find(({ proportion }) => {
      cumulative += proportion;
      return bucket < cumulative;
    }) ?? allocation.at(-1);
  if (!selected) {
    throw new Error(`Experiment ${definition.experiment_id} has no allocation`);
  }
  return {
    schema_version: "1.1.0",
    experiment_assignment_id: `exa_${digest.slice(8, 32)}`,
    experiment_id: definition.experiment_id,
    assignment_key: browserId,
    variant_id: selected.variantId,
    collision_namespace: definition.collision_namespace,
    assigned_at: now.toISOString(),
  };
}

export async function getCtaExperimentAssignment(
  browserId: string | null,
  consent: ConsentState,
  storage: Pick<Storage, "getItem" | "setItem"> | null = null,
): Promise<ExperimentAssignment | null> {
  if (
    !browserId ||
    consent.analytics !== "granted" ||
    !CTA_EXPERIMENT ||
    !isCtaExperimentEnabled()
  ) {
    return null;
  }
  const target =
    storage ?? (typeof window === "undefined" ? null : window.localStorage);
  if (!target) {
    return null;
  }
  const key = assignmentStorageKey(CTA_EXPERIMENT.experiment_id);
  const existing = target.getItem(key);
  if (existing) {
    const candidate = JSON.parse(existing) as ExperimentAssignment;
    if (
      candidate.experiment_id === CTA_EXPERIMENT.experiment_id &&
      candidate.assignment_key === browserId
    ) {
      return candidate;
    }
  }
  const assignment = await assignExperimentVariant(browserId, CTA_EXPERIMENT);
  target.setItem(key, JSON.stringify(assignment));
  return assignment;
}

export function readCtaExperimentAssignment(
  browserId: string | null,
  storage: Pick<Storage, "getItem"> | null = null,
): ExperimentAssignment | null {
  if (!browserId || !CTA_EXPERIMENT) {
    return null;
  }
  const target =
    storage ?? (typeof window === "undefined" ? null : window.localStorage);
  const value = target?.getItem(
    assignmentStorageKey(CTA_EXPERIMENT.experiment_id),
  );
  if (!value) {
    return null;
  }
  const assignment = JSON.parse(value) as ExperimentAssignment;
  return assignment.assignment_key === browserId ? assignment : null;
}

export function getCtaExperimentDefinition(): ExperimentDefinition {
  if (!CTA_EXPERIMENT) {
    throw new Error("EXP-CTA-001 is missing from the experiment registry");
  }
  return CTA_EXPERIMENT;
}
