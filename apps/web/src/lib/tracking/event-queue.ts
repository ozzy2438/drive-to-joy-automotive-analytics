import type { CanonicalEvent } from "./canonical-event";
import { pushToDataLayer } from "./data-layer";
import { assertCanonicalEvent } from "./event-schema";
import { assertNoRawPii } from "./pii-guard";

export type DispatchStatus = "sent" | "blocked" | "duplicate";

interface DispatchDependencies {
  collector?: (event: CanonicalEvent) => Promise<void>;
  dataLayer?: (event: CanonicalEvent) => void;
}

let dispatchChain: Promise<unknown> = Promise.resolve();
const memoryDedupe = new Set<string>();

async function postToCollector(event: CanonicalEvent): Promise<void> {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error(`Local event collector rejected event (${response.status})`);
  }
}

function hasSeen(dedupeKey: string): boolean {
  if (memoryDedupe.has(dedupeKey)) {
    return true;
  }
  if (typeof window === "undefined") {
    return false;
  }
  return window.sessionStorage.getItem(`dtj_seen_v1:${dedupeKey}`) === "1";
}

function markSeen(dedupeKey: string): void {
  memoryDedupe.add(dedupeKey);
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(`dtj_seen_v1:${dedupeKey}`, "1");
  }
}

async function dispatch(
  event: CanonicalEvent,
  dedupeKey: string | undefined,
  dependencies: DispatchDependencies,
): Promise<DispatchStatus> {
  assertNoRawPii(event);
  assertCanonicalEvent(event);
  if (
    event.event_name !== "consent_update" &&
    event.consent_analytics !== "granted"
  ) {
    return "blocked";
  }
  if (dedupeKey && hasSeen(dedupeKey)) {
    return "duplicate";
  }

  (dependencies.dataLayer ?? pushToDataLayer)(event);
  await (dependencies.collector ?? postToCollector)(event);
  if (dedupeKey) {
    markSeen(dedupeKey);
  }
  return "sent";
}

export function queueCanonicalEvent(
  event: CanonicalEvent,
  options: DispatchDependencies & { dedupeKey?: string } = {},
): Promise<DispatchStatus> {
  const operation = dispatchChain.then(() =>
    dispatch(event, options.dedupeKey, options),
  );
  dispatchChain = operation.catch(() => undefined);
  return operation;
}

export function resetEventQueueForTests(): void {
  dispatchChain = Promise.resolve();
  memoryDedupe.clear();
}
