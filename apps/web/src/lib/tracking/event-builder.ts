import {
  CANONICAL_CONTEXT_FIELDS,
  CANONICAL_SCHEMA_VERSION,
  type CanonicalEvent,
  type CanonicalEventFields,
  type EventBuildContext,
  type EventName,
} from "./canonical-event";
import { assertCanonicalEvent } from "./event-schema";
import { assertNoRawPii } from "./pii-guard";

export interface EventBuilderOptions {
  now?: () => Date;
  eventId?: () => string;
}

function emptyCanonicalContext(): Record<
  (typeof CANONICAL_CONTEXT_FIELDS)[number],
  null
> {
  return Object.fromEntries(
    CANONICAL_CONTEXT_FIELDS.map((field) => [field, null]),
  ) as Record<(typeof CANONICAL_CONTEXT_FIELDS)[number], null>;
}

function defaultEventId(): string {
  return `evt_${crypto.randomUUID()}`;
}

export function buildCanonicalEvent(
  eventName: EventName,
  fields: CanonicalEventFields,
  context: EventBuildContext,
  options: EventBuilderOptions = {},
): CanonicalEvent {
  assertNoRawPii(fields);
  const now = (options.now ?? (() => new Date()))();
  const eventAt = now.toISOString();
  const event = {
    ...emptyCanonicalContext(),
    schema_version: CANONICAL_SCHEMA_VERSION,
    source_system: "synthetic_flat",
    data_origin: "synthetic",
    event_id: (options.eventId ?? defaultEventId)(),
    event_date: eventAt.slice(0, 10),
    event_at: eventAt,
    event_name: eventName,
    user_pseudo_id: context.identity.userPseudoId,
    session_id: context.identity.sessionId,
    page_type: context.pageType ?? null,
    journey_stage: context.journeyStage ?? null,
    device_category: context.deviceCategory ?? null,
    consent_analytics: context.consent.analytics,
    consent_marketing: context.consent.marketing,
    cmp_version: context.consent.cmpVersion,
    ...fields,
  } as CanonicalEvent;

  assertNoRawPii(event);
  assertCanonicalEvent(event);
  return event;
}
