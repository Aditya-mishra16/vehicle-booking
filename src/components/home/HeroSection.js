"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Calendar,
  Locate,
  ArrowRight,
  ArrowLeftRight,
  Clock,
} from "lucide-react";
import { useTripStore } from "@/store/tripStore";
import useLocationField from "@/hooks/useLocationField";
import axios from "axios";
import { useState, useRef } from "react";
import { toast } from "sonner";

export default function HeroSection() {
  const router = useRouter();

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);

  const { setTrip } = useTripStore();

  const pickup = useLocationField();
  const drop = useLocationField();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [tripType, setTripType] = useState("oneway");

  const handleSwapLocations = () => {
    const tempValue = pickup.value;
    const tempCoords = pickup.coords;

    pickup.setValue(drop.value);
    pickup.setCoords(drop.coords);

    drop.setValue(tempValue);
    drop.setCoords(tempCoords);
  };

  const handleSeePrices = () => {
    if (!pickup.value || !drop.value) {
      toast.warning("Pickup or drop location missing");
    }

    if (!startDate || !startTime) {
      toast.warning("Pickup date/time missing");
    }

    if (tripType === "roundtrip" && (!endDate || !endTime)) {
      toast.warning("Return details missing");
    }
    setTrip({
      pickup: pickup.value,
      drop: drop.value,
      pickupCoords: pickup.coords,
      dropCoords: drop.coords,
      startDate,
      startTime,
      endDate,
      endTime,
      tripType,
    });

    router.push("/book-cab");
  };

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const res = await axios.get(
        `/api/geo?type=reverse&lat=${latitude}&lon=${longitude}`,
      );

      const label =
        res.data.features?.[0]?.properties?.label || "Current location";

      pickup.selectLocation({
        properties: { label },
        geometry: { coordinates: [longitude, latitude] },
      });
    });
  };

  return (
    <>
      <section
        className="relative h-[680px] sm:h-[780px] md:h-[650px] flex items-start md:items-end pt-32 md:pt-0"
        style={{
          backgroundImage: "url('/images/HeroSectionBgImage.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />

        {/* HERO TITLE */}
        <div className="hidden md:flex absolute inset-0 z-10 items-center justify-center pointer-events-none">
          <div className="text-center text-white max-w-5xl px-6">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Fixed fares, reliable rides, and
              <br />a smoother way to travel between cities.
            </h1>

            <div className="flex justify-center gap-10 text-base text-gray-200 mt-6">
              <div>✓ No Hidden Charges</div>
              <div>✓ Verified Drivers</div>
              <div>✓ Direct Human Support</div>
            </div>
          </div>
        </div>

        {/* SEARCH CARD */}

        <div className="relative z-10 w-full max-w-md md:max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-white rounded-3xl shadow-2xl px-5 md:px-10 pt-16 pb-8 md:translate-y-1/2">
            {/* Trip Type */}
            <div className="absolute left-1/2 -top-6 -translate-x-1/2 z-20 w-full flex justify-center">
              <div className="flex w-auto bg-white border border-gray-300 rounded-full p-1 shadow-lg">
                {["oneway", "roundtrip"].map((type) => {
                  const isActive = tripType === type;

                  return (
                    <button
                      key={type}
                      onClick={() => setTripType(type)}
                      className={`px-8 py-2 rounded-full text-base font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-brandColor text-white shadow-md"
                          : "text-black"
                      }`}
                    >
                      {type === "oneway" ? "One-Way" : "Round-Trip"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* INPUTS */}

            <div className="flex flex-col md:flex-row gap-4">
              {/* Pickup */}

              <div className="relative flex-1" ref={pickup.containerRef}>
                <span className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-500">
                  Pickup
                </span>

                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />

                <Input
                  value={pickup.value}
                  placeholder="Where from"
                  onFocus={() => pickup.setFocused(true)}
                  onChange={(e) => {
                    pickup.setValue(e.target.value);
                    pickup.setCoords(null);
                  }}
                  className="pl-12 h-14 rounded-xl"
                />

                {/* Suggestions */}
                {pickup.focused && pickup.suggestions.length > 0 && (
                  <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border max-h-60 overflow-y-auto">
                    <div
                      onMouseDown={handleUseCurrentLocation}
                      className="flex items-center gap-3 p-4 border-b hover:bg-gray-100 cursor-pointer"
                    >
                      <Locate size={18} />
                      <span className="text-sm font-medium">
                        Use current location
                      </span>
                    </div>

                    {pickup.suggestions.map((item, index) => (
                      <div
                        key={index}
                        onMouseDown={() => pickup.selectLocation(item)}
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

              {/* Swap */}

              <button
                onClick={handleSwapLocations}
                className="h-12 w-12 rounded-full border flex items-center justify-center self-center md:self-auto rotate-90 md:rotate-0"
              >
                <ArrowLeftRight size={18} />
              </button>

              {/* Drop */}

              <div className="relative flex-1" ref={drop.containerRef}>
                <span className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-500">
                  Drop
                </span>

                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />

                <Input
                  value={drop.value}
                  placeholder="Where to"
                  onFocus={() => drop.setFocused(true)}
                  onChange={(e) => {
                    drop.setValue(e.target.value);
                    drop.setCoords(null);
                  }}
                  className="pl-12 h-14 rounded-xl"
                />

                {drop.focused && drop.suggestions.length > 0 && (
                  <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border max-h-60 overflow-y-auto">
                    {drop.suggestions.map((item, index) => (
                      <div
                        key={index}
                        onMouseDown={() => drop.selectLocation(item)}
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

              {/* Pickup Date + Time */}

              <div className="flex gap-3 w-full md:w-auto">
                <div
                  className="relative w-full md:w-52"
                  onClick={() => startDateRef.current?.showPicker()}
                >
                  <span className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-500">
                    Pickup Date
                  </span>

                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
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
                  className="relative w-full md:w-40"
                  onClick={() => startTimeRef.current?.showPicker()}
                >
                  <span className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-500">
                    Pickup Time
                  </span>

                  <Clock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
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

              {/* Round Trip */}

              {tripType === "roundtrip" && (
                <div className="flex gap-3 w-full md:w-auto">
                  <div
                    className="relative w-full md:w-52"
                    onClick={() => endDateRef.current?.showPicker()}
                  >
                    <span className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-500">
                      Return Date
                    </span>

                    <Calendar
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                      size={18}
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
                    className="relative w-full md:w-40"
                    onClick={() => endTimeRef.current?.showPicker()}
                  >
                    <span className="absolute -top-2 left-4 bg-white px-1 text-xs text-gray-500">
                      Return Time
                    </span>

                    <Clock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                      size={18}
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

            {/* Button */}

            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleSeePrices}
                className="bg-black hover:bg-gray-900 text-white px-14 py-4 rounded-xl text-lg flex items-center gap-3"
              >
                See Prices <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="hidden md:block h-48" />
    </>
  );
}
