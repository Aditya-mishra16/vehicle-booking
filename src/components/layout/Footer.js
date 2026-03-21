"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";

const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER;
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Jobs", href: "/jobs" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: PHONE_NUMBER || "+91 3920392929",
    href: `tel:${PHONE_NUMBER || "+913920392929"}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: "Cabeazy.travel@gmail.com",
    href: "mailto:Cabeazy.travel@gmail.com",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Mumbai-400072, Maharashtra, India",
    href: "https://maps.google.com/?q=Mumbai,Maharashtra,India",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon–Sun: 9:00 – 20:00",
    href: null,
  },
];

export default function Footer() {
  const whatsappLink = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hi, I want to enquire about an outstation trip.",
      )}`
    : "#";

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-0 w-[400px] h-[200px] bg-brandColor/5 rounded-full blur-3xl pointer-events-none -translate-x-1/4 -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
        {/* ── TOP SECTION ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 items-start">
          {/* Brand — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black leading-none tracking-tighter text-brandColor">
              CabEazy
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-xs leading-relaxed">
              Fixed fares, reliable rides, and a smoother way to travel between
              cities.
            </p>

            {/* WhatsApp CTA */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-5 inline-flex items-center gap-2
                bg-white text-black
                px-4 py-2.5 rounded-xl text-sm font-semibold
                hover:bg-brandColor hover:text-white
                transition-all duration-200 group
              "
            >
              <MessageCircle
                size={15}
                className="group-hover:scale-110 transition-transform"
              />
              Chat on WhatsApp
              <ArrowUpRight
                size={13}
                className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </a>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Navigation
            </p>
            <ul className="space-y-0.5">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="
                      group inline-flex items-center gap-2
                      text-gray-300 hover:text-white
                      text-sm py-1.5
                      transition-colors duration-150
                    "
                  >
                    <span className="w-0 h-px bg-brandColor group-hover:w-3 transition-all duration-200" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — full width on mobile (spans 2 cols), normal on md+ */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Get in Touch
            </p>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-3 sm:gap-4">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                const content = (
                  <div className="flex items-start gap-2.5 group">
                    <div
                      className="
                      mt-0.5 w-7 h-7 rounded-lg flex-shrink-0
                      bg-white/5 border border-white/10
                      flex items-center justify-center
                      group-hover:bg-brandColor/20 group-hover:border-brandColor/30
                      transition-all duration-200
                    "
                    >
                      <Icon
                        size={13}
                        className="text-gray-400 group-hover:text-brandColor transition-colors"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors leading-snug break-words">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );

                return (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          item.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* ── DIVIDER ──────────────────────────────────────────────────── */}
        <div className="border-t border-white/10 my-8" />

        {/* ── BOTTOM BAR ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} CabEazy. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-gray-300 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
