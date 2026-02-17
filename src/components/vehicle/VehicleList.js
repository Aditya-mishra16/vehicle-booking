import VehicleCard from "./VehicleCard";

export default function VehicleList() {
  const vehicles = [
    { id: "1", name: "Innova", price: 15 },
    { id: "2", name: "Swift", price: 10 },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {vehicles.map((v) => (
        <VehicleCard key={v.id} vehicle={v} />
      ))}
    </div>
  );
}