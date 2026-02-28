"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("../common/MapView"), {
  ssr: false,
});

export default function RouteMapSection({ route, markers }) {
  return (
    <div className="rounded-3xl overflow-hidden shadow-lg border h-[620px]">
      <MapView route={route} markers={markers} />
    </div>
  );
}
