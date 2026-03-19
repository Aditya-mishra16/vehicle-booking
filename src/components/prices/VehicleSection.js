"use client";

import { useEffect, useMemo, useState } from "react";
import VehicleCard from "./VehicleCard";
import BookingModal from "./BookingModal";
import { useTripStore } from "@/store/tripStore";
import { toast } from "sonner";

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

    if (!trip?.pickup || !trip?.drop) {
      toast.error("Please select pickup and drop locations");
      return;
    }

    if (!trip?.startDate || !trip?.startTime) {
      toast.error("Please select pickup date and time");
      return;
    }

    if (trip?.tripType === "roundtrip") {
      if (!trip?.endDate || !trip?.endTime) {
        toast.error("Please select return date and time");
        return;
      }
    }

    setStep(3);
  };

  const handleBook = () => {
    if (!trip?.pickup || !trip?.drop) {
      toast.error("Please select pickup and drop locations");
      return;
    }

    if (!trip?.startDate || !trip?.startTime) {
      toast.error("Please select pickup date and time");
      return;
    }

    if (trip?.tripType === "roundtrip") {
      if (!trip?.endDate || !trip?.endTime) {
        toast.error("Please select return date and time");
        return;
      }
    }

    if (!selectedVehicle) {
      toast.error("Please select a vehicle");
      return;
    }

    setModalOpen(true);
  };

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) {
      document.body.classList.add("has-booking-cta");
    }

    return () => {
      document.body.classList.remove("has-booking-cta");
    };
  }, []);

  return (
    <div className="space-y-4 pb-32 md:pb-0">
      {/* ✅ VEHICLE LIST → ALWAYS VISIBLE ON DESKTOP */}
      <div
        className={`${step === 2 ? "block" : "hidden"} md:block ${
          step === 3 ? "md:hidden" : ""
        }`}
      >
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

        {/* ✅ STEP 2 CTA (Proceed) */}
        <div className="pt-2 md:pt-4">
          <div className="fixed md:static bottom-6 left-4 right-4 bg-white border rounded-2xl p-4 shadow-xl md:shadow-sm flex items-center justify-between gap-4 z-40">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">
                {selectedPrice ? "Estimated Fare" : ""}
              </span>

              <span className="text-lg font-semibold">
                {selectedPrice ? `₹${selectedPrice}` : "Select vehicle"}
              </span>
            </div>

            <button
              disabled={!selectedVehicle}
              onClick={handleProceed}
              className="bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-neutral-800 disabled:bg-gray-300 whitespace-nowrap"
            >
              Proceed →
            </button>
          </div>
        </div>
      </div>

      {/* ✅ STEP 3 → SUMMARY */}
      {step === 3 && selectedVehicle && (
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

          {/* ✅ BOOK CTA */}
          <div className="fixed md:static bottom-6 left-4 right-4 bg-white border rounded-2xl p-4 shadow-xl md:shadow-sm flex items-center justify-between gap-4 z-40">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Total Fare</span>
              <span className="text-lg font-semibold">₹{selectedPrice}</span>
            </div>

            <button
              onClick={handleBook}
              className="bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-neutral-800 whitespace-nowrap"
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
