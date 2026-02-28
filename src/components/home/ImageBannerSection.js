"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImageBannerSection() {
  return (
    <section
      className="relative w-full py-32 text-white"
      style={{
        backgroundImage: "url('/images/SecondaryBannerImage.png')", // <-- your PNG here
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-light leading-tight mb-8">
          Save big with fair fares for <br />
          <span className="font-semibold">long-distance travel.</span>
        </h2>

        <p className="text-lg text-white/80 mb-10 leading-relaxed">
          Our fixed per-kilometer rates ensure you get affordable city-to-city
          rides without last-minute price jumps.
        </p>

        <Button className="bg-brandColor hover:bg-brandColor-hover text-white px-8 py-3 rounded-xl text-base flex items-center gap-2 mx-auto">
          Book Now <ArrowRight size={18} />
        </Button>
      </div>
    </section>
  );
}
