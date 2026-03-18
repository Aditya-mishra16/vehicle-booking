"use client";

import { BookOpen } from "lucide-react";

export default function ServiceDetails() {
  const services = [
    {
      title: "Intercity Travel",
      description:
        "Seamless rides between cities with comfort and reliability.",
    },
    {
      title: "City Rides",
      description: "Smooth everyday travel within the city, anytime you need.",
    },
    {
      title: "Hourly Rentals",
      description:
        "Flexible bookings for meetings, shopping, or multiple stops.",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            <span className="text-brandColor">Smart, Affordable,</span> and{" "}
            <span className="text-brandColor">Reliable</span>{" "}
            <br className="hidden md:block" />
            Road Travel Services
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="
                bg-gray-50
                rounded-3xl
                p-10
                text-center
                hover:shadow-lg
                transition-all
                duration-300
              "
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brandColor flex items-center justify-center">
                <BookOpen className="text-white" size={26} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-4 text-black">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-base leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
