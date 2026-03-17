"use client";

import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Clock, X } from "lucide-react";
import useLocationField from "@/hooks/useLocationField";
import { useEffect, useRef } from "react";

export default function PriceForm({
  pickup,
  drop,
  startDate,
  startTime,
  endDate,
  endTime,
  setStartDate,
  setStartTime,
  setEndDate,
  setEndTime,
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
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);

  useEffect(() => {
    if (pickup) pickupField.setValue(pickup);
  }, [pickup]);

  useEffect(() => {
    if (drop) dropField.setValue(drop);
  }, [drop]);

  return (
    <div className="bg-white text-black rounded-3xl p-10 space-y-8 shadow-2xl w-full">
      {/* ================= HEADER ================= */}
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
          <span className="text-brandColor">Book Outstation</span> Cabs at
          Affordable <span className="text-brandColor">Fares</span>
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed">
          Travel comfortably with transparent pricing, real-time route
          calculation, and flexible scheduling.
        </p>
      </div>

      <div className="border-t pt-6 space-y-6">
        {/* ================= TRIP TYPE ================= */}
        <div>
          <label className="text-sm font-medium text-gray-600">Trip Type</label>

          <div className="mt-2 flex bg-gray-100 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setTripType("oneway")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
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
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                tripType === "roundtrip"
                  ? "bg-brandColor text-white shadow-md"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Round Trip
            </button>
          </div>
        </div>

        {/* ================= PICKUP ================= */}
        <div className="relative" ref={pickupField.containerRef}>
          <label className="text-sm font-medium text-gray-600">
            Where from
          </label>

          <div className="relative mt-1">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />

            <Input
              value={pickupField.value}
              placeholder="Search city..."
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
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => {
                  pickupField.setValue("");
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
                  className="flex gap-3 p-4 hover:bg-gray-100 cursor-pointer border-b last:border-none"
                >
                  <MapPin size={18} />
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

        {/* ================= DROP ================= */}
        <div className="relative" ref={dropField.containerRef}>
          <label className="text-sm font-medium text-gray-600">Where to</label>

          <div className="relative mt-1">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => {
                  dropField.setValue("");
                  setDrop("");
                  setDropCoords(null);
                }}
              />
            )}
          </div>
        </div>

        {/* ================= DATE + TIME ================= */}

        <div className="space-y-4">
          {/* Start Date + Start Time */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div
              className="relative"
              onClick={() => startDateRef.current?.showPicker()}
            >
              <label className="text-sm font-medium text-gray-600">
                Start Date
              </label>

              <Calendar size={18} className="absolute left-3 top-[38px]" />

              <Input
                ref={startDateRef}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10 h-12 rounded-xl mt-1"
              />
            </div>

            {/* Start Time */}
            <div
              className="relative"
              onClick={() => startTimeRef.current?.showPicker()}
            >
              <label className="text-sm font-medium text-gray-600">
                Start Time
              </label>

              <Clock size={18} className="absolute left-3 top-[38px]" />

              <Input
                ref={startTimeRef}
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="pl-10 h-12 rounded-xl mt-1"
              />
            </div>
          </div>

          {/* Round Trip Row */}
          {tripType === "roundtrip" && (
            <div className="grid grid-cols-2 gap-4">
              {/* Return Date */}
              <div
                className="relative"
                onClick={() => endDateRef.current?.showPicker()}
              >
                <label className="text-sm font-medium text-gray-600">
                  Return Date
                </label>

                <Calendar size={18} className="absolute left-3 top-[38px]" />

                <Input
                  ref={endDateRef}
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 h-12 rounded-xl mt-1"
                />
              </div>

              {/* Return Time */}
              <div
                className="relative"
                onClick={() => endTimeRef.current?.showPicker()}
              >
                <label className="text-sm font-medium text-gray-600">
                  Return Time
                </label>

                <Clock size={18} className="absolute left-3 top-[38px]" />

                <Input
                  ref={endTimeRef}
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="pl-10 h-12 rounded-xl mt-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
