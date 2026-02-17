import Link from "next/link";

export default function VehicleCard({ vehicle }) {
  return (
    <div className="border p-4">
      <h3>{vehicle.name}</h3>
      <p>₹{vehicle.price}/km</p>
      <Link href={`/vehicles/${vehicle.id}`}>
        View Details
      </Link>
    </div>
  );
}