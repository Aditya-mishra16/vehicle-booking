"use client";

import { useMemo, useState } from "react";
import VehicleCard from "./VehicleCard";
import BookingModal from "./BookingModal";
import { useTripStore } from "@/store/tripStore";

export default function VehicleSection({
  distance,
  loading,
  startDate,
  endDate,
}) {
  const trip = useTripStore((state) => state.trip);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const vehicles = useMemo(
    () => [
      {
        id: 1,
        type: "Mini (Hatchback)",
        seats: "4 Seater",
        pricePerKm: 10,
        image: "/images/Mini.png",
      },
      {
        id: 2,
        type: "Sedan (Comfort)",
        seats: "4 Seater",
        pricePerKm: 12,
        image: "/images/Sedan.png",
      },
      {
        id: 3,
        type: "SUV (Spacious)",
        seats: "6-7 Seater",
        pricePerKm: 15,
        image: "/images/Suv.png",
      },
    ],
    [],
  );

  /* ---------- Calculate Driver Allowance ---------- */
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const totalDays = calculateDays();
  const driverAllowance = totalDays * 500;

  /* ---------- Handle Book ---------- */
  const handleBook = (vehicle, price) => {
    setSelectedVehicle(vehicle);
    setSelectedPrice(price);
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
          <span className="text-brandColor">Choose</span> Your Ride
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            distance={distance}
            loading={loading}
            driverAllowance={driverAllowance}
            onBook={handleBook}
          />
        ))}
      </div>

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        vehicle={selectedVehicle}
        price={selectedPrice}
        trip={trip}
      />
    </div>
  );
}
