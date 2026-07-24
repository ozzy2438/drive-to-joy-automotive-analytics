import { buildCanonicalEvent, queueCanonicalEvent } from "@/lib/tracking";
import { resetEventQueueForTests } from "@/lib/tracking/event-queue";

const deniedContext = {
  consent: {
    analytics: "denied" as const,
    marketing: "denied" as const,
    cmpVersion: "cmp_demo_1",
  },
  identity: { userPseudoId: null, sessionId: null },
  pageType: "homepage",
  journeyStage: "discover" as const,
};

describe("event queue", () => {
  beforeEach(() => {
    sessionStorage.clear();
    resetEventQueueForTests();
  });

  it("blocks business events when analytics consent is denied", async () => {
    const collector = vi.fn(async () => undefined);
    const dataLayer = vi.fn();
    const event = buildCanonicalEvent(
      "view_homepage",
      {},
      deniedContext,
      { eventId: () => "evt_denied_0001" },
    );

    await expect(
      queueCanonicalEvent(event, { collector, dataLayer }),
    ).resolves.toBe("blocked");
    expect(collector).not.toHaveBeenCalled();
    expect(dataLayer).not.toHaveBeenCalled();
  });

  it("allows cookieless consent updates and de-duplicates a render key", async () => {
    const collector = vi.fn(async () => undefined);
    const dataLayer = vi.fn();
    const event = buildCanonicalEvent(
      "consent_update",
      {},
      { ...deniedContext, pageType: "consent" },
      { eventId: () => "evt_consent_0001" },
    );

    const first = await queueCanonicalEvent(event, {
      collector,
      dataLayer,
      dedupeKey: "strict-render",
    });
    const second = await queueCanonicalEvent(event, {
      collector,
      dataLayer,
      dedupeKey: "strict-render",
    });

    expect(first).toBe("sent");
    expect(second).toBe("duplicate");
    expect(collector).toHaveBeenCalledTimes(1);
    expect(dataLayer).toHaveBeenCalledTimes(1);
  });
});
