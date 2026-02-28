"use client";

export default function VehicleCard({ vehicle, distance, loading }) {
  const price =
    distance && !loading
      ? Math.round(vehicle.baseFare + vehicle.pricePerKm * distance)
      : "--";

  return (
    <div className="bg-white rounded-2xl p-6 transition hover:shadow-xl cursor-pointer">
      {/* Vehicle Image */}
      <div className="flex justify-center mb-6">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="h-32 object-contain"
        />
      </div>

      {/* Title + Seat Badge */}
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-lg font-semibold">{vehicle.name}</h3>
        <span className="text-xs bg-black text-white px-3 py-1 rounded-full">
          {vehicle.seats}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-500 text-sm mb-4">{vehicle.description}</p>

      {/* Price */}
      <div className="text-lg font-semibold">₹{price}</div>
    </div>
  );
}
