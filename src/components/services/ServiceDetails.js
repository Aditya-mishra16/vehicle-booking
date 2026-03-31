"use client";

import { useRef, useState } from "react";
import { MapPin, Navigation, Clock } from "lucide-react";
import {
  motion,
  useInView,
  useSpring,
  useMotionValue,
  useTransform,
} from "framer-motion";

// ── Word reveal ───────────────────────────────────────────────────────────
function RevealText({ text, className = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <span ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────
function ServiceCard({ icon: Icon, title, description, number, delay }) {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);
  const [spotPos, setSpotPos] = useState({ x: 0, y: 0 });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-70, 70], [5, -5]), {
    stiffness: 260,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(mx, [-70, 70], [-5, 5]), {
    stiffness: 260,
    damping: 28,
  });

  const onMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    setSpotPos({ x: cx, y: cy });
    mx.set(cx - rect.width / 2);
    my.set(cy - rect.height / 2);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        style={{
          rotateX,
          rotateY,
          transformPerspective: 900,
          boxShadow: hovered
            ? "0 20px 52px rgba(0,0,0,0.10)"
            : "0 1px 4px rgba(0,0,0,0.05)",
        }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25 }}
        className="relative bg-white border border-gray-100 rounded-2xl p-7 cursor-default overflow-hidden h-full"
      >
        {/* Spotlight */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: `radial-gradient(180px circle at ${spotPos.x}px ${spotPos.y}px, rgba(234,91,42,0.06), transparent 70%)`,
            }}
          />
        )}

        {/* Number */}
        <motion.span
          animate={{ opacity: hovered ? 1 : 0.25 }}
          transition={{ duration: 0.2 }}
          className="absolute top-6 right-6 text-xs font-bold tracking-widest text-gray-300"
        >
          {number}
        </motion.span>

        {/* Icon */}
        <motion.div
          animate={
            hovered
              ? { scale: 1.1, rotate: -8, backgroundColor: "#ea5b2a" }
              : { scale: 1, rotate: 0, backgroundColor: "#f3f4f6" }
          }
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
        >
          <Icon
            size={19}
            className={hovered ? "text-white" : "text-gray-700"}
            style={{ transition: "color 0.2s" }}
          />
        </motion.div>

        {/* Title */}
        <motion.h3
          animate={hovered ? { x: 3 } : { x: 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-900 font-bold text-base mb-2"
        >
          {title}
        </motion.h3>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>

        {/* Bottom brand line */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-brandColor"
        />
      </motion.div>
    </motion.div>
  );
}

const services = [
  {
    icon: MapPin,
    title: "Intercity Travel",
    description:
      "Seamless rides between cities with fixed fares and reliable drivers.",
    number: "01",
  },
  {
    icon: Navigation,
    title: "City Rides",
    description: "Smooth everyday travel within the city, anytime you need.",
    number: "02",
  },
  {
    icon: Clock,
    title: "Hourly Rentals",
    description: "Flexible bookings for meetings, shopping, or multiple stops.",
    number: "03",
  },
];

export default function ServiceDetails() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-gray-900">
            <RevealText
              text="Smart, Affordable,"
              className="text-brandColor"
              delay={0.05}
            />{" "}
            <RevealText text="and Reliable" delay={0.22} />
            <br className="hidden sm:block" />
            <RevealText text="Road Travel Services" delay={0.34} />
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <ServiceCard key={s.title} {...s} delay={i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}
