"use client";

import { useMemo } from "react";
import VehicleCard from "./VehicleCard";

export default function VehicleSection({ distance, loading }) {
  const vehicles = useMemo(
    () => [
      {
        id: 1,
        name: "Uber Go Intercity",
        seats: "1-4 seats",
        description: "Affordable outstation cabs",
        baseFare: 50,
        pricePerKm: 12,
        image: "/cars/sedan.png",
      },
      {
        id: 2,
        name: "Uber Sedan Intercity",
        seats: "1-4 seats",
        description: "Outstation cabs in comfortable sedans",
        baseFare: 80,
        pricePerKm: 18,
        image: "/cars/sedan-dark.png",
      },
      {
        id: 3,
        name: "UberXL Intercity",
        seats: "1-6 seats",
        description: "Outstation cabs for up to 6 passengers",
        baseFare: 120,
        pricePerKm: 22,
        image: "/cars/xl.png",
      },
    ],
    [],
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      {/* Header */}
      <h2 className="text-4xl font-bold mb-3">Choose Your Ride</h2>

      <p className="text-gray-600 underline mb-12 cursor-pointer">
        Request Uber Intercity
      </p>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-12">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            distance={distance}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}
