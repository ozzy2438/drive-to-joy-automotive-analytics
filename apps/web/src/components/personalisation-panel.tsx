"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getPersonalisationAssignment,
  markPersonalisationExposure,
  type AudienceSignals,
  type PersonalisationAssignment,
} from "@/lib/personalisation/runtime";
import { getTrackingIdentity } from "@/lib/tracking";
import { useTracking } from "@/lib/tracking/tracking-context";

const EXPERIENCE_COPY: Record<string, string> = {
  hybrid_ownership_next_step:
    "Explore the synthetic hybrid ownership guide before your next step.",
  resume_configuration:
    "Your fictional configuration context is ready to continue this session.",
  finance_support_next_step:
    "Review an illustrative finance band, then choose a dealer conversation.",
  recent_journey_next_step:
    "Continue from your recent high-intent research context.",
  regional_availability_next_step:
    "Regional dealer availability is prioritised for this demonstration.",
  generic_holdout: "Continue with the standard AstraDrive research journey.",
};

export function PersonalisationPanel({
  signals,
  reservedCollisionNamespaces = [],
  placement,
}: {
  signals: AudienceSignals;
  reservedCollisionNamespaces?: string[];
  placement: string;
}) {
  const { consent, hydrated, track } = useTracking();
  const [assignment, setAssignment] =
    useState<PersonalisationAssignment | null>(null);
  const signalKey = JSON.stringify(signals);
  const collisionKey = [...reservedCollisionNamespaces].sort().join("|");
  const reserved = useMemo(
    () => new Set(collisionKey ? collisionKey.split("|") : []),
    [collisionKey],
  );

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    let active = true;
    const identity = getTrackingIdentity(consent);
    void getPersonalisationAssignment(
      identity.userPseudoId,
      consent,
      JSON.parse(signalKey) as AudienceSignals,
      reserved,
    ).then((result) => {
      if (active) {
        setAssignment(result);
      }
    });
    return () => {
      active = false;
    };
  }, [consent, hydrated, reserved, signalKey]);

  useEffect(() => {
    if (!assignment) {
      return;
    }
    void track(
      "personalisation_exposure",
      {
        audience_id: assignment.audience_id,
        personalisation_assignment_id:
          assignment.personalisation_assignment_id,
        experience_id: assignment.experience_id,
        holdout_flag: assignment.holdout_flag,
      },
      {
        pageType: placement,
        journeyStage: "evaluate",
        dedupeKey: `personalisation:${placement}:${assignment.personalisation_assignment_id}`,
      },
    ).then((status) => {
      if (status === "sent") {
        markPersonalisationExposure(assignment);
      }
    });
  }, [assignment, placement, track]);

  if (!assignment) {
    return null;
  }

  return (
    <aside className="card border-l-4 border-l-[var(--accent)] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--brand)]">
        {assignment.holdout_flag
          ? "Generic holdout experience"
          : "Personalised demo experience"}
      </p>
      <p className="mt-2 font-semibold">
        {EXPERIENCE_COPY[assignment.experience_id] ??
          "Continue the fictional journey."}
      </p>
      <p className="mt-2 text-xs text-[var(--muted)]">
        {assignment.audience_id} · {assignment.experience_id}
      </p>
    </aside>
  );
}
