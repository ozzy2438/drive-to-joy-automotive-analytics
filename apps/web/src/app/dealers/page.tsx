import { DealerExperience } from "@/components/dealer-experience";
import { getDealers, getVehicleModels } from "@/lib/reference-data";

export default function DealersPage() {
  return (
    <DealerExperience
      dealers={getDealers({ activeOnly: true })}
      models={getVehicleModels()}
    />
  );
}
