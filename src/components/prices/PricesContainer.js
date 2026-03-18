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

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Layout */}
      <div className="block md:hidden px-4 pt-6 space-y-6">
        <BookingStepper
          step={step}
          setStep={setStep}
          selectedVehicle={selectedVehicle}
        />

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
          <BookingStepper
            step={step}
            setStep={setStep}
            selectedVehicle={selectedVehicle}
          />

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
