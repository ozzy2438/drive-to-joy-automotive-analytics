import { LeadFormExperience } from "@/components/lead-form-experience";
import { getDealers, getVehicleModels } from "@/lib/reference-data";

export default function QuotePage() {
  return (
    <LeadFormExperience
      formType="quote"
      models={getVehicleModels()}
      dealers={getDealers({ activeOnly: true })}
    />
  );
}
