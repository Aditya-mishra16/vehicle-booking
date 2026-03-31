"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

/* ───────── SMOOTH EASING ───────── */
const ease = [0.22, 1, 0.36, 1];

/* ───────── VARIANTS ───────── */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

export default function CTASection() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const defaultMessage =
    "Hi, I couldn’t find the route I was looking for. Can you help?";

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    defaultMessage,
  )}`;

  return (
    <section className="py-16">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-4xl mx-auto px-6 text-center"
      >
        {/* ───────── HEADING ───────── */}
        <motion.h2
          variants={item}
          className="text-4xl md:text-5xl font-semibold leading-tight mb-6"
        >
          Didn’t find what <br />
          you’re <span className="text-brandColor">looking for?</span>
        </motion.h2>

        {/* ───────── SUBTEXT ───────── */}
        <motion.p variants={item} className="text-gray-500 text-lg mb-10">
          Send your questions and we’ll respond shortly.
        </motion.p>

        {/* ───────── BUTTON ───────── */}
        <motion.div variants={item}>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <Button className="bg-black hover:bg-brandColor text-white px-8 py-4 rounded-xl text-base flex items-center gap-2 mx-auto transition-all duration-300">
                Ask on WhatsApp <ArrowRight size={18} />
              </Button>
            </motion.div>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
