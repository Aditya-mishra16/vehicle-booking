"use client";

import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Clock, X, ArrowUpDown } from "lucide-react";
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

  /* ---------- SWAP LOCATION ---------- */

  const swapLocations = () => {
    const tempLocation = pickupField.value;
    const tempCoords = pickupField.coords;

    pickupField.setValue(dropField.value);
    pickupField.setCoords(dropField.coords);

    dropField.setValue(tempLocation);
    dropField.setCoords(tempCoords);

    setPickup(dropField.value);
    setPickupCoords(dropField.coords);

    setDrop(tempLocation);
    setDropCoords(tempCoords);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold">Ride Details</h3>

      {/* TRIP TYPE */}
      <div>
        <label className="text-sm text-gray-600">Trip Type</label>

        <div className="mt-2 flex bg-gray-100 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setTripType("oneway")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              tripType === "oneway"
                ? "bg-brandColor text-white"
                : "text-gray-600"
            }`}
          >
            One Way
          </button>

          <button
            type="button"
            onClick={() => setTripType("roundtrip")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              tripType === "roundtrip"
                ? "bg-brandColor text-white"
                : "text-gray-600"
            }`}
          >
            Round Trip
          </button>
        </div>
      </div>

      {/* PICKUP */}
      <div className="relative" ref={pickupField.containerRef}>
        <label className="text-sm text-gray-600">Where from</label>

        <div className="relative mt-1">
          <MapPin
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
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
                pickupField.setCoords(null);
                setPickup("");
                setPickupCoords(null);
              }}
            />
          )}
        </div>

        {/* PICKUP SUGGESTIONS */}
        {pickupField.focused && pickupField.suggestions.length > 0 && (
          <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-lg border max-h-60 overflow-y-auto">
            {pickupField.suggestions.map((item, index) => (
              <div
                key={index}
                onMouseDown={() => {
                  pickupField.selectLocation(item);
                  setPickup(item.properties.label);
                  setPickupCoords(item.geometry.coordinates);
                }}
                className="flex gap-3 p-3 hover:bg-gray-100 cursor-pointer"
              >
                <MapPin size={16} />
                <div>
                  <p className="text-sm font-medium">
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

      {/* SWAP */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={swapLocations}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <ArrowUpDown size={16} />
        </button>
      </div>

      {/* DROP */}
      <div className="relative" ref={dropField.containerRef}>
        <label className="text-sm text-gray-600">Where to</label>

        <div className="relative mt-1">
          <MapPin
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
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
                dropField.setCoords(null);
                setDrop("");
                setDropCoords(null);
              }}
            />
          )}
        </div>

        {/* DROP SUGGESTIONS */}
        {dropField.focused && dropField.suggestions.length > 0 && (
          <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-lg border max-h-60 overflow-y-auto">
            {dropField.suggestions.map((item, index) => (
              <div
                key={index}
                onMouseDown={() => {
                  dropField.selectLocation(item);
                  setDrop(item.properties.label);
                  setDropCoords(item.geometry.coordinates);
                }}
                className="flex gap-3 p-3 hover:bg-gray-100 cursor-pointer"
              >
                <MapPin size={16} />
                <div>
                  <p className="text-sm font-medium">
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

      {/* START DATE + TIME */}
      <div className="grid grid-cols-2 gap-4">
        {/* START DATE */}
        <div onClick={() => startDateRef.current?.showPicker()}>
          <label className="text-sm text-gray-600">Start Date</label>

          <div className="relative mt-1">
            <Calendar
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />

            <Input
              ref={startDateRef}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-10 h-12 rounded-xl"
            />
          </div>
        </div>

        {/* START TIME */}
        <div onClick={() => startTimeRef.current?.showPicker()}>
          <label className="text-sm text-gray-600">Start Time</label>

          <div className="relative mt-1">
            <Clock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />

            <Input
              ref={startTimeRef}
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="pl-10 h-12 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* RETURN DATE + TIME */}
      {tripType === "roundtrip" && (
        <div className="grid grid-cols-2 gap-4">
          {/* RETURN DATE */}
          <div onClick={() => endDateRef.current?.showPicker()}>
            <label className="text-sm text-gray-600">Return Date</label>

            <div className="relative mt-1">
              <Calendar
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />

              <Input
                ref={endDateRef}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10 h-12 rounded-xl"
              />
            </div>
          </div>

          {/* RETURN TIME */}
          <div onClick={() => endTimeRef.current?.showPicker()}>
            <label className="text-sm text-gray-600">Return Time</label>

            <div className="relative mt-1">
              <Clock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />

              <Input
                ref={endTimeRef}
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="pl-10 h-12 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
