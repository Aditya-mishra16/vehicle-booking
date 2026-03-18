"use client";

export default function VehicleCard({
  vehicle,
  distance,
  loading,
  driverAllowance,
  onSelect,
  selected,
}) {
  const total =
    distance && !loading
      ? Math.round(vehicle.pricePerKm * distance + driverAllowance)
      : null;

  return (
    <div
      onClick={() => total && onSelect(vehicle, total)}
      className={`
        flex items-center justify-between
        border rounded-2xl
        p-5
        bg-white
        transition
        cursor-pointer
        hover:shadow-md
        ${selected ? "border-brandColor bg-orange-50" : ""}
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-5">
        <img
          src={vehicle.image}
          alt={vehicle.type}
          className="w-24 h-16 object-contain"
        />

        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">{vehicle.type}</h3>

            <span className="text-sm flex items-center gap-1 text-gray-700">
              👤 {vehicle.seats}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-1">{vehicle.models}</p>
        </div>
      </div>

      {/* PRICE */}
      <div className="text-xl font-semibold">
        {total !== null ? `₹${total}` : "--"}
      </div>
    </div>
  );
}
