"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CONSENT_POLICY_VERSION,
  UNKNOWN_CONSENT,
  clearAnalyticsState,
  readConsentState,
  writeConsentState,
} from "./consent";
import { buildCanonicalEvent } from "./event-builder";
import { queueCanonicalEvent, type DispatchStatus } from "./event-queue";
import { getTrackingIdentity } from "./identity";
import type {
  CanonicalEventFields,
  ConsentState,
  ConsentValue,
  EventName,
  JourneyStage,
} from "./canonical-event";

interface TrackOptions {
  pageType?: string;
  journeyStage?: JourneyStage;
  dedupeKey?: string;
}

interface TrackingContextValue {
  consent: ConsentState;
  hydrated: boolean;
  updateConsent: (
    analytics: Exclude<ConsentValue, "unknown">,
    marketing: Exclude<ConsentValue, "unknown">,
  ) => Promise<DispatchStatus>;
  track: (
    eventName: EventName,
    fields?: CanonicalEventFields,
    options?: TrackOptions,
  ) => Promise<DispatchStatus>;
}

const TrackingContext = createContext<TrackingContextValue | null>(null);

function currentDeviceCategory(): "mobile" | "desktop" | "tablet" | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (window.innerWidth < 768) {
    return "mobile";
  }
  if (window.innerWidth < 1024) {
    return "tablet";
  }
  return "desktop";
}

export function TrackingProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(UNKNOWN_CONSENT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrationTask = window.setTimeout(() => {
      setConsent(readConsentState());
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(hydrationTask);
  }, []);

  const track = useCallback(
    (
      eventName: EventName,
      fields: CanonicalEventFields = {},
      options: TrackOptions = {},
    ) => {
      const identity = getTrackingIdentity(consent);
      const event = buildCanonicalEvent(eventName, fields, {
        consent,
        identity,
        pageType: options.pageType,
        journeyStage: options.journeyStage,
        deviceCategory: currentDeviceCategory(),
      });
      return queueCanonicalEvent(event, { dedupeKey: options.dedupeKey });
    },
    [consent],
  );

  const updateConsent = useCallback(
    async (
      analytics: Exclude<ConsentValue, "unknown">,
      marketing: Exclude<ConsentValue, "unknown">,
    ) => {
      if (analytics !== "granted") {
        clearAnalyticsState();
      }
      const next: ConsentState = {
        analytics,
        marketing,
        cmpVersion: CONSENT_POLICY_VERSION,
        updatedAt: new Date().toISOString(),
      };
      writeConsentState(next);
      setConsent(next);
      const event = buildCanonicalEvent(
        "consent_update",
        {},
        {
          consent: next,
          identity: getTrackingIdentity(next),
          pageType: "consent",
          journeyStage: "discover",
          deviceCategory: currentDeviceCategory(),
        },
      );
      return queueCanonicalEvent(event, {
        dedupeKey: `consent:${next.analytics}:${next.marketing}:${next.updatedAt}`,
      });
    },
    [],
  );

  const value = useMemo(
    () => ({ consent, hydrated, updateConsent, track }),
    [consent, hydrated, track, updateConsent],
  );

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking(): TrackingContextValue {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error("useTracking must be used within TrackingProvider");
  }
  return context;
}

export function TrackedPageView({
  eventName,
  pageType,
  journeyStage,
  fields = {},
  identity,
}: {
  eventName: EventName;
  pageType: string;
  journeyStage: JourneyStage;
  fields?: CanonicalEventFields;
  identity: string;
}) {
  const { hydrated, track } = useTracking();

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    void track(eventName, fields, {
      pageType,
      journeyStage,
      dedupeKey: `page:${identity}`,
    });
  }, [eventName, fields, hydrated, identity, journeyStage, pageType, track]);

  return null;
}
