import type { ConsentState, TrackingIdentity } from "./canonical-event";

const BROWSER_ID_KEY = "dtj_browser_v1";
const SESSION_ID_KEY = "dtj_session_v1";
const JOURNEY_CONTEXT_KEY = "dtj_journey_v1";

export interface JourneyContext {
  vehicleModel?: string;
  vehicleVariant?: string;
  dealerId?: string;
  dealerState?: string;
  configuratorId?: string;
}

function opaqueId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function getOrCreate(
  storage: Pick<Storage, "getItem" | "setItem">,
  key: string,
  prefix: string,
): string {
  const existing = storage.getItem(key);
  if (existing) {
    return existing;
  }
  const created = opaqueId(prefix);
  storage.setItem(key, created);
  return created;
}

export function getTrackingIdentity(
  consent: ConsentState,
  local: Pick<Storage, "getItem" | "setItem"> | null = null,
  session: Pick<Storage, "getItem" | "setItem"> | null = null,
): TrackingIdentity {
  if (consent.analytics !== "granted") {
    return { userPseudoId: null, sessionId: null };
  }
  const localTarget =
    local ?? (typeof window === "undefined" ? null : window.localStorage);
  const sessionTarget =
    session ?? (typeof window === "undefined" ? null : window.sessionStorage);
  if (!localTarget || !sessionTarget) {
    return { userPseudoId: null, sessionId: null };
  }
  return {
    userPseudoId: getOrCreate(localTarget, BROWSER_ID_KEY, "usr"),
    sessionId: getOrCreate(sessionTarget, SESSION_ID_KEY, "ses"),
  };
}

export function readJourneyContext(
  storage: Pick<Storage, "getItem"> | null = null,
): JourneyContext {
  const target =
    storage ?? (typeof window === "undefined" ? null : window.sessionStorage);
  try {
    return JSON.parse(target?.getItem(JOURNEY_CONTEXT_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function updateJourneyContext(
  update: Partial<JourneyContext>,
  storage: Pick<Storage, "getItem" | "setItem"> | null = null,
): JourneyContext {
  const target =
    storage ?? (typeof window === "undefined" ? null : window.sessionStorage);
  const next = { ...readJourneyContext(target), ...update };
  target?.setItem(JOURNEY_CONTEXT_KEY, JSON.stringify(next));
  return next;
}
