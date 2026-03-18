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
  step,
  setStep,
  selectedVehicle,
  setSelectedVehicle,
}) {
  const trip = useTripStore((state) => state.trip);

  const [selectedPrice, setSelectedPrice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const vehicles = useMemo(
    () => [
      {
        id: 1,
        type: "Mini Intercity",
        seats: "4",
        pricePerKm: 10,
        image: "/images/Mini.png",
        models: "Ritz, Wagon R, Indica",
      },
      {
        id: 2,
        type: "Sedan Intercity",
        seats: "4",
        pricePerKm: 12,
        image: "/images/Sedan.png",
        models: "Dzire, Etios, Sunny",
      },
      {
        id: 3,
        type: "XUV Intercity",
        seats: "6",
        pricePerKm: 15,
        image: "/images/Suv.png",
        models: "Innova, Crysta",
      },
    ],
    [],
  );

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const driverAllowance = calculateDays() * 500;

  const handleSelectVehicle = (vehicle, price) => {
    setSelectedVehicle(vehicle);
    setSelectedPrice(price);
  };

  const handleProceed = () => {
    if (!selectedVehicle) return;
    setStep(2);
  };

  const handleBook = () => {
    setModalOpen(true);
  };

  return (
    <div className="space-y-4 pb-24 md:pb-0">
      {/* STEP 1 */}
      {step === 1 && (
        <>
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                distance={distance}
                loading={loading}
                driverAllowance={driverAllowance}
                onSelect={handleSelectVehicle}
                selected={selectedVehicle?.id === vehicle.id}
              />
            ))}
          </div>

          {/* Sticky CTA */}
          <div className="fixed md:static bottom-4 left-4 right-4 bg-white border md:border rounded-2xl p-4 md:p-5 pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-xl md:shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3 z-500">
            <div className="text-base font-semibold text-center md:text-left">
              {selectedPrice
                ? `₹${selectedPrice}`
                : "Select a vehicle to continue"}
            </div>
            <button
              disabled={!selectedVehicle}
              onClick={handleProceed}
              className="w-full md:w-auto bg-black text-white px-6 py-3 md:py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-800 disabled:bg-gray-400"
            >
              Proceed →
            </button>
          </div>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && selectedVehicle && (
        <>
          <VehicleCard
            vehicle={selectedVehicle}
            distance={distance}
            loading={loading}
            driverAllowance={driverAllowance}
            onSelect={() => {}}
            selected
          />

          <div className="bg-white border rounded-2xl p-4 md:p-5 space-y-2">
            <h3 className="font-semibold text-lg">Price Breakdown</h3>

            <div className="flex justify-between text-sm">
              <span>Base Fare</span>
              <span>₹{selectedPrice - driverAllowance}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Driver Allowance</span>
              <span>₹{driverAllowance}</span>
            </div>

            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total Fare</span>
              <span>₹{selectedPrice}</span>
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-4 md:p-5 space-y-3">
            <h3 className="text-lg font-semibold">Terms & Conditions</h3>

            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Fare is calculated for the estimated distance.</li>
              <li>Toll charges are extra and payable as per actuals.</li>
              <li>Parking and entry charges are not included in base fare.</li>
              <li>Inter-state permit taxes are extra.</li>
            </ul>
          </div>

          {/* Sticky Book CTA */}
          <div className="fixed md:static bottom-4 left-4 right-4 bg-white border md:border rounded-2xl p-4 md:p-5 pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-xl md:shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3 z-500">
            <div className="text-lg font-semibold text-center md:text-left">
              ₹{selectedPrice}
            </div>
            <button
              onClick={handleBook}
              className="w-full md:w-auto bg-black text-white px-6 py-3 md:py-2.5 rounded-xl text-sm font-medium hover:bg-neutral-800"
            >
              Book Now →
            </button>
          </div>
        </>
      )}

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
