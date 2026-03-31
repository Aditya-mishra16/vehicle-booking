"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/* ───────── SMOOTH ANIMATION ───────── */
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

export default function ImageBannerSection() {
  const router = useRouter();

  return (
    <section className="relative w-full py-28 md:py-36 text-white overflow-hidden">
      {/* ✅ BACKGROUND (soft zoom only) */}
      <motion.div
        initial={{ scale: 1.05 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute inset-0"
      >
        <img
          src="/images/SecondaryBannerImage.png"
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* ✅ CLEAN OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* CONTENT */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        {/* HEADING */}
        <motion.h2
          variants={fadeUp}
          className="text-4xl md:text-5xl font-light leading-tight mb-6"
        >
          Save big with fair fares for <br />
          <span className="font-semibold">long-distance travel.</span>
        </motion.h2>

        {/* SUBTEXT */}
        <motion.p
          variants={fadeUp}
          className="text-base md:text-lg text-white/80 mb-10 leading-relaxed max-w-2xl mx-auto"
        >
          Our fixed per-kilometer rates ensure you get affordable city-to-city
          rides without last-minute price jumps.
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeUp}>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={() => router.push("/book-cab")}
              className="
                bg-brandColor hover:bg-brandColor-hover
                text-white px-8 py-3 rounded-xl text-base
                flex items-center gap-2 mx-auto shadow-md
              "
            >
              Book Now
              <motion.span whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <ArrowRight size={18} />
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
