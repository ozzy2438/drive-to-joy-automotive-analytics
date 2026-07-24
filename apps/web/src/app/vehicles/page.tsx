import Link from "next/link";
import { getVehicleModels } from "@/lib/reference-data";
import { TrackedPageView } from "@/lib/tracking/tracking-context";

export default function VehiclesPage() {
  const models = getVehicleModels();

  return (
    <div className="shell py-14">
      <TrackedPageView
        eventName="view_vehicle_range"
        pageType="vehicle_range"
        journeyStage="research"
        identity="/vehicles"
      />
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
        Synthetic catalogue v1
      </p>
      <h1 className="mt-3 text-5xl font-black tracking-tight">Vehicle range</h1>
      <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
        Every model, variant and specification below is fictional and exists to
        exercise the governed research event flow.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => (
          <article className="card flex flex-col p-6" key={model.vehicleModelId}>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--brand)]">
              {model.bodyType} · {model.usageSegment}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold">
              {model.vehicleModel}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {model.variants.length} fictional variants ·{" "}
              {model.powertrains.join(" / ")} · {model.seats.join(" / ")} seats
            </p>
            <Link
              className="button mt-6 self-start"
              href={`/vehicles/${model.modelSlug}`}
            >
              Research model
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
