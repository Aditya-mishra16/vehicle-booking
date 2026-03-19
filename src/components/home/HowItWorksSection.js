"use client";

import { MapPin, Car, Headphones, Luggage } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "Enter Trip Details",
    description:
      "Add pickup & drop locations, select trip type, date, and time",
  },
  {
    icon: Car,
    title: "Choose Your Vehicle",
    description: "Browse and select the vehicle that best suits your journey",
  },
  {
    icon: Luggage,
    title: "Review Fare Estimate",
    description:
      "View transparent pricing based on distance and vehicle selection",
    highlight: true,
  },
  {
    icon: Headphones,
    title: "Confirm Your Booking",
    description:
      "Enter your details and our team will assist you with confirmation",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="pt-20 md:pt-10 pb-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-semibold mb-6">
          Book Ride in <span className="text-brandColor">4 Easy Steps</span>
        </h2>

        <p className="text-gray-500 max-w-2xl mx-auto mb-16">
          A simple and transparent booking process designed to make intercity
          travel affordable, reliable, and stress-free.
        </p>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0">
          {/* Dashed Line */}
          <div className="hidden md:block absolute top-14 left-0 right-0 border-t border-dashed border-gray-300" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isHighlighted = step.highlight;

            return (
              <div
                key={index}
                className="relative flex flex-col items-center text-center w-full md:w-1/4 transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Icon Box */}
                <div
                  className={`relative z-10 w-28 h-28 rounded-2xl flex items-center justify-center transition-all duration-300
                    ${
                      isHighlighted
                        ? "bg-brandColor text-white shadow-lg ring-4 ring-brandColor/20"
                        : "bg-white text-brandColor border border-gray-100 shadow-sm"
                    }
                  `}
                >
                  <Icon size={40} />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>

                {/* Description */}
                <p className="text-gray-500 text-sm mt-2 max-w-[220px] leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
