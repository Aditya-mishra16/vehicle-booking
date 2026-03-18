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
        flex items-center gap-4
        border rounded-2xl
        p-4 md:p-5
        bg-white
        transition-all duration-200
        cursor-pointer
        hover:shadow-md
        active:scale-[0.99]
        ${selected ? "border-brandColor bg-orange-50 shadow-sm" : "border-gray-200"}
      `}
    >
      {/* IMAGE */}
      <img
        src={vehicle.image}
        alt={vehicle.type}
        className="
          w-20 h-14
          md:w-24 md:h-16
          object-contain
          flex-shrink-0
        "
      />

      {/* INFO */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-tight">
            {vehicle.type}
          </h3>

          <span className="text-sm flex items-center gap-1 text-gray-600 whitespace-nowrap">
            👤 {vehicle.seats}
          </span>
        </div>

        <p className="text-sm text-gray-500 truncate">{vehicle.models}</p>
      </div>

      {/* PRICE */}
      <div className="text-lg md:text-xl font-semibold text-gray-900 flex-shrink-0 whitespace-nowrap">
        {total !== null ? `₹${total}` : "--"}
      </div>
    </div>
  );
}
