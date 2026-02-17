import VehicleDetails from "@/components/vehicle/VehicleDetails";

export default function VehicleDetailsPage({ params }) {
  return <VehicleDetails vehicleId={params.id} />;
}