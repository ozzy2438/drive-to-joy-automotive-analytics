import { LeadFormExperience } from "@/components/lead-form-experience";
import { getDealers, getVehicleModels } from "@/lib/reference-data";

export default function TestDrivePage() {
  return (
    <LeadFormExperience
      formType="test_drive"
      models={getVehicleModels()}
      dealers={getDealers({ activeOnly: true })}
    />
  );
}
