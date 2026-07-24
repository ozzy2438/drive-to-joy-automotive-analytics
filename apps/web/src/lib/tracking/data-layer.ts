import type { CanonicalEvent } from "./canonical-event";

declare global {
  interface Window {
    dataLayer?: Array<{
      event: string;
      canonical_event: CanonicalEvent;
    }>;
  }
}

export function pushToDataLayer(event: CanonicalEvent): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: event.event_name,
    canonical_event: event,
  });
}
