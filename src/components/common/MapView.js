"use client";

import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ---------- MARKERS ---------- */

// 🔵 Default Leaflet blue marker (START)
const startIcon = new L.Icon({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 🔴 Red marker (END)
const endIcon = new L.Icon({
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* ---------- FIT BOUNDS ---------- */

function FitBounds({ route }) {
  const map = useMap();

  useEffect(() => {
    if (route?.length > 1) {
      map.fitBounds(L.latLngBounds(route), { padding: [60, 60] });
    }
  }, [route, map]);

  return null;
}

/* ---------- SMOOTH ROUTE ANIMATION ---------- */

function AnimatedRoute({ route }) {
  const [visiblePoints, setVisiblePoints] = useState([]);
  const frameRef = useRef();

  useEffect(() => {
    if (!route || route.length < 2) return;

    let start = null;
    const duration = 2000;

    const animate = (time) => {
      if (!start) start = time;

      const progress = Math.min((time - start) / duration, 1);
      const count = Math.max(2, Math.floor(progress * route.length));

      setVisiblePoints(route.slice(0, count));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, [route]);

  return (
    <>
      <Polyline
        positions={visiblePoints}
        color="#000"
        weight={3}
        opacity={0.9}
      />

      <Marker position={route[0]} icon={startIcon} />
      <Marker position={route[route.length - 1]} icon={endIcon} />
    </>
  );
}

/* ---------- MAIN ---------- */

const fallbackCenter = [20.5937, 78.9629];

export default function MapView({ route = [] }) {
  const [center, setCenter] = useState(fallbackCenter);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
      () => setCenter(fallbackCenter),
    );
  }, []);

  return (
    // ✅ ONLY CHANGE HERE
    <div className="relative z-0 h-full w-full rounded-3xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom
        className="h-full w-full"
        style={{ zIndex: 0 }} // ✅ IMPORTANT FIX
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {route.length > 1 && (
          <>
            <AnimatedRoute route={route} />
            <FitBounds route={route} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
