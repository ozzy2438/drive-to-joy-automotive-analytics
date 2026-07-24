"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { readCtaExperimentAssignment } from "@/lib/experiments/runtime";
import { readActivePersonalisationAssignment } from "@/lib/personalisation/runtime";
import type { Dealer, VehicleModel } from "@/lib/reference-data";
import {
  assertNoRawPii,
  getTrackingIdentity,
  readJourneyContext,
  updateJourneyContext,
} from "@/lib/tracking";
import { useTracking } from "@/lib/tracking/tracking-context";

const responseSchema = z.object({
  accepted: z.literal(true),
  web_submission_id: z.string().min(8),
  lead_id_hash: z.string().min(16),
  crm_lead_id: z.string().min(8),
  accepted_at: z.string(),
});

export function LeadFormExperience({
  formType,
  models,
  dealers,
}: {
  formType: "test_drive" | "quote";
  models: VehicleModel[];
  dealers: Dealer[];
}) {
  const router = useRouter();
  const { consent, hydrated, track } = useTracking();
  const [formInstanceId, setFormInstanceId] = useState("");
  const [vehicleSlug, setVehicleSlug] = useState(models[0].modelSlug);
  const [dealerId, setDealerId] = useState(dealers[0].dealer_id);
  const [acknowledged, setAcknowledged] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const startedAt = useRef(0);
  const vehicle = models.find((model) => model.modelSlug === vehicleSlug)!;
  const dealer = dealers.find((item) => item.dealer_id === dealerId)!;
  const startEvent =
    formType === "test_drive" ? "test_drive_start" : "quote_start";
  const submitEvent =
    formType === "test_drive" ? "test_drive_submit" : "quote_submit";

  useEffect(() => {
    const hydrationTask = window.setTimeout(() => {
      const journey = readJourneyContext();
      const matchedVehicle = models.find(
        (model) => model.vehicleModel === journey.vehicleModel,
      );
      const matchedDealer = dealers.find(
        (item) => item.dealer_id === journey.dealerId,
      );
      if (matchedVehicle) {
        setVehicleSlug(matchedVehicle.modelSlug);
      }
      if (matchedDealer) {
        setDealerId(matchedDealer.dealer_id);
      }
      setFormInstanceId(`frm_${crypto.randomUUID()}`);
      startedAt.current = Date.now();
    }, 0);
    return () => window.clearTimeout(hydrationTask);
  }, [dealers, models]);

  useEffect(() => {
    if (!hydrated || !formInstanceId) {
      return;
    }
    updateJourneyContext({
      vehicleModel: vehicle.vehicleModel,
      dealerId: dealer.dealer_id,
      dealerState: dealer.state,
    });
    void track(
      startEvent,
      {
        form_instance_id: formInstanceId,
        form_type: formType,
        vehicle_model: vehicle.vehicleModel,
        dealer_id: dealer.dealer_id,
        dealer_state: dealer.state,
      },
      {
        pageType: `${formType}_form`,
        journeyStage: "convert",
        dedupeKey: `form:start:${formInstanceId}`,
      },
    );
  }, [
    dealer.dealer_id,
    dealer.state,
    formInstanceId,
    formType,
    hydrated,
    startEvent,
    track,
    vehicle.vehicleModel,
  ]);

  async function submit() {
    if (!acknowledged) {
      const nextErrorCount = errorCount + 1;
      setErrorCount(nextErrorCount);
      setStatus("Confirm that this is a synthetic demonstration.");
      await track(
        "form_error",
        {
          form_instance_id: formInstanceId,
          form_type: formType,
          form_field: "demo_acknowledgement",
          form_error_type: "required",
          form_error_count: nextErrorCount,
        },
        { pageType: `${formType}_form`, journeyStage: "convert" },
      );
      return;
    }

    setSubmitting(true);
    setStatus(null);
    try {
      const identity = getTrackingIdentity(consent);
      const experiment = readCtaExperimentAssignment(identity.userPseudoId);
      const personalisation = readActivePersonalisationAssignment();
      const requestBody = {
        form_instance_id: formInstanceId,
        form_type: formType,
        vehicle_model: vehicle.vehicleModel,
        vehicle_variant: vehicle.variants[0].vehicle_variant,
        dealer_id: dealer.dealer_id,
        dealer_state: dealer.state,
        user_pseudo_id: identity.userPseudoId,
        session_id: identity.sessionId,
        experiment_assignment_id:
          experiment?.experiment_assignment_id ?? null,
        variant_id: experiment?.variant_id ?? null,
        personalisation_assignment_id:
          personalisation?.personalisation_assignment_id ?? null,
        audience_id: personalisation?.audience_id ?? null,
        experience_id: personalisation?.experience_id ?? null,
        holdout_flag: personalisation?.holdout_flag ?? null,
        demo_acknowledgement: true as const,
      };
      assertNoRawPii(requestBody);
      const response = await fetch("/api/crm/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error("CRM emulator rejected the synthetic submission");
      }
      const accepted = responseSchema.parse(await response.json());
      await track(
        submitEvent,
        {
          form_instance_id: formInstanceId,
          form_type: formType,
          vehicle_model: vehicle.vehicleModel,
          vehicle_variant: vehicle.variants[0].vehicle_variant,
          dealer_id: dealer.dealer_id,
          dealer_state: dealer.state,
          web_submission_id: accepted.web_submission_id,
          lead_id_hash: accepted.lead_id_hash,
          form_completion_time_seconds: Math.max(
            0,
            Math.round((Date.now() - startedAt.current) / 1000),
          ),
          form_error_count: errorCount,
          experiment_id: experiment?.experiment_id ?? null,
          experiment_assignment_id:
            experiment?.experiment_assignment_id ?? null,
          variant_id: experiment?.variant_id ?? null,
          audience_id: personalisation?.audience_id ?? null,
          personalisation_assignment_id:
            personalisation?.personalisation_assignment_id ?? null,
          experience_id: personalisation?.experience_id ?? null,
          holdout_flag: personalisation?.holdout_flag ?? null,
        },
        { pageType: `${formType}_form`, journeyStage: "convert" },
      );
      router.push("/thank-you");
    } catch {
      setStatus("The local CRM emulator could not accept this submission.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!formInstanceId) {
    return <div className="shell py-14">Preparing synthetic form…</div>;
  }

  return (
    <div className="shell py-14">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand)]">
        {formType === "test_drive" ? "Test drive" : "Quote"} · synthetic form
      </p>
      <h1 className="mt-3 text-5xl font-black">
        {formType === "test_drive"
          ? "Request a fictional test drive"
          : "Request a fictional quote"}
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
        This form intentionally has no name, contact, address, postcode or
        personal finance inputs. It creates only synthetic local records.
      </p>
      <section className="card mt-8 max-w-3xl p-7">
        <p className="text-xs text-[var(--muted)]">
          Form instance: {formInstanceId.slice(0, 16)}…
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="font-semibold">
            Fictional vehicle
            <select
              className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white p-3"
              value={vehicleSlug}
              onChange={(event) => {
                setVehicleSlug(event.target.value);
                updateJourneyContext({
                  vehicleModel: models.find(
                    (model) => model.modelSlug === event.target.value,
                  )?.vehicleModel,
                });
              }}
            >
              {models.map((model) => (
                <option key={model.modelSlug} value={model.modelSlug}>
                  {model.vehicleModel}
                </option>
              ))}
            </select>
          </label>
          <label className="font-semibold">
            Fictional dealer
            <select
              className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white p-3"
              value={dealerId}
              onChange={(event) => {
                setDealerId(event.target.value);
                const selected = dealers.find(
                  (item) => item.dealer_id === event.target.value,
                );
                if (selected) {
                  updateJourneyContext({
                    dealerId: selected.dealer_id,
                    dealerState: selected.state,
                  });
                }
              }}
            >
              {dealers.map((item) => (
                <option key={item.dealer_id} value={item.dealer_id}>
                  {item.dealer_name} · {item.state}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="mt-6 flex items-start gap-3 rounded-xl bg-[#edf3ef] p-4">
          <input
            className="mt-1"
            type="checkbox"
            checked={acknowledged}
            onChange={(event) => setAcknowledged(event.target.checked)}
          />
          <span>
            I understand this is a fictional portfolio demonstration and no
            person will be contacted.
          </span>
        </label>
        {status ? (
          <p className="mt-4 font-semibold text-[#8b2f20]" role="alert">
            {status}
          </p>
        ) : null}
        <button
          className="button mt-6"
          type="button"
          disabled={submitting}
          onClick={() => void submit()}
        >
          {submitting ? "Creating local record…" : "Submit synthetic request"}
        </button>
      </section>
    </div>
  );
}
