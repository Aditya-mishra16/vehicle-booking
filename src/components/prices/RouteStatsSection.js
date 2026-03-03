"use client";

export default function RouteStatsSection({
  duration,
  distance,
  startDate,
  endDate,
}) {
  const averagePricePerKm = 12; // (10 + 12 + 15) / 3 rounded

  const calculateDays = () => {
    if (!startDate) return 1;
    if (!endDate) return 1;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );

    return diff > 0 ? diff : 1;
  };

  const totalDays = calculateDays();
  const driverAllowance = totalDays * 500;

  const estimatedPrice =
    distance && !isNaN(distance)
      ? Math.round(distance * averagePricePerKm + driverAllowance)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-3 gap-12 text-center border-b">
      <div>
        <h3 className="text-lg font-semibold mb-2">Average travel time</h3>
        <p className="text-xl">{duration ? `${duration} mins` : "--"}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Average route distance</h3>
        <p className="text-xl">{distance ? `${distance} km` : "--"}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Estimated route price</h3>
        <p className="text-xl">
          {estimatedPrice !== null ? `₹${estimatedPrice}` : "--"}
        </p>
      </div>
    </div>
  );
}
