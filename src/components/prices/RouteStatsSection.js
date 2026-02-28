"use client";

export default function RouteStatsSection({ duration, distance }) {
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
          ₹{distance ? Math.round(50 + distance * 12) : "--"}
        </p>
      </div>
    </div>
  );
}
