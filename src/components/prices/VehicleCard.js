"use client";

export default function VehicleCard({
  vehicle,
  distance,
  loading,
  driverAllowance,
  onBook,
}) {
  const total =
    distance && !loading
      ? Math.round(vehicle.pricePerKm * distance + driverAllowance)
      : null;

  return (
    <div className="bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between">
      <div>
        <div className="flex justify-center mb-6">
          <img
            src={vehicle.image}
            alt={vehicle.type}
            className="h-40 object-contain"
          />
        </div>

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{vehicle.type}</h3>

          <span className="text-xs bg-brandColor text-white px-3 py-1 rounded-full">
            {vehicle.seats}
          </span>
        </div>

        <div className="text-2xl font-bold">
          {total !== null ? `₹${total}` : "--"}
        </div>
      </div>

      <button
        className="mt-6 w-full bg-black text-white py-3 rounded-xl text-sm font-medium transition hover:bg-neutral-800 disabled:opacity-50"
        disabled={!total}
        onClick={() => onBook(vehicle, total)}
      >
        Book Now
      </button>
    </div>
  );
}
