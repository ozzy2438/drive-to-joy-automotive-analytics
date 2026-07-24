import { CompareExperience } from "@/components/compare-experience";
import { getVehicleModels } from "@/lib/reference-data";

export default function ComparePage() {
  return <CompareExperience models={getVehicleModels()} />;
}
