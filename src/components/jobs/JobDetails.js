"use client";

import { BookOpen } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import DriverRegistrationModal from "@/components/jobs/DriverRegistrationModal";
import { useState } from "react";

export default function JobDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* ================= TOP SECTION ================= */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
              <span className="text-brandColor">Drive With Us</span> & Earn More
              <br className="hidden md:block" />
              on Every Trip
            </h2>

            <p className="text-gray-500 mt-6 max-w-lg leading-relaxed">
              Join our growing driver network and enjoy fair payouts, flexible
              schedules, and consistent long-distance bookings designed to
              maximize your earnings.
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-8 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Register as a Driver →
            </button>
          </div>

          {/* Right Image */}
          <div className="flex justify-center md:justify-end">
            <img
              src="/images/JobsBanner.jpg"
              alt="Driver"
              className="rounded-2xl object-cover max-h-[420px]"
            />
          </div>
        </div>

        {/* ================= MIDDLE SECTION ================= */}
        <div className="text-center mb-16">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
            More Earnings. More Freedom. More Support.
          </h3>

          <p className="text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
            Our goal is simple: help drivers earn more with transparent payouts,
            better trip opportunities, and reliable assistance whenever needed.
          </p>
        </div>

        {/* ================= CARDS SECTION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-28">
          {/* Card 1 */}
          <div className="group bg-white rounded-3xl p-10 text-center border border-gray-200 transition-all duration-300 hover:bg-gray-50 hover:shadow-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brandColor/20 flex items-center justify-center transition duration-300 group-hover:bg-brandColor/30">
              <BookOpen className="text-brandColor" size={24} />
            </div>

            <h4 className="text-lg font-semibold mb-3">Higher Earnings</h4>

            <p className="text-gray-600 text-sm leading-relaxed">
              Keep more of what you earn with fair commission structures and
              transparent payouts on every trip.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white rounded-3xl p-10 text-center border border-gray-200 transition-all duration-300 hover:bg-gray-50 hover:shadow-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brandColor/20 flex items-center justify-center transition duration-300 group-hover:bg-brandColor/30">
              <BookOpen className="text-brandColor" size={24} />
            </div>

            <h4 className="text-lg font-semibold mb-3">Long-Distance Focus</h4>

            <p className="text-gray-600 text-sm leading-relaxed">
              Get access to better-paying long-route rides instead of relying
              only on short, low-fare city trips.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white rounded-3xl p-10 text-center border border-gray-200 transition-all duration-300 hover:bg-gray-50 hover:shadow-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brandColor/20 flex items-center justify-center transition duration-300 group-hover:bg-brandColor/30">
              <BookOpen className="text-brandColor" size={24} />
            </div>

            <h4 className="text-lg font-semibold mb-3">Flexible Schedule</h4>

            <p className="text-gray-600 text-sm leading-relaxed">
              Choose your own working hours and drive whenever it fits your
              lifestyle and availability.
            </p>
          </div>
        </div>

        {/* ================= CONTACT SECTION ================= */}
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-semibold">
            <span className="text-brandColor">Need Help?</span> Talk to Us
          </h3>

          <p className="text-gray-500 mt-4">
            If you have any questions please get in touch.
          </p>
        </div>

        <div className="bg-gray-50 rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">
          {/* Left Image */}
          <div className="hidden md:block">
            <img
              src="/images/contactImage.png"
              alt="Contact"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Form (Reusable Component) */}
          <div className="p-6 sm:p-8 md:p-12">
            <ContactForm />
          </div>
        </div>
      </div>
      <DriverRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
