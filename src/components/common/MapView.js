"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ---------- Fix Marker Icons ---------- */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const fallbackCenter = [20.5937, 78.9629]; // India center

/* ---------- Auto Fit Route ---------- */

function FitBounds({ route }) {
  const map = useMap();

  useEffect(() => {
    if (route.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);

  return null;
}

/* ---------- Set View ---------- */

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
  const [currentLocation, setCurrentLocation] = useState(null);

  /* ---------- Get User Location ---------- */

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([latitude, longitude]);
      },
      () => {
        setCurrentLocation(fallbackCenter);
      },
      { enableHighAccuracy: true },
    );
  }, []);

  const center = currentLocation || fallbackCenter;

  /* ---------- Prevent Leaflet Container Reuse ---------- */

  const mapKey = route.length
    ? `${route[0].join("-")}-${route.at(-1).join("-")}`
    : center.join("-");

  return (
    <div className="relative z-0 h-full w-full">
      <MapContainer
        key={mapKey}
        center={center}
        zoom={5}
        scrollWheelZoom
        className="h-full w-full"
      >
        {/* Base Map */}
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Center map to user location */}
        {currentLocation && <SetView center={currentLocation} />}

        {/* User marker when no route */}
        {!route.length && currentLocation && (
          <Marker position={currentLocation} />
        )}

        {/* Route markers */}
        {markers.map((pos, index) => (
          <Marker key={index} position={pos} />
        ))}

        {/* Route line */}
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
