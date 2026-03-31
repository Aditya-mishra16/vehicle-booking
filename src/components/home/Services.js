"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/* ───────── ANIMATIONS ───────── */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

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
      icon: "/icons/technicalSupport.svg",
      title: "24/7 Technical Support",
      desc: "Have a question? Our team is available anytime to assist you.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* ───────── HEADING ───────── */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
          className="mb-16"
        >
          <motion.p variants={fadeUp} className="text-gray-500 text-sm mb-4">
            Why Choose Us
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-semibold leading-tight max-w-4xl"
          >
            We Offer the Best Experience with our{" "}
            <span className="text-brandColor">Booking Deals</span>
          </motion.h2>
        </motion.div>

        {/* ───────── CONTENT ───────── */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* LEFT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative w-full h-[420px]"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <Image
                src="/images/servicesCarImage.png"
                alt="Vehicle"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>

          {/* RIGHT FEATURES */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-10"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ x: 6 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-6 group"
              >
                {/* ICON */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="
                    w-14 h-14 rounded-xl bg-white shadow-sm
                    flex items-center justify-center
                    transition-all duration-200
                    group-hover:shadow-md
                  "
                >
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={28}
                    height={28}
                  />
                </motion.div>

                {/* TEXT */}
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
