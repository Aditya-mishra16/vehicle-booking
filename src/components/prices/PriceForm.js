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
      <div className="flex bg-gray-100 rounded-full p-1">
        <button
          onClick={() => setTripType("oneway")}
          className={`flex-1 py-2 rounded-full text-sm font-medium ${
            tripType === "oneway" ? "bg-brandColor text-white" : "text-gray-600"
          }`}
        >
          One Way
        </button>

        <button
          onClick={() => setTripType("roundtrip")}
          className={`flex-1 py-2 rounded-full text-sm font-medium ${
            tripType === "roundtrip"
              ? "bg-brandColor text-white"
              : "text-gray-600"
          }`}
        >
          Round Trip
        </button>
      </div>

      {/* PICKUP */}
      <div className="relative" ref={pickupField.containerRef}>
        <span className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-500">
          Pickup
        </span>

        <MapPin
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <Input
          value={pickupField.value}
          placeholder="Where from"
          onFocus={() => pickupField.setFocused(true)}
          onChange={(e) => {
            pickupField.setValue(e.target.value);
            pickupField.setCoords(null);
            setPickup(e.target.value);
            setPickupCoords(null);
          }}
          className="pl-12 pr-10 h-14 rounded-xl"
        />

        {pickupField.value && (
          <X
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => {
              pickupField.setValue("");
              pickupField.setCoords(null);
              setPickup("");
              setPickupCoords(null);
            }}
          />
        )}

        {/* Suggestions */}
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
                <MapPin size={18} className="mt-1" />
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

      {/* SWAP */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={swapLocations}
          className="h-12 w-12 rounded-full border flex items-center justify-center"
        >
          <ArrowUpDown size={18} />
        </button>
      </div>

      {/* DROP */}
      <div className="relative" ref={dropField.containerRef}>
        <span className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-500">
          Drop
        </span>

        <MapPin
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <Input
          value={dropField.value}
          placeholder="Where to"
          onFocus={() => dropField.setFocused(true)}
          onChange={(e) => {
            dropField.setValue(e.target.value);
            dropField.setCoords(null);
            setDrop(e.target.value);
            setDropCoords(null);
          }}
          className="pl-12 pr-10 h-14 rounded-xl"
        />

        {dropField.value && (
          <X
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => {
              dropField.setValue("");
              dropField.setCoords(null);
              setDrop("");
              setDropCoords(null);
            }}
          />
        )}

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
                <MapPin size={18} className="mt-1" />
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

      {/* PICKUP DATE + TIME */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="relative"
          onClick={() => startDateRef.current?.showPicker()}
        >
          <span className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-500">
            Pickup Date
          </span>

          <Calendar
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <Input
            ref={startDateRef}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="pl-12 h-14 rounded-xl cursor-pointer"
          />
        </div>

        <div
          className="relative"
          onClick={() => startTimeRef.current?.showPicker()}
        >
          <span className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-500">
            Pickup Time
          </span>

          <Clock
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <Input
            ref={startTimeRef}
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="pl-12 h-14 rounded-xl cursor-pointer"
          />
        </div>
      </div>

      {/* RETURN DATE + TIME */}
      {tripType === "roundtrip" && (
        <div className="grid grid-cols-2 gap-4">
          <div
            className="relative"
            onClick={() => endDateRef.current?.showPicker()}
          >
            <span className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-500">
              Return Date
            </span>

            <Calendar
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <Input
              ref={endDateRef}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-12 h-14 rounded-xl cursor-pointer"
            />
          </div>

          <div
            className="relative"
            onClick={() => endTimeRef.current?.showPicker()}
          >
            <span className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-500">
              Return Time
            </span>

            <Clock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <Input
              ref={endTimeRef}
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="pl-12 h-14 rounded-xl cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
