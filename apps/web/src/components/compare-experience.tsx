"use client";

import { useState } from "react";
import type { VehicleModel } from "@/lib/reference-data";
import { useTracking } from "@/lib/tracking/tracking-context";

export function CompareExperience({ models }: { models: VehicleModel[] }) {
  const { track } = useTracking();
  const [primary, setPrimary] = useState(models[0].modelSlug);
  const [comparison, setComparison] = useState(models[1].modelSlug);
  const [compared, setCompared] = useState(false);
  const primaryModel = models.find((model) => model.modelSlug === primary)!;
  const comparisonModel = models.find(
    (model) => model.modelSlug === comparison,
  )!;

  return (
    <div className="shell py-14">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
        Research flow
      </p>
      <h1 className="mt-3 text-5xl font-black">Compare fictional models</h1>
      <section className="card mt-8 grid gap-5 p-7 md:grid-cols-2">
        <label className="font-semibold">
          Primary model
          <select
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white p-3"
            value={primary}
            onChange={(event) => setPrimary(event.target.value)}
          >
            {models.map((model) => (
              <option key={model.modelSlug} value={model.modelSlug}>
                {model.vehicleModel}
              </option>
            ))}
          </select>
        </label>
        <label className="font-semibold">
          Comparison model
          <select
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white p-3"
            value={comparison}
            onChange={(event) => setComparison(event.target.value)}
          >
            {models.map((model) => (
              <option key={model.modelSlug} value={model.modelSlug}>
                {model.vehicleModel}
              </option>
            ))}
          </select>
        </label>
        <button
          className="button self-start md:col-span-2 md:justify-self-start"
          type="button"
          disabled={primary === comparison}
          onClick={() => {
            setCompared(true);
            void track(
              "compare_vehicle_models",
              {
                vehicle_model: primaryModel.vehicleModel,
                comparison_model: comparisonModel.vehicleModel,
              },
              { pageType: "compare", journeyStage: "research" },
            );
          }}
        >
          Compare
        </button>
      </section>
      {compared ? (
        <section className="mt-8 grid gap-5 md:grid-cols-2" aria-live="polite">
          {[primaryModel, comparisonModel].map((model) => (
            <article className="card p-6" key={model.modelSlug}>
              <h2 className="text-2xl font-extrabold">{model.vehicleModel}</h2>
              <p className="mt-3 text-[var(--muted)]">
                {model.bodyType} · {model.powertrains.join(" / ")} ·{" "}
                {model.variants.length} variants
              </p>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  );
}
