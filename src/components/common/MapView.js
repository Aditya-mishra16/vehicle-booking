"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const fallbackCenter = [20.5937, 78.9629]; // India center

/* ---------------- Fit Bounds ---------------- */
function FitBounds({ route }) {
  const map = useMap();

  useEffect(() => {
    if (route.length > 0) {
      map.fitBounds(L.latLngBounds(route), { padding: [50, 50] });
    }
  }, [route, map]);

  return null;
}

/* ---------------- Set Center Dynamically ---------------- */
function SetView({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);

  return null;
}

export default function MapView({ route = [], markers = [] }) {
  const mapRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  /* ---------------- Get Current Location ---------------- */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([latitude, longitude]);
      },
      () => {
        // If denied, fallback
        setCurrentLocation(fallbackCenter);
      },
      { enableHighAccuracy: true },
    );
  }, []);

  /* ---------------- Cleanup ---------------- */
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const center = currentLocation || fallbackCenter;

  return (
    <div className="relative z-0 h-full w-full">
      <MapContainer
        center={center}
        zoom={5}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
        className="h-full w-full"
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🔥 Auto center to user location */}
        {currentLocation && <SetView center={currentLocation} />}

        {/* 🔥 Current location marker (only if no route yet) */}
        {!route.length && currentLocation && (
          <Marker position={currentLocation} />
        )}

        {/* 🔥 Route markers */}
        {markers.map((position, index) => (
          <Marker key={index} position={position} />
        ))}

        {/* 🔥 Route Polyline */}
        {route.length > 0 && (
          <>
            <Polyline positions={route} color="black" weight={6} />
            <FitBounds route={route} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
