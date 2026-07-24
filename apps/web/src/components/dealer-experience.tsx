"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PersonalisationPanel } from "@/components/personalisation-panel";
import type { Dealer, VehicleModel } from "@/lib/reference-data";
import { updateJourneyContext } from "@/lib/tracking";
import { useTracking } from "@/lib/tracking/tracking-context";

export function DealerExperience({
  dealers,
  models,
}: {
  dealers: Dealer[];
  models: VehicleModel[];
}) {
  const { track } = useTracking();
  const states = [...new Set(dealers.map((dealer) => dealer.state))].sort();
  const [state, setState] = useState("VIC");
  const [vehicleSlug, setVehicleSlug] = useState(models[0].modelSlug);
  const [searched, setSearched] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const vehicle = models.find((model) => model.modelSlug === vehicleSlug)!;
  const results = useMemo(
    () => dealers.filter((dealer) => dealer.state === state),
    [dealers, state],
  );

  async function search() {
    setSearched(true);
    setSelectedDealer(null);
    await track(
      "dealer_search",
      { search_method: "state_filter", dealer_state: state },
      { pageType: "dealer_locator", journeyStage: "evaluate" },
    );
  }

  async function selectDealer(dealer: Dealer) {
    setSelectedDealer(dealer);
    updateJourneyContext({
      vehicleModel: vehicle.vehicleModel,
      dealerId: dealer.dealer_id,
      dealerState: dealer.state,
    });
    await track(
      "dealer_select",
      {
        dealer_id: dealer.dealer_id,
        dealer_state: dealer.state,
        vehicle_model: vehicle.vehicleModel,
      },
      { pageType: "dealer_locator", journeyStage: "evaluate" },
    );
  }

  return (
    <div className="shell py-14">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
        Fictional dealer network
      </p>
      <h1 className="mt-3 text-5xl font-black">Find a dealer</h1>
      <section className="card mt-8 grid gap-5 p-7 md:grid-cols-2">
        <label className="font-semibold">
          State or territory
          <select
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white p-3"
            value={state}
            onChange={(event) => setState(event.target.value)}
          >
            {states.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="font-semibold">
          Vehicle context
          <select
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white p-3"
            value={vehicleSlug}
            onChange={(event) => setVehicleSlug(event.target.value)}
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
          onClick={() => void search()}
        >
          Search synthetic network
        </button>
      </section>

      {searched ? (
        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {results.map((dealer) => (
            <article className="card p-6" key={dealer.dealer_id}>
              <p className="text-xs font-bold uppercase text-[var(--brand)]">
                {dealer.region_type} · {dealer.availability_state}
              </p>
              <h2 className="mt-2 text-xl font-extrabold">
                {dealer.dealer_name}
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Stable ID {dealer.dealer_id} · {dealer.capacity_band} capacity
              </p>
              <button
                className="button button-secondary mt-5"
                type="button"
                onClick={() => void selectDealer(dealer)}
              >
                Select dealer
              </button>
            </article>
          ))}
        </section>
      ) : null}

      {selectedDealer ? (
        <section className="mt-8 grid gap-5 lg:grid-cols-2" aria-live="polite">
          <div className="card p-6">
            <h2 className="text-xl font-extrabold">
              {selectedDealer.dealer_name} selected
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="button" href="/test-drive">
                Continue to test drive
              </Link>
              <Link className="button button-secondary" href="/quote">
                Continue to quote
              </Link>
            </div>
          </div>
          <PersonalisationPanel
            placement="dealer_locator"
            signals={{
              selectedDealerRegionType: selectedDealer.region_type,
            }}
          />
        </section>
      ) : null}
    </div>
  );
}
