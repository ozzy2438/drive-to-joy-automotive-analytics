import { notFound } from "next/navigation";
import { VehicleModelExperience } from "@/components/vehicle-model-experience";
import { getVehicleModel, getVehicleModels } from "@/lib/reference-data";

export function generateStaticParams() {
  return getVehicleModels().map((model) => ({ model: model.modelSlug }));
}

export default async function VehicleModelPage({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const { model: slug } = await params;
  const model = getVehicleModel(slug);
  if (!model) {
    notFound();
  }
  return <VehicleModelExperience model={model} />;
}
