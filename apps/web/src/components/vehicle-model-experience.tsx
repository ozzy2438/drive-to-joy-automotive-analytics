"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getCtaExperimentAssignment,
  type ExperimentAssignment,
} from "@/lib/experiments/runtime";
import {
  readBehaviourState,
  updateBehaviourState,
} from "@/lib/personalisation/behaviour";
import { PersonalisationPanel } from "@/components/personalisation-panel";
import type { VehicleModel } from "@/lib/reference-data";
import {
  getTrackingIdentity,
  updateJourneyContext,
} from "@/lib/tracking";
import {
  TrackedPageView,
  useTracking,
} from "@/lib/tracking/tracking-context";

const CTA_BY_VARIANT = {
  control: { label: "Book a test drive", route: "test-drive" },
  treatment_a: { label: "Request a fictional quote", route: "quote" },
  treatment_b: { label: "Build this vehicle", route: "build" },
} as const;

export function VehicleModelExperience({ model }: { model: VehicleModel }) {
  const { consent, hydrated, track } = useTracking();
  const [selectedVariantId, setSelectedVariantId] = useState(
    model.variants[0].variant_id,
  );
  const [assignment, setAssignment] = useState<ExperimentAssignment | null>(null);
  const selectedVariant =
    model.variants.find((variant) => variant.variant_id === selectedVariantId) ??
    model.variants[0];

  useEffect(() => {
    updateJourneyContext({
      vehicleModel: model.vehicleModel,
      vehicleVariant: selectedVariant.vehicle_variant,
    });
  }, [model.vehicleModel, selectedVariant.vehicle_variant]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const marker = `dtj_seen_v1:behaviour:model:${model.modelSlug}`;
    if (
      consent.analytics === "granted" &&
      sessionStorage.getItem(marker) !== "1"
    ) {
      const current = readBehaviourState(consent);
      updateBehaviourState(consent, { visitCount: current.visitCount + 1 });
      sessionStorage.setItem(marker, "1");
    }
    let active = true;
    const identity = getTrackingIdentity(consent);
    void getCtaExperimentAssignment(identity.userPseudoId, consent).then(
      (result) => {
        if (active) {
          setAssignment(result);
        }
      },
    );
    return () => {
      active = false;
    };
  }, [consent, hydrated, model.modelSlug]);

  useEffect(() => {
    if (!assignment) {
      return;
    }
    void track(
      "experiment_exposure",
      {
        experiment_id: assignment.experiment_id,
        experiment_assignment_id: assignment.experiment_assignment_id,
        variant_id: assignment.variant_id,
        vehicle_model: model.vehicleModel,
        cta_id: `model_primary_${assignment.variant_id}`,
      },
      {
        pageType: "vehicle_model",
        journeyStage: "research",
        dedupeKey: `experiment:${assignment.experiment_assignment_id}`,
      },
    );
  }, [assignment, model.modelSlug, model.vehicleModel, track]);

  const cta = CTA_BY_VARIANT[
    (assignment?.variant_id as keyof typeof CTA_BY_VARIANT) ?? "control"
  ];
  const ctaHref =
    cta.route === "build"
      ? `/build/${model.modelSlug}`
      : `/${cta.route}`;
  const personalisationSignals = useMemo(
    () => ({ currentPowertrain: selectedVariant.powertrain }),
    [selectedVariant.powertrain],
  );

  return (
    <div className="shell py-14">
      <TrackedPageView
        eventName="view_vehicle_model"
        pageType="vehicle_model"
        journeyStage="research"
        identity={`/vehicles/${model.modelSlug}`}
        fields={{
          vehicle_model: model.vehicleModel,
          vehicle_variant: selectedVariant.vehicle_variant,
          powertrain: selectedVariant.powertrain,
        }}
      />
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
        {model.bodyType} · fictional model
      </p>
      <div className="mt-3 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section>
          <h1 className="text-5xl font-black tracking-tight">
            {model.vehicleModel}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            A synthetic {model.usageSegment} model with governed variant,
            specification, offer and next-action instrumentation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="button"
              href={ctaHref}
              data-testid="experiment-cta"
              data-variant={assignment?.variant_id ?? "generic"}
            >
              {cta.label}
            </Link>
            <Link
              className="button button-secondary"
              href={`/finance/${model.modelSlug}`}
            >
              Illustrative finance
            </Link>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Experiment assignment changes wording or destination only. No winner
            or uplift is claimed.
          </p>
        </section>
        <PersonalisationPanel
          placement="vehicle_model"
          signals={personalisationSignals}
          reservedCollisionNamespaces={
            assignment ? [assignment.collision_namespace] : []
          }
        />
      </div>

      <section className="card mt-10 p-7">
        <h2 className="text-2xl font-extrabold">Variant and specification</h2>
        <label className="mt-5 block max-w-xl font-semibold">
          Fictional variant
          <select
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white p-3"
            value={selectedVariantId}
            onChange={(event) => {
              const nextId = event.target.value;
              setSelectedVariantId(nextId);
              const variant = model.variants.find(
                (item) => item.variant_id === nextId,
              );
              if (variant) {
                void track(
                  "view_vehicle_variant",
                  {
                    vehicle_model: model.vehicleModel,
                    vehicle_variant: variant.vehicle_variant,
                    powertrain: variant.powertrain,
                  },
                  {
                    pageType: "vehicle_model",
                    journeyStage: "research",
                  },
                );
              }
            }}
          >
            {model.variants.map((variant) => (
              <option key={variant.variant_id} value={variant.variant_id}>
                {variant.vehicle_variant} · {variant.powertrain}
              </option>
            ))}
          </select>
        </label>
        <dl className="mt-6 grid gap-4 sm:grid-cols-4">
          {[
            ["Powertrain", selectedVariant.powertrain],
            ["Price band", selectedVariant.price_band],
            ["Seats", String(selectedVariant.seats)],
            ["Launch status", selectedVariant.launch_status],
          ].map(([term, detail]) => (
            <div key={term}>
              <dt className="text-xs font-bold uppercase text-[var(--muted)]">
                {term}
              </dt>
              <dd className="mt-1 font-semibold">{detail}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            className="button button-secondary"
            type="button"
            onClick={() =>
              void track(
                "view_specification",
                {
                  vehicle_model: model.vehicleModel,
                  vehicle_variant: selectedVariant.vehicle_variant,
                  specification_section: "core_specifications",
                },
                {
                  pageType: "vehicle_model",
                  journeyStage: "research",
                },
              )
            }
          >
            Record specification view
          </button>
          <button
            className="button button-secondary"
            type="button"
            onClick={() =>
              void track(
                "view_offer",
                {
                  vehicle_model: model.vehicleModel,
                  offer_id: `offer_${model.modelSlug}_illustrative`,
                },
                {
                  pageType: "vehicle_model",
                  journeyStage: "research",
                },
              )
            }
          >
            Record fictional offer view
          </button>
        </div>
      </section>
    </div>
  );
}
