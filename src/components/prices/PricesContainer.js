"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useTripStore } from "@/store/tripStore";
import PriceForm from "./PriceForm";
import VehicleSection from "./VehicleSection";
import RouteMapSection from "./RouteMapSection";

import RouteStatsSection from "./RouteStatsSection";
import BenefitsSection from "./BenefitsSection";
import FAQSection from "./FAQSection";
import PopularRoutesSection from "./PopularRoutesSection";

export default function PricesContainer() {
  const trip = useTripStore((state) => state.trip);

  const [pickup, setPickup] = useState(trip?.pickup || "");
  const [drop, setDrop] = useState(trip?.drop || "");
  const [pickupCoords, setPickupCoords] = useState(trip?.pickupCoords || null);
  const [dropCoords, setDropCoords] = useState(trip?.dropCoords || null);
  const [startDate, setStartDate] = useState(
    trip?.startDate || trip?.date || "",
  );
  const [endDate, setEndDate] = useState(trip?.endDate || "");
  const [tripType, setTripType] = useState(trip?.tripType || "oneway");

  const [route, setRoute] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateRoute = useCallback(async () => {
    if (
      !pickupCoords ||
      !dropCoords ||
      !Array.isArray(pickupCoords) ||
      !Array.isArray(dropCoords) ||
      pickupCoords.length !== 2 ||
      dropCoords.length !== 2
    ) {
      return;
    }

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
      setDuration(Math.round(summary.duration / 60));
    } catch (err) {
      console.error("Route error:", err);
      setRoute([]);
      setMarkers([]);
      setDistance(null);
      setDuration(null);
    } finally {
      setLoading(false);
    }
  }, [pickupCoords, dropCoords]);

  useEffect(() => {
    calculateRoute();
  }, [calculateRoute]);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No trip selected
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-12 items-stretch">
        {/* ================= LEFT SIDE ================= */}
        <div className="h-[600px] flex flex-col gap-6">
          {/* ===== Form ===== */}
          <div className="flex-1">
            <PriceForm
              pickup={pickup}
              drop={drop}
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              tripType={tripType}
              setTripType={setTripType}
              setPickup={setPickup}
              setDrop={setDrop}
              setPickupCoords={setPickupCoords}
              setDropCoords={setDropCoords}
            />
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <RouteMapSection route={route} markers={markers} />
      </div>

      <RouteStatsSection
        duration={duration}
        distance={distance}
        startDate={startDate}
        endDate={endDate}
      />
      <VehicleSection
        distance={distance}
        loading={loading}
        startDate={startDate}
        endDate={endDate}
      />
      <BenefitsSection />
      <FAQSection />
      <PopularRoutesSection />
    </div>
  );
}
