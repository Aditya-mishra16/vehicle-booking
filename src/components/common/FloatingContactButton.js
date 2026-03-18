"use client";

import { useState, useEffect } from "react";
import { PhoneCall, MessageCircle, X, Headset } from "lucide-react";

export default function FloatingContactButton() {
  const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER;
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const defaultMessage = "Hi, I want to enquire about an outstation trip.";

  const whatsappLink = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        defaultMessage,
      )}`
    : "#";

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="floating-contact fixed right-6 bottom-6 z-50 flex flex-col items-end gap-4">
      {/* Open State Buttons */}
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-300 ease-out ${
          open
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        {/* Call Expert */}
        <a
          href={PHONE_NUMBER ? `tel:${PHONE_NUMBER}` : "#"}
          className="group flex items-center gap-3 bg-white border border-neutral-200 shadow-xl px-5 py-3 rounded-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
        >
          <div className="w-9 h-9 rounded-full bg-brandColor/10 flex items-center justify-center group-hover:bg-brandColor/20 transition">
            <PhoneCall size={18} className="text-brandColor" />
          </div>
          <span className="text-sm font-medium text-neutral-800">
            Talk to our travel expert
          </span>
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 bg-white border border-neutral-200 shadow-xl px-5 py-3 rounded-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
        >
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition">
            <MessageCircle size={18} className="text-green-600" />
          </div>
          <span className="text-sm font-medium text-neutral-800">
            Chat on WhatsApp
          </span>
        </a>
      </div>
      {/* Main Floating Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Talk to travel expert"
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          open
            ? "bg-neutral-900 text-white rotate-90"
            : "bg-brandColor text-white hover:scale-110"
        }`}
      >
        {!open && (
          <span className="absolute inset-0 rounded-full bg-brandColor/20 animate-ping" />
        )}

        {open ? <X size={22} /> : <Headset size={22} />}
      </button>
    </div>
  );
}
