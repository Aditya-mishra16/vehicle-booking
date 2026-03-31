"use client";

import { MapPin, Car, Headphones, Luggage } from "lucide-react";
import { motion } from "framer-motion";

/* ───────── EASING ───────── */
const ease = [0.22, 1, 0.36, 1];

/* ───────── VARIANTS ───────── */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.18 },
  },
};

const stepVariant = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

const lineVariant = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 1, ease },
  },
};

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
    <section className="pt-20 md:pt-10 pb-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* ───────── HEADING ───────── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <h2 className="text-4xl md:text-5xl font-semibold mb-6">
            Book Ride in <span className="text-brandColor">4 Easy Steps</span>
          </h2>

          <p className="text-gray-500 max-w-2xl mx-auto mb-16">
            A simple and transparent booking process designed to make intercity
            travel affordable, reliable, and stress-free.
          </p>
        </motion.div>

        {/* ───────── STEPS CONTAINER ───────── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="
            relative flex flex-col md:flex-row
            items-center justify-between
            gap-12 md:gap-0
          "
        >
          {/* ✅ DESKTOP LINE ONLY */}
          <motion.div
            variants={lineVariant}
            className="
              hidden md:block absolute top-14 left-0 right-0
              border-t border-dashed border-gray-300 origin-left
            "
          />

          {/* ───────── STEPS ───────── */}
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isHighlighted = step.highlight;

            return (
              <motion.div
                key={index}
                variants={stepVariant}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="
                  relative flex flex-col items-center text-center
                  w-full md:w-1/4
                "
              >
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, ease }}
                  className={`
                    relative z-10 w-24 h-24 md:w-28 md:h-28
                    rounded-2xl flex items-center justify-center
                    transition-all duration-300
                    ${
                      isHighlighted
                        ? "bg-brandColor text-white shadow-lg ring-4 ring-brandColor/20"
                        : "bg-white text-brandColor border border-gray-100 shadow-sm"
                    }
                  `}
                >
                  <Icon size={32} className="md:w-10 md:h-10" />
                </motion.div>

                {/* Title */}
                <h3 className="mt-5 text-base md:text-lg font-semibold">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm mt-2 max-w-[220px] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
