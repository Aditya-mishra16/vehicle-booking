"use client";

import Image from "next/image";

export default function ServicesSection() {
  const services = [
    {
      icon: "/icons/price.svg",
      title: "Best Price Guaranteed",
      desc: "No surge, no hidden charges — upfront fare breakdown.",
    },
    {
      icon: "/icons/drivers.svg",
      title: "Experienced Drivers",
      desc: "Professional drivers trained for safe long-distance travel.",
    },
    {
      icon: "/icons/comfortRide.svg",
      title: "Comfortable Rides",
      desc: "Well-maintained vehicles for smooth and comfortable rides.",
    },
    {
      icon: "/icons/TechnicalSupport.svg",
      title: "24/7 Technical Support",
      desc: "Have a question? Our team is available anytime to assist you.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="mb-16">
          <p className="text-gray-500 text-sm mb-4">Why Choose Us</p>

          <h2 className="text-4xl md:text-5xl font-semibold leading-tight max-w-4xl">
            We Offer the Best Experience with our{" "}
            <span className="text-brandColor">Booking Deals</span>
          </h2>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-0 md:gap-16 items-center">
          {/* Left Image */}
          <div className="relative w-full h-[420px]">
            <Image
              src="/images/servicesCarImage.png"
              alt="Vehicle"
              fill
              className="object-contain"
            />
          </div>

          {/* Right Features */}
          <div className="space-y-10">
            {services.map((service, index) => (
              <div key={index} className="flex items-start gap-6">
                {/* Icon Box */}
                <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={28}
                    height={28}
                  />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
