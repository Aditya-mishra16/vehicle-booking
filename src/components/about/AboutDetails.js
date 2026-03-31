"use client";

import { useRef, useState, useEffect } from "react";
import {
  ShieldCheck,
  Clock,
  Car,
  Headphones,
  ArrowUpRight,
} from "lucide-react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  animate,
} from "framer-motion";

// ── Counter ───────────────────────────────────────────────────────────────
function Counter({ from = 0, to, suffix = "", duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(from);
  useEffect(() => {
    if (!inView) return;
    const c = animate(from, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return c.stop;
  }, [inView]);
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

// ── FadeUp ────────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Word reveal ───────────────────────────────────────────────────────────
function RevealText({ text, className = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <span ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.03,
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

// ── Feature Card ──────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, number, delay }) {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);
  const [spotPos, setSpotPos] = useState({ x: 0, y: 0 });

  // 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-60, 60], [6, -6]), {
    stiffness: 260,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(x, [-60, 60], [-6, 6]), {
    stiffness: 260,
    damping: 28,
  });

  const onMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    setSpotPos({ x: cx, y: cy });
    x.set(cx - rect.width / 2);
    y.set(cy - rect.height / 2);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  const containerVariants = {
    rest: {},
    hover: { transition: { staggerChildren: 0.06 } },
  };
  const childVariants = {
    rest: { y: 0, opacity: 1 },
    hover: { y: -2, opacity: 1 },
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        // ✅ Single merged style object — fixes the duplicate style prop error
        style={{
          rotateX,
          rotateY,
          transformPerspective: 800,
          boxShadow: hovered
            ? "0 16px 48px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)"
            : "0 1px 4px rgba(0,0,0,0.04)",
          transition: "box-shadow 0.3s ease",
        }}
        animate={hovered ? "hover" : "rest"}
        variants={containerVariants}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.25 }}
        className="group relative bg-white border border-gray-100 rounded-2xl p-7 cursor-default overflow-hidden h-full"
      >
        {/* Spotlight */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: `radial-gradient(200px circle at ${spotPos.x}px ${spotPos.y}px, rgba(234,91,42,0.07), transparent 70%)`,
            }}
          />
        )}

        {/* Number */}
        <motion.div variants={childVariants} className="mb-5">
          <span className="text-xs font-medium text-gray-300 tracking-widest">
            {number}
          </span>
        </motion.div>

        {/* Icon */}
        <motion.div variants={childVariants} className="mb-5">
          <motion.div
            animate={
              hovered
                ? {
                    scale: 1.12,
                    rotate: -7,
                    backgroundColor: "#ea5b2a",
                    borderColor: "#ea5b2a",
                  }
                : {
                    scale: 1,
                    rotate: 0,
                    backgroundColor: "#f9fafb",
                    borderColor: "#f3f4f6",
                  }
            }
            transition={{ type: "spring", stiffness: 280, damping: 18 }}
            className="w-10 h-10 rounded-xl border flex items-center justify-center"
          >
            <Icon
              size={18}
              className={hovered ? "text-white" : "text-gray-700"}
              style={{ transition: "color 0.2s" }}
            />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h4
          variants={childVariants}
          className="font-semibold text-gray-900 text-base mb-2"
        >
          {title}
        </motion.h4>

        {/* Description */}
        <motion.p
          variants={childVariants}
          className="text-gray-500 text-sm leading-relaxed"
        >
          {desc}
        </motion.p>

        {/* Arrow */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
          transition={{ duration: 0.2 }}
          className="absolute top-6 right-6"
        >
          <ArrowUpRight size={15} className="text-brandColor" />
        </motion.div>

        {/* Bottom accent line */}
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

// ── Data ──────────────────────────────────────────────────────────────────
const features = [
  {
    icon: ShieldCheck,
    title: "Transparency",
    desc: "Clear pricing with no hidden charges.",
    number: "01",
  },
  {
    icon: Clock,
    title: "Reliability",
    desc: "On-time pickups and dependable service.",
    number: "02",
  },
  {
    icon: Car,
    title: "Comfort",
    desc: "Clean, well-maintained cars for smooth travel.",
    number: "03",
  },
  {
    icon: Headphones,
    title: "Customer First",
    desc: "Responsive support at every step.",
    number: "04",
  },
];

const stats = [
  { value: 5000, suffix: "+", label: "Happy Riders" },
  { value: 50, suffix: "+", label: "Cities Covered" },
  { value: 98, suffix: "%", label: "On-Time Rate" },
  { value: 247, suffix: "", label: "Support" },
];

// ── Main ──────────────────────────────────────────────────────────────────
export default function AboutDetails() {
  const imageRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.1, 1.05, 1.1],
  );

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* HEADING */}
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-gray-900 mt-1">
            <RevealText
              text="Transforming Long-Distance Travel into a"
              delay={0.05}
            />{" "}
            <RevealText
              text="Seamless"
              className="text-brandColor"
              delay={0.26}
            />{" "}
            <RevealText text="and" delay={0.32} />{" "}
            <RevealText
              text="Stress-Free Experience"
              className="text-brandColor"
              delay={0.36}
            />
          </h2>
          <FadeUp delay={0.4}>
            <p className="text-gray-400 mt-5 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              We're building a smarter, more affordable way to travel long
              distances — combining transparent pricing, reliable drivers, and
              seamless booking into one smooth experience.
            </p>
          </FadeUp>
        </div>

        {/* IMAGE */}
        <FadeUp delay={0.1} className="mb-16 md:mb-20">
          <div
            ref={imageRef}
            className="relative overflow-hidden rounded-3xl h-[240px] sm:h-[360px] md:h-[500px]"
          >
            <motion.img
              src="/images/AboutImage.jpg"
              alt="About Travel"
              style={{ y: imageY, scale: imageScale }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5"
            >
              <p className="text-[10px] text-gray-400 font-medium">
                Trusted by
              </p>
              <p className="text-sm font-bold text-gray-900">5,000+ Riders</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 bg-brandColor text-white rounded-xl px-4 py-2.5"
            >
              <p className="text-[10px] font-medium opacity-70">Covering</p>
              <p className="text-sm font-bold">50+ Cities</p>
            </motion.div>
          </div>
        </FadeUp>

        {/* STATS */}
        <FadeUp delay={0.1} className="mb-16 md:mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="flex flex-col items-center justify-center py-8 px-4 text-center bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-2xl sm:text-3xl font-black text-gray-900">
                  <Counter to={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </FadeUp>

        {/* MISSION */}
        <FadeUp delay={0.05} className="mb-4">
          <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">
            What Drives Us
          </span>
        </FadeUp>
        <FadeUp delay={0.1} className="mb-16 md:mb-20 max-w-4xl">
          <h3 className="text-2xl md:text-[2.2rem] font-semibold text-gray-900 leading-snug">
            We Exist to Simplify the Way People Travel by Road Through Clear
            Pricing, Seamless Booking, and Dependable Service
          </h3>
        </FadeUp>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
