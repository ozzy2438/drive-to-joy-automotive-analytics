import { notFound } from "next/navigation";
import { FinanceExperience } from "@/components/finance-experience";
import { getVehicleModel, getVehicleModels } from "@/lib/reference-data";

export function generateStaticParams() {
  return getVehicleModels().map((model) => ({ model: model.modelSlug }));
}

export default async function FinancePage({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const { model: slug } = await params;
  const model = getVehicleModel(slug);
  if (!model) {
    notFound();
  }
  return <FinanceExperience model={model} />;
}
