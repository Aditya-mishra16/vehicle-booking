"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Phone, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER;
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const pathname = usePathname();
  const isHome = pathname === "/";

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // drag-to-close
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(null);

  useEffect(() => {
    setMounted(true);
    if (!isHome) return;
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setDragY(0);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const onTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };
  const onTouchMove = (e) => {
    if (startY.current === null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0) setDragY(delta);
  };
  const onTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 100) setOpen(false);
    else setDragY(0);
    startY.current = null;
  };

  const shouldHaveWhiteBg = !isHome || scrolled;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Jobs", href: "/jobs" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const whatsappLink = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hi, I want to enquire about an outstation trip.",
      )}`
    : "#";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-sm ${
          shouldHaveWhiteBg
            ? "bg-white/95 border-b border-gray-200 shadow-sm"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* LOGO */}
            <Link
              href="/"
              className={`text-lg font-semibold tracking-tight transition ${
                shouldHaveWhiteBg ? "text-gray-900" : "text-white"
              }`}
            >
              CabEazy
            </Link>

            {/* CENTER NAVIGATION — desktop */}
            <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors duration-300 ${
                      shouldHaveWhiteBg
                        ? isActive
                          ? "text-black"
                          : "text-gray-600 hover:text-brandColor"
                        : isActive
                          ? "text-white"
                          : "text-white/80 hover:text-brandColor"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* RIGHT ACTIONS — desktop */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href={PHONE_NUMBER ? `tel:${PHONE_NUMBER}` : "#"}
                className={`h-10 w-10 flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300 ${
                  shouldHaveWhiteBg
                    ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    : "bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20"
                }`}
                aria-label="Talk to travel expert"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`h-10 px-6 rounded-xl text-sm font-medium cursor-pointer transition-all duration-300 flex items-center justify-center ${
                  shouldHaveWhiteBg
                    ? "bg-black text-white hover:bg-neutral-800"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                Chat on WhatsApp
              </a>
            </div>

            {/* HAMBURGER — mobile */}
            {mounted && (
              <button
                onClick={() => setOpen(true)}
                className={`md:hidden p-2 rounded-xl transition ${
                  shouldHaveWhiteBg
                    ? "text-gray-900 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ──────────────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`
          fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm
          transition-opacity duration-300 md:hidden
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Bottom sheet */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: open ? `translateY(${dragY}px)` : "translateY(100%)",
          transition: isDragging
            ? "none"
            : "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
        className="
          fixed bottom-0 left-0 right-0 z-[999]
          bg-white rounded-t-3xl
          shadow-[0_-8px_40px_rgba(0,0,0,0.15)]
          md:hidden
          flex flex-col
          max-h-[85dvh]
        "
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 flex-shrink-0">
          <span className="text-base font-semibold text-gray-900">
            Cab<span className="text-brandColor">Eazy</span>
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`
                    flex items-center px-4 py-3.5 rounded-2xl text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-brandColor/10 text-brandColor font-semibold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  {item.label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brandColor" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA buttons */}
          <div
            className="mt-4 pt-4 border-t flex flex-col gap-3"
            style={{
              paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
            }}
          >
            <a
              href={PHONE_NUMBER ? `tel:${PHONE_NUMBER}` : "#"}
              onClick={() => setOpen(false)}
              className="
                flex items-center justify-center gap-2
                w-full h-12 rounded-2xl
                border border-gray-200 bg-white
                text-sm font-medium text-gray-800
                hover:bg-gray-50 transition
              "
            >
              <Phone size={16} className="text-gray-500" />
              Talk to Travel Expert
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="
                flex items-center justify-center gap-2
                w-full h-12 rounded-2xl
                bg-black text-white
                text-sm font-medium
                hover:bg-neutral-800 transition active:scale-[0.97]
              "
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
