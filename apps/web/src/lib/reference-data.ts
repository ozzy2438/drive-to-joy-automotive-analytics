import vehicleCatalogue from "../../../../data/reference/v1/vehicle_catalogue.json";
import dealerRegistry from "../../../../data/reference/v1/dealers.json";

export interface VehicleVariant {
  schema_version: string;
  record_version: number;
  vehicle_model_id: string;
  vehicle_model: string;
  model_slug: string;
  variant_id: string;
  vehicle_variant: string;
  body_type: string;
  usage_segment: string;
  powertrain: string;
  price_band: string;
  seats: number;
  launch_status: string;
  data_origin: "synthetic";
}

export interface VehicleModel {
  vehicleModelId: string;
  vehicleModel: string;
  modelSlug: string;
  bodyType: string;
  usageSegment: string;
  powertrains: string[];
  priceBands: string[];
  seats: number[];
  launchStatus: string;
  variants: VehicleVariant[];
}

export interface Dealer {
  schema_version: string;
  record_version: number;
  dealer_id: string;
  dealer_name: string;
  state: string;
  region_type: "metro" | "regional";
  capacity_band: string;
  active_flag: boolean;
  availability_state: string;
  data_origin: "synthetic";
}

const vehicles = vehicleCatalogue as VehicleVariant[];
const dealers = dealerRegistry as Dealer[];

export function getVehicleModels(): VehicleModel[] {
  const grouped = new Map<string, VehicleVariant[]>();
  vehicles.forEach((variant) => {
    grouped.set(variant.vehicle_model_id, [
      ...(grouped.get(variant.vehicle_model_id) ?? []),
      variant,
    ]);
  });
  return [...grouped.values()].map((variants) => {
    const first = variants[0];
    return {
      vehicleModelId: first.vehicle_model_id,
      vehicleModel: first.vehicle_model,
      modelSlug: first.model_slug,
      bodyType: first.body_type,
      usageSegment: first.usage_segment,
      powertrains: [...new Set(variants.map((row) => row.powertrain))],
      priceBands: [...new Set(variants.map((row) => row.price_band))],
      seats: [...new Set(variants.map((row) => row.seats))],
      launchStatus: first.launch_status,
      variants,
    };
  });
}

export function getVehicleModel(slug: string): VehicleModel | undefined {
  return getVehicleModels().find((model) => model.modelSlug === slug);
}

export function getDealers(options: { activeOnly?: boolean } = {}): Dealer[] {
  return options.activeOnly
    ? dealers.filter((dealer) => dealer.active_flag)
    : [...dealers];
}

export function getDealer(dealerId: string): Dealer | undefined {
  return dealers.find((dealer) => dealer.dealer_id === dealerId);
}
