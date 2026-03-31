"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

/* ───────── SMOOTH EASING ───────── */
const ease = [0.22, 1, 0.36, 1];

export default function TestimonialsSection() {
  const scrollRef = useRef(null);

  const testimonials = [
    {
      name: "Nameeee Name",
      location: "Pune, India",
      text: "Add your pickup and drop locations to instantly see the estimated fare for your intercity journey.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Nameeee Name",
      location: "Pune, India",
      text: "Add your pickup and drop locations to instantly see the estimated fare for your intercity journey.",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      name: "Rahul Sharma",
      location: "Mumbai, India",
      text: "Booking was seamless and pricing was completely transparent.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  ];

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -600 : 600,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* ───────── HEADING (SCROLL ANIMATION) ───────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold mb-4">
            What Our <span className="text-brandColor">Customers</span> Say
          </h2>
          <p className="text-gray-500 text-lg">
            Hear from people who made the smarter choice for intercity travel.
          </p>
        </motion.div>

        {/* ───────── ARROWS (UNCHANGED) ───────── */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-6 top-[60%] hidden md:flex"
        >
          <ChevronLeft className="w-6 h-6 text-gray-400 hover:text-black transition" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-6 top-[60%] hidden md:flex"
        >
          <ChevronRight className="w-6 h-6 text-gray-400 hover:text-black transition" />
        </button>

        {/* ───────── CONTAINER (SCROLL ANIMATION) ───────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          viewport={{ once: true, margin: "-60px" }}
        >
          <div
            ref={scrollRef}
            className="
              flex gap-6 md:gap-12
              overflow-x-auto
              scroll-smooth
              snap-x snap-mandatory
              pb-4
              md:no-scrollbar
            "
          >
            {testimonials.map((t, index) => (
              <div
                key={index}
                className="
                  min-w-[85%] md:min-w-[540px]
                  max-w-[85%] md:max-w-[540px]
                  snap-start
                  bg-gray-50
                  rounded-3xl
                  p-8 md:p-12
                  relative
                  shadow-sm
                  transition-transform duration-200 hover:-translate-y-1
                "
              >
                {/* TEXT */}
                <p className="text-base md:text-lg leading-relaxed mb-8 md:mb-10 text-gray-800">
                  “{t.text}”
                </p>

                {/* USER */}
                <div className="flex items-center gap-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover"
                  />

                  <div>
                    <h4 className="font-semibold text-sm md:text-base">
                      {t.name}
                    </h4>
                    <p className="text-gray-500 text-xs md:text-sm">
                      {t.location}
                    </p>
                  </div>
                </div>

                {/* QUOTE */}
                <div className="absolute bottom-4 right-6 md:bottom-6 md:right-8 text-5xl md:text-6xl text-brandColor opacity-90">
                  ”
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
