"use client";

import { BookOpen } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import DriverRegistrationModal from "@/components/jobs/DriverRegistrationModal";
import { useState } from "react";
import { motion } from "framer-motion";

/* ───────── PREMIUM EASING ───────── */
const ease = [0.22, 1, 0.36, 1];

/* ───────── VARIANTS ───────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

export default function JobDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* ───────── TOP SECTION ───────── */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          {/* LEFT */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.h2
              variants={fadeLeft}
              className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight"
            >
              <span className="text-brandColor">Drive With Us</span> & Earn More
              <br className="hidden md:block" />
              on Every Trip
            </motion.h2>

            <motion.p
              variants={fadeLeft}
              className="text-gray-500 mt-6 max-w-lg leading-relaxed"
            >
              Join our growing driver network and enjoy fair payouts, flexible
              schedules, and consistent long-distance bookings designed to
              maximize your earnings.
            </motion.p>

            {/* ✅ FIXED BUTTON (NO VARIANT → NO FLICKER) */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{ willChange: "transform, opacity" }}
              onClick={() => setIsModalOpen(true)}
              className="mt-8 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition shadow-md"
            >
              Register as a Driver →
            </motion.button>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="flex justify-center md:justify-end"
          >
            <motion.img
              src="/images/JobsBanner.jpg"
              alt="Driver"
              className="rounded-2xl object-cover max-h-[420px] shadow-xl"
              initial={{ scale: 1.05, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease }}
            />
          </motion.div>
        </div>

        {/* ───────── MIDDLE SECTION ───────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-16"
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
            More Earnings. More Freedom. More Support.
          </h3>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
            Our goal is simple: help drivers earn more with transparent payouts,
            better trip opportunities, and reliable assistance whenever needed.
          </p>
        </motion.div>

        {/* ───────── CARDS ───────── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-28"
        >
          {[
            {
              title: "Higher Earnings",
              desc: "Keep more of what you earn with fair commission structures and transparent payouts on every trip.",
            },
            {
              title: "Long-Distance Focus",
              desc: "Get access to better-paying long-route rides instead of relying only on short, low-fare city trips.",
            },
            {
              title: "Flexible Schedule",
              desc: "Choose your own working hours and drive whenever it fits your lifestyle and availability.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="group bg-white rounded-3xl p-10 text-center border border-gray-200 hover:shadow-lg transition"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brandColor/20 flex items-center justify-center group-hover:bg-brandColor/30 transition">
                <BookOpen className="text-brandColor" size={24} />
              </div>

              <h4 className="text-lg font-semibold mb-3">{item.title}</h4>

              <p className="text-gray-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ───────── CONTACT ───────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl sm:text-4xl font-semibold">
            <span className="text-brandColor">Need Help?</span> Talk to Us
          </h3>

          <p className="text-gray-500 mt-4">
            If you have any questions please get in touch.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="bg-gray-50 rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2"
        >
          <motion.div variants={fadeLeft} className="hidden md:block">
            <motion.img
              src="/images/contactImage.png"
              alt="Contact"
              className="w-full h-full object-cover"
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1, ease }}
            />
          </motion.div>

          <motion.div variants={fadeRight} className="p-6 sm:p-8 md:p-12">
            <ContactForm />
          </motion.div>
        </motion.div>
      </div>

      <DriverRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
