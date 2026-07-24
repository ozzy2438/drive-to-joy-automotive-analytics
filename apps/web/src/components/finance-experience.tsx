"use client";

import Link from "next/link";
import { useState } from "react";
import { PersonalisationPanel } from "@/components/personalisation-panel";
import {
  readBehaviourState,
  updateBehaviourState,
} from "@/lib/personalisation/behaviour";
import type { VehicleModel } from "@/lib/reference-data";
import { useTracking } from "@/lib/tracking/tracking-context";

export function FinanceExperience({ model }: { model: VehicleModel }) {
  const { consent, track } = useTracking();
  const [term, setTerm] = useState(60);
  const [resultBand, setResultBand] = useState<string | null>(null);
  const [completionCount, setCompletionCount] = useState(
    () => readBehaviourState(consent).financeCompletionCount,
  );

  async function calculate() {
    await track(
      "finance_calculator_start",
      {
        vehicle_model: model.vehicleModel,
        entry_point: "vehicle_model_finance",
      },
      { pageType: "finance_calculator", journeyStage: "evaluate" },
    );
    const band =
      term >= 72
        ? "illustrative_lower_weekly"
        : term >= 60
          ? "illustrative_mid_weekly"
          : "illustrative_higher_weekly";
    await track(
      "finance_calculator_complete",
      {
        vehicle_model: model.vehicleModel,
        loan_term_months: term,
        repayment_band: band,
      },
      { pageType: "finance_calculator", journeyStage: "evaluate" },
    );
    setResultBand(band);
    if (consent.analytics === "granted") {
      const current = readBehaviourState(consent);
      const nextCount = current.financeCompletionCount + 1;
      updateBehaviourState(consent, {
        financeCompletionCount: nextCount,
        highIntentActionCount: current.highIntentActionCount + 1,
      });
      setCompletionCount(nextCount);
    }
  }

  return (
    <div className="shell py-14">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
        Synthetic calculator
      </p>
      <h1 className="mt-3 text-5xl font-black">
        Illustrative finance for {model.vehicleModel}
      </h1>
      <p className="mt-4 max-w-2xl font-semibold text-[#804d00]">
        Illustrative only, not financial advice. No personal financial value is
        collected or persisted.
      </p>
      <section className="card mt-8 max-w-3xl p-7">
        <label className="font-semibold">
          Illustrative term
          <select
            className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white p-3"
            value={term}
            onChange={(event) => setTerm(Number(event.target.value))}
          >
            {[36, 48, 60, 72, 84].map((months) => (
              <option key={months} value={months}>
                {months} months
              </option>
            ))}
          </select>
        </label>
        <button className="button mt-6" type="button" onClick={() => void calculate()}>
          Generate illustrative band
        </button>
        {resultBand ? (
          <div className="mt-6 rounded-xl bg-[#e9f2ed] p-5" aria-live="polite">
            <p className="text-sm text-[var(--muted)]">Result band</p>
            <p className="mt-1 text-xl font-extrabold">
              {resultBand.replaceAll("_", " ")}
            </p>
            <Link className="button mt-4" href="/dealers">
              Find a fictional dealer
            </Link>
          </div>
        ) : null}
      </section>
      <div className="mt-8 max-w-3xl">
        <PersonalisationPanel
          placement="finance_calculator"
          signals={{ financeCompletionCount: completionCount }}
        />
      </div>
    </div>
  );
}
