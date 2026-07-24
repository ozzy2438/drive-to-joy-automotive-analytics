import type { ConsentState } from "@/lib/tracking";

const BEHAVIOUR_KEY = "dtj_audience_v1";

export interface BehaviourState {
  visitCount: number;
  highIntentActionCount: number;
  financeCompletionCount: number;
  configuratorStarted: boolean;
  configuratorCompleted: boolean;
}

const INITIAL_BEHAVIOUR: BehaviourState = {
  visitCount: 0,
  highIntentActionCount: 0,
  financeCompletionCount: 0,
  configuratorStarted: false,
  configuratorCompleted: false,
};

export function readBehaviourState(
  consent: ConsentState,
  storage: Pick<Storage, "getItem"> | null = null,
): BehaviourState {
  if (consent.analytics !== "granted") {
    return INITIAL_BEHAVIOUR;
  }
  const target =
    storage ?? (typeof window === "undefined" ? null : window.localStorage);
  try {
    return {
      ...INITIAL_BEHAVIOUR,
      ...JSON.parse(target?.getItem(BEHAVIOUR_KEY) ?? "{}"),
    };
  } catch {
    return INITIAL_BEHAVIOUR;
  }
}

export function updateBehaviourState(
  consent: ConsentState,
  update: Partial<BehaviourState>,
  storage: Pick<Storage, "getItem" | "setItem"> | null = null,
): BehaviourState {
  if (consent.analytics !== "granted") {
    return INITIAL_BEHAVIOUR;
  }
  const target =
    storage ?? (typeof window === "undefined" ? null : window.localStorage);
  const next = { ...readBehaviourState(consent, target), ...update };
  target?.setItem(BEHAVIOUR_KEY, JSON.stringify(next));
  return next;
}
