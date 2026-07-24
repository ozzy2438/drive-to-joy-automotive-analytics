import { notFound } from "next/navigation";
import { ConfiguratorExperience } from "@/components/configurator-experience";
import { getVehicleModel, getVehicleModels } from "@/lib/reference-data";

export function generateStaticParams() {
  return getVehicleModels().map((model) => ({ model: model.modelSlug }));
}

export default async function ConfiguratorPage({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const { model: slug } = await params;
  const model = getVehicleModel(slug);
  if (!model) {
    notFound();
  }
  return <ConfiguratorExperience model={model} />;
}
