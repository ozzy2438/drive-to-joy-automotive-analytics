import type { ConsentState, ConsentValue } from "./canonical-event";

export const CONSENT_STORAGE_KEY = "dtj_consent_v1";
export const CONSENT_POLICY_VERSION = "cmp_demo_1";
export const ANALYTICS_LOCAL_PREFIXES = [
  "dtj_browser_",
  "dtj_exp_",
  "dtj_pers_",
  "dtj_audience_",
  "dtj_cooldown_",
] as const;
export const ANALYTICS_SESSION_PREFIXES = [
  "dtj_session_",
  "dtj_seen_",
] as const;

export const UNKNOWN_CONSENT: ConsentState = {
  analytics: "unknown",
  marketing: "unknown",
  cmpVersion: CONSENT_POLICY_VERSION,
};

function isConsentValue(value: unknown): value is ConsentValue {
  return ["granted", "denied", "unknown", "revoked"].includes(String(value));
}

export function readConsentState(
  storage: Pick<Storage, "getItem"> | null = null,
): ConsentState {
  const target =
    storage ?? (typeof window === "undefined" ? null : window.localStorage);
  if (!target) {
    return UNKNOWN_CONSENT;
  }
  try {
    const raw = target.getItem(CONSENT_STORAGE_KEY);
    if (!raw) {
      return UNKNOWN_CONSENT;
    }
    const candidate = JSON.parse(raw) as Partial<ConsentState>;
    if (
      !isConsentValue(candidate.analytics) ||
      !isConsentValue(candidate.marketing) ||
      candidate.cmpVersion !== CONSENT_POLICY_VERSION
    ) {
      return UNKNOWN_CONSENT;
    }
    return {
      analytics: candidate.analytics,
      marketing: candidate.marketing,
      cmpVersion: candidate.cmpVersion,
      updatedAt: candidate.updatedAt,
    };
  } catch {
    return UNKNOWN_CONSENT;
  }
}

export function writeConsentState(
  consent: ConsentState,
  storage: Pick<Storage, "setItem"> | null = null,
): void {
  const target =
    storage ?? (typeof window === "undefined" ? null : window.localStorage);
  target?.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
}

function clearByPrefix(
  storage: Pick<Storage, "length" | "key" | "removeItem">,
  prefixes: readonly string[],
): void {
  const keys = Array.from({ length: storage.length }, (_, index) =>
    storage.key(index),
  ).filter((key): key is string => Boolean(key));
  keys
    .filter((key) => prefixes.some((prefix) => key.startsWith(prefix)))
    .forEach((key) => storage.removeItem(key));
}

export function clearAnalyticsState(
  local: Pick<Storage, "length" | "key" | "removeItem"> | null = null,
  session: Pick<Storage, "length" | "key" | "removeItem"> | null = null,
): void {
  const localTarget =
    local ?? (typeof window === "undefined" ? null : window.localStorage);
  const sessionTarget =
    session ?? (typeof window === "undefined" ? null : window.sessionStorage);
  if (localTarget) {
    clearByPrefix(localTarget, ANALYTICS_LOCAL_PREFIXES);
  }
  if (sessionTarget) {
    clearByPrefix(sessionTarget, ANALYTICS_SESSION_PREFIXES);
  }
}
