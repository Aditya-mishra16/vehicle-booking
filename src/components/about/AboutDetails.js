"use client";

import { ShieldCheck, Clock, Car, Headphones } from "lucide-react";

export default function AboutDetails() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Top Heading */}
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Transforming Long-Distance Travel into a{" "}
            <span className="text-brandColor">Seamless</span> and{" "}
            <span className="text-brandColor">Stress-Free</span> Experience
          </h2>

          <p className="text-gray-500 mt-6 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
            We’re building a smarter, more affordable way to travel long
            distances — combining transparent pricing, reliable drivers, and
            seamless booking into one smooth experience.
          </p>
        </div>

        {/* Large Image */}
        <div className="mb-20">
          <img
            src="/images/AboutImage.jpg"
            alt="About Travel"
            className="w-full rounded-3xl object-cover"
          />
        </div>

        {/* What Drives Us Tag */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-wide border px-4 py-1 rounded-full">
            What Drives Us
          </span>
        </div>

        {/* Mission Statement */}
        <div className="mb-16 md:mb-20 max-w-4xl">
          <h3 className="text-2xl md:text-4xl font-semibold leading-tight">
            We Exist to Simplify the Way People Travel by Road Through Clear
            Pricing, Seamless Booking, and Dependable Service
          </h3>
        </div>

        {/* Bottom Feature Cards */}
        <div className="relative mt-20">
          <div className="flex flex-wrap justify-center md:justify-between gap-6">
            {/* Transparency */}
            <div className="bg-gray-50 rounded-2xl p-6 w-full sm:w-[48%] md:w-[22%] shadow-sm">
              <ShieldCheck className="text-black mb-4" size={20} />
              <h4 className="font-semibold mb-2 text-base">Transparency</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Clear pricing with no hidden charges.
              </p>
            </div>

            {/* Reliability (slightly lifted) */}
            <div className="bg-gray-50 rounded-2xl p-6 w-full sm:w-[48%] md:w-[22%] shadow-sm md:-mt-6">
              <Clock className="text-black mb-4" size={20} />
              <h4 className="font-semibold mb-2 text-base">Reliability</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                On-time pickups and dependable service.
              </p>
            </div>

            {/* Comfort (slightly lifted more) */}
            <div className="bg-gray-50 rounded-2xl p-6 w-full sm:w-[48%] md:w-[22%] shadow-sm md:-mt-10">
              <Car className="text-black mb-4" size={20} />
              <h4 className="font-semibold mb-2 text-base">Comfort</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Clean, well-maintained cars for smooth travel.
              </p>
            </div>

            {/* Customer First */}
            <div className="bg-gray-50 rounded-2xl p-6 w-full sm:w-[48%] md:w-[22%] shadow-sm">
              <Headphones className="text-black mb-4" size={20} />
              <h4 className="font-semibold mb-2 text-base">Customer First</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Responsive support at every step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
