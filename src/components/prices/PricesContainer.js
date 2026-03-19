"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useTripStore } from "@/store/tripStore";
import PriceForm from "./PriceForm";
import VehicleSection from "./VehicleSection";
import RouteMapSection from "./RouteMapSection";
import BookingStepper from "./BookingStepper";

export default function PricesContainer() {
  const trip = useTripStore((state) => state.trip);

  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [pickup, setPickup] = useState(trip?.pickup || "");
  const [drop, setDrop] = useState(trip?.drop || "");
  const [pickupCoords, setPickupCoords] = useState(trip?.pickupCoords || null);
  const [dropCoords, setDropCoords] = useState(trip?.dropCoords || null);
  const [startDate, setStartDate] = useState(
    trip?.startDate || trip?.date || "",
  );
  const [endDate, setEndDate] = useState(trip?.endDate || "");
  const [startTime, setStartTime] = useState(trip?.startTime || "");
  const [endTime, setEndTime] = useState(trip?.endTime || "");
  const [tripType, setTripType] = useState(trip?.tripType || "oneway");

  const setTrip = useTripStore((state) => state.setTrip);

  useEffect(() => {
    setTrip({
      pickup,
      drop,
      pickupCoords,
      dropCoords,
      startDate,
      startTime,
      endDate,
      endTime,
      tripType,
    });
  }, [
    pickup,
    drop,
    pickupCoords,
    dropCoords,
    startDate,
    startTime,
    endDate,
    endTime,
    tripType,
    setTrip,
  ]);

  const [route, setRoute] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateRoute = useCallback(async () => {
    if (!pickupCoords || !dropCoords) return;

    try {
      setLoading(true);

      const res = await axios.post("/api/geo", {
        type: "route",
        pickupCoords,
        dropCoords,
      });

      const feature = res.data.route.features[0];
      const summary = feature.properties.summary;

      const routePoints = feature.geometry.coordinates.map(([lng, lat]) => [
        lat,
        lng,
      ]);

      setRoute(routePoints);
      setMarkers([routePoints[0], routePoints.at(-1)]);
      setDistance((summary.distance / 1000).toFixed(1));
    } catch {
      setRoute([]);
      setMarkers([]);
      setDistance(null);
    } finally {
      setLoading(false);
    }
  }, [pickupCoords, dropCoords]);

  useEffect(() => {
    calculateRoute();
  }, [calculateRoute]);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (!isMobile) return;

    // Steps that have bottom CTA
    if (step === 1 || step === 2 || step === 3) {
      document.body.classList.add("has-booking-cta");
    } else {
      document.body.classList.remove("has-booking-cta");
    }

    return () => {
      document.body.classList.remove("has-booking-cta");
    };
  }, [step]);

  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;

    if (isDesktop) {
      setStep(2);
    }
  }, []);

  const isValid =
    pickup &&
    drop &&
    startDate &&
    startTime &&
    (tripType !== "roundtrip" || (endDate && endTime));

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Layout */}
      <div className="block md:hidden px-4 pt-6 space-y-6">
        <BookingStepper
          step={step}
          setStep={setStep}
          selectedVehicle={selectedVehicle}
        />

        {/* STEP 1 → PRICE FORM */}
        {step === 1 && (
          <>
            <PriceForm
              pickup={pickup}
              drop={drop}
              startDate={startDate}
              startTime={startTime}
              endDate={endDate}
              endTime={endTime}
              setStartDate={setStartDate}
              setStartTime={setStartTime}
              setEndDate={setEndDate}
              setEndTime={setEndTime}
              tripType={tripType}
              setTripType={setTripType}
              setPickup={setPickup}
              setDrop={setDrop}
              setPickupCoords={setPickupCoords}
              setDropCoords={setDropCoords}
            />
            {/* ✅ STICKY CTA */}
            <div className="fixed md:static bottom-6 left-4 right-4 bg-white border rounded-2xl p-4 shadow-xl md:shadow-sm flex items-center justify-between gap-3 z-40">
              {/* LEFT CONTENT */}
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-500">Your Ride</span>

                <span className="text-sm md:text-base font-semibold text-gray-900 truncate">
                  {pickup && drop
                    ? `${pickup.split(",")[0]} → ${drop.split(",")[0]}`
                    : "Enter trip details"}
                </span>
              </div>

              {/* BUTTON */}
              <button
                disabled={!isValid}
                onClick={() => {
                  if (!isValid) return;
                  setStep(2);
                }}
                className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isValid
                    ? "bg-black text-white hover:bg-neutral-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Continue →
              </button>
            </div>
          </>
        )}

        {/* STEP 2 → VEHICLES */}
        {(step === 2 || step === 3) && (
          <VehicleSection
            distance={distance}
            loading={loading}
            startDate={startDate}
            endDate={endDate}
            step={step}
            setStep={setStep}
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
          />
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid max-w-7xl mx-auto grid-cols-12 gap-8 items-start pt-14">
        {/* Price Form */}
        <div className="col-span-3">
          <PriceForm
            pickup={pickup}
            drop={drop}
            startDate={startDate}
            startTime={startTime}
            endDate={endDate}
            endTime={endTime}
            setStartDate={setStartDate}
            setStartTime={setStartTime}
            setEndDate={setEndDate}
            setEndTime={setEndTime}
            tripType={tripType}
            setTripType={setTripType}
            setPickup={setPickup}
            setDrop={setDrop}
            setPickupCoords={setPickupCoords}
            setDropCoords={setDropCoords}
          />
        </div>

        {/* Vehicle Section */}
        <div className="col-span-5 space-y-6">
          <div className="hidden md:block">
            <BookingStepper step={step} setStep={setStep} />
          </div>

          <VehicleSection
            distance={distance}
            loading={loading}
            startDate={startDate}
            endDate={endDate}
            step={step}
            setStep={setStep}
            selectedVehicle={selectedVehicle}
            setSelectedVehicle={setSelectedVehicle}
          />
        </div>

        {/* Map */}
        <div className="col-span-4">
          <RouteMapSection route={route} markers={markers} />
        </div>
      </div>
    </div>
  );
}
