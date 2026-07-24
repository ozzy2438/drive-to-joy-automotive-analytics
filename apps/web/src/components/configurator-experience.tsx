"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  readBehaviourState,
  updateBehaviourState,
} from "@/lib/personalisation/behaviour";
import type { VehicleModel } from "@/lib/reference-data";
import {
  readJourneyContext,
  updateJourneyContext,
} from "@/lib/tracking";
import { useTracking } from "@/lib/tracking/tracking-context";

const COLOURS = ["colour_eucalyptus", "colour_coastal_silver", "colour_night"] as const;
const OPTIONS = ["option_touring_pack", "option_cargo_pack"] as const;
const STEPS = ["variant", "colour", "options"] as const;

export function ConfiguratorExperience({ model }: { model: VehicleModel }) {
  const { consent, hydrated, track } = useTracking();
  const [configuratorId, setConfiguratorId] = useState("");
  const [step, setStep] = useState(0);
  const [variantId, setVariantId] = useState(model.variants[0].variant_id);
  const [colourId, setColourId] = useState<string>(COLOURS[0]);
  const [optionIds, setOptionIds] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const variant =
    model.variants.find((item) => item.variant_id === variantId) ??
    model.variants[0];

  useEffect(() => {
    const hydrationTask = window.setTimeout(() => {
      const current = readJourneyContext();
      const stableId =
        current.vehicleModel === model.vehicleModel && current.configuratorId
          ? current.configuratorId
          : `cfg_${crypto.randomUUID()}`;
      updateJourneyContext({
        vehicleModel: model.vehicleModel,
        vehicleVariant: model.variants[0].vehicle_variant,
        configuratorId: stableId,
      });
      setConfiguratorId(stableId);
    }, 0);
    return () => window.clearTimeout(hydrationTask);
  }, [model.vehicleModel, model.variants]);

  useEffect(() => {
    if (!hydrated || !configuratorId) {
      return;
    }
    void track(
      "configurator_start",
      {
        vehicle_model: model.vehicleModel,
        configurator_id: configuratorId,
        entry_point: "vehicle_model_primary",
      },
      {
        pageType: "configurator",
        journeyStage: "configure",
        dedupeKey: `configurator:start:${configuratorId}`,
      },
    );
    if (consent.analytics === "granted") {
      const current = readBehaviourState(consent);
      updateBehaviourState(consent, {
        configuratorStarted: true,
        highIntentActionCount: current.highIntentActionCount + 1,
      });
    }
  }, [configuratorId, consent, hydrated, model.vehicleModel, track]);

  async function completeStep() {
    await track(
      "configurator_step_complete",
      {
        vehicle_model: model.vehicleModel,
        vehicle_variant: variant.vehicle_variant,
        configurator_id: configuratorId,
        configurator_step: STEPS[step],
        colour_id: colourId,
        option_ids: optionIds.join(";") || null,
      },
      { pageType: "configurator", journeyStage: "configure" },
    );
    if (step < STEPS.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    await track(
      "configurator_complete",
      {
        vehicle_model: model.vehicleModel,
        vehicle_variant: variant.vehicle_variant,
        powertrain: variant.powertrain,
        configurator_id: configuratorId,
        configurator_step: "complete",
        configurator_value_band: variant.price_band,
        colour_id: colourId,
        option_ids: optionIds.join(";") || null,
      },
      { pageType: "configurator", journeyStage: "configure" },
    );
    updateJourneyContext({
      vehicleModel: model.vehicleModel,
      vehicleVariant: variant.vehicle_variant,
      configuratorId,
    });
    if (consent.analytics === "granted") {
      updateBehaviourState(consent, { configuratorCompleted: true });
    }
    setCompleted(true);
  }

  if (!configuratorId) {
    return <div className="shell py-14">Preparing synthetic configurator…</div>;
  }

  return (
    <div className="shell py-14">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
        Stable configurator · {configuratorId.slice(0, 16)}…
      </p>
      <h1 className="mt-3 text-5xl font-black">Build {model.vehicleModel}</h1>
      <p className="mt-4 text-[var(--muted)]">
        Step {Math.min(step + 1, STEPS.length)} of {STEPS.length}: {STEPS[step]}
      </p>
      <section className="card mt-8 max-w-3xl p-7">
        {step === 0 ? (
          <label className="font-semibold">
            Variant
            <select
              className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white p-3"
              value={variantId}
              onChange={(event) => setVariantId(event.target.value)}
            >
              {model.variants.map((item) => (
                <option key={item.variant_id} value={item.variant_id}>
                  {item.vehicle_variant} · {item.powertrain}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {step === 1 ? (
          <fieldset>
            <legend className="font-semibold">Synthetic colour</legend>
            <div className="mt-3 grid gap-3">
              {COLOURS.map((colour) => (
                <label key={colour}>
                  <input
                    type="radio"
                    name="colour"
                    checked={colourId === colour}
                    onChange={() => setColourId(colour)}
                  />{" "}
                  {colour.replaceAll("_", " ")}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
        {step === 2 ? (
          <fieldset>
            <legend className="font-semibold">Synthetic options</legend>
            <div className="mt-3 grid gap-3">
              {OPTIONS.map((option) => (
                <label key={option}>
                  <input
                    type="checkbox"
                    checked={optionIds.includes(option)}
                    onChange={(event) =>
                      setOptionIds((current) =>
                        event.target.checked
                          ? [...current, option]
                          : current.filter((item) => item !== option),
                      )
                    }
                  />{" "}
                  {option.replaceAll("_", " ")}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
        {!completed ? (
          <button className="button mt-7" type="button" onClick={() => void completeStep()}>
            {step === STEPS.length - 1 ? "Complete configuration" : "Save step"}
          </button>
        ) : (
          <div className="mt-7" aria-live="polite">
            <p className="font-bold">Configuration complete.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link className="button" href="/test-drive">
                Continue to test drive
              </Link>
              <Link className="button button-secondary" href="/quote">
                Continue to quote
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
