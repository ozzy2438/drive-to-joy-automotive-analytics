import {
  CONSENT_POLICY_VERSION,
  CONSENT_STORAGE_KEY,
  clearAnalyticsState,
  getTrackingIdentity,
  readConsentState,
  writeConsentState,
} from "@/lib/tracking";
import { MemoryStorage } from "@/test/memory-storage";

describe("identity and consent lifecycle", () => {
  it("does not create analytics identity before consent", () => {
    const local = new MemoryStorage();
    const session = new MemoryStorage();

    expect(
      getTrackingIdentity(
        {
          analytics: "denied",
          marketing: "denied",
          cmpVersion: CONSENT_POLICY_VERSION,
        },
        local,
        session,
      ),
    ).toEqual({ userPseudoId: null, sessionId: null });
    expect(local.length).toBe(0);
    expect(session.length).toBe(0);
  });

  it("persists stable opaque IDs only after analytics consent", () => {
    const local = new MemoryStorage();
    const session = new MemoryStorage();
    const consent = {
      analytics: "granted" as const,
      marketing: "denied" as const,
      cmpVersion: CONSENT_POLICY_VERSION,
    };

    const first = getTrackingIdentity(consent, local, session);
    const second = getTrackingIdentity(consent, local, session);

    expect(first).toEqual(second);
    expect(first.userPseudoId).toMatch(/^usr_/);
    expect(first.sessionId).toMatch(/^ses_/);
  });

  it("retains the consent preference while clearing analytics state", () => {
    const local = new MemoryStorage();
    const session = new MemoryStorage();
    const consent = {
      analytics: "granted" as const,
      marketing: "denied" as const,
      cmpVersion: CONSENT_POLICY_VERSION,
    };
    writeConsentState(consent, local);
    local.setItem("dtj_browser_v1", "usr_example");
    local.setItem("dtj_exp_v1:EXP-CTA-001", "assignment");
    session.setItem("dtj_session_v1", "ses_example");

    clearAnalyticsState(local, session);

    expect(readConsentState(local)).toEqual(consent);
    expect(local.getItem(CONSENT_STORAGE_KEY)).not.toBeNull();
    expect(local.getItem("dtj_browser_v1")).toBeNull();
    expect(local.getItem("dtj_exp_v1:EXP-CTA-001")).toBeNull();
    expect(session.length).toBe(0);
  });
});
