"use client";

import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Clock, X } from "lucide-react";
import useLocationField from "@/hooks/useLocationField";
import { useEffect } from "react";
import { useRef } from "react";
import { useTripStore } from "@/store/tripStore";

export default function PriceForm({
  pickup,
  drop,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  tripType,
  setTripType,
  setPickup,
  setDrop,
  setPickupCoords,
  setDropCoords,
}) {
  const pickupField = useLocationField(pickup);
  const dropField = useLocationField(drop);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const { trip, setTrip } = useTripStore();

  useEffect(() => {
    if (pickup) {
      pickupField.setValue(pickup);
    }
  }, [pickup]);

  useEffect(() => {
    if (drop) {
      dropField.setValue(drop);
    }
  }, [drop]);

  useEffect(() => {
    if (trip) {
      setTrip({
        ...trip,
        tripType,
      });
    }
  }, [tripType]);

  return (
    <div className="bg-white text-black rounded-3xl p-10 space-y-8 shadow-2xl w-full">
      {/* ================= HEADER TEXT ================= */}
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
          <span className="text-brandColor">Book Outstation</span> Cabs at
          Affordable <span className="text-brandColor">Fares</span>
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed">
          Travel comfortably with transparent pricing, real-time route
          calculation, and flexible scheduling. Plan your trip in just a few
          taps.
        </p>
      </div>

      <div className="border-t pt-6 space-y-6">
        {/* ================= TRIP TYPE SELECTOR (NEW) ================= */}
        <div>
          <label className="text-sm font-medium text-gray-600">Trip Type</label>

          <div className="mt-2 flex bg-gray-100 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setTripType("oneway")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                tripType === "oneway"
                  ? "bg-brandColor text-white shadow-md"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              One Way
            </button>

            <button
              type="button"
              onClick={() => setTripType("roundtrip")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                tripType === "roundtrip"
                  ? "bg-brandColor text-white shadow-md"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Round Trip
            </button>
          </div>
        </div>

        {/* ---------------- PICKUP ---------------- */}
        <div className="relative" ref={pickupField.containerRef}>
          <label className="text-sm font-medium text-gray-600">
            Where from
          </label>

          <div className="relative mt-1">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
            />

            <Input
              value={pickupField.value}
              placeholder="Search city, district, state..."
              onFocus={() => pickupField.setFocused(true)}
              onChange={(e) => {
                pickupField.setValue(e.target.value);
                pickupField.setCoords(null);
                setPickup(e.target.value);
                setPickupCoords(null);
              }}
              className="pl-10 pr-10 h-12 rounded-xl"
            />

            {pickupField.value && (
              <X
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black"
                onClick={() => {
                  pickupField.setValue("");
                  pickupField.setCoords(null);
                  setPickup("");
                  setPickupCoords(null);
                }}
              />
            )}
          </div>

          {pickupField.focused && pickupField.suggestions.length > 0 && (
            <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border max-h-60 overflow-y-auto">
              {pickupField.suggestions.map((item, index) => (
                <div
                  key={index}
                  onMouseDown={() => {
                    pickupField.selectLocation(item);
                    setPickup(item.properties.label);
                    setPickupCoords(item.geometry.coordinates);
                  }}
                  className="flex items-start gap-3 p-4 hover:bg-gray-100 cursor-pointer border-b last:border-none"
                >
                  <MapPin size={18} className="mt-1 text-black" />
                  <div>
                    <p className="font-semibold text-sm">
                      {item.properties.name || item.properties.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.properties.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------------- DROP ---------------- */}
        <div className="relative" ref={dropField.containerRef}>
          <label className="text-sm font-medium text-gray-600">Where to</label>

          <div className="relative mt-1">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
            />

            <Input
              value={dropField.value}
              placeholder="Search destination..."
              onFocus={() => dropField.setFocused(true)}
              onChange={(e) => {
                dropField.setValue(e.target.value);
                dropField.setCoords(null);
                setDrop(e.target.value);
                setDropCoords(null);
              }}
              className="pl-10 pr-10 h-12 rounded-xl"
            />

            {dropField.value && (
              <X
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-black"
                onClick={() => {
                  dropField.setValue("");
                  dropField.setCoords(null);
                  setDrop("");
                  setDropCoords(null);
                }}
              />
            )}
          </div>

          {dropField.focused && dropField.suggestions.length > 0 && (
            <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border max-h-60 overflow-y-auto">
              {dropField.suggestions.map((item, index) => (
                <div
                  key={index}
                  onMouseDown={() => {
                    dropField.selectLocation(item);
                    setDrop(item.properties.label);
                    setDropCoords(item.geometry.coordinates);
                  }}
                  className="flex items-start gap-3 p-4 hover:bg-gray-100 cursor-pointer border-b last:border-none"
                >
                  <MapPin size={18} className="mt-1 text-black" />
                  <div>
                    <p className="font-semibold text-sm">
                      {item.properties.name || item.properties.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.properties.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-600">
              Start Date
            </label>

            <div
              className="relative mt-1 cursor-pointer"
              onClick={() => startDateRef.current?.showPicker()}
            >
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                size={18}
              />

              <Input
                ref={startDateRef}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10 h-12 rounded-xl cursor-pointer"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-600">
              End Date
            </label>

            <div
              className="relative mt-1 cursor-pointer"
              onClick={() => endDateRef.current?.showPicker()}
            >
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                size={18}
              />

              <Input
                ref={endDateRef}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10 h-12 rounded-xl cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
