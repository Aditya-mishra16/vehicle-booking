"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export default function Navbar() {
  const PHONE_NUMBER = process.env.NEXT_PUBLIC_PHONE_NUMBER;
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const pathname = usePathname();
  const isHome = pathname === "/";

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!isHome) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

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
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-sm ${
        shouldHaveWhiteBg
          ? "bg-white/95 border-b border-gray-200 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link
            href="/"
            className={`text-lg font-semibold tracking-tight transition ${
              shouldHaveWhiteBg ? "text-gray-900" : "text-white"
            }`}
          >
            Motorium
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
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

          {/* DESKTOP BUTTONS */}
          <div className="hidden md:flex items-center gap-4">
            {/* CALL BUTTON */}
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

            {/* WHATSAPP BUTTON */}
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

          {/* MOBILE */}
          <div className="md:hidden">
            {mounted && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`transition ${
                      shouldHaveWhiteBg
                        ? "text-gray-900 hover:bg-gray-100"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="bg-white text-gray-900">
                  <SheetTitle>Menu</SheetTitle>

                  <div className="mt-6 flex flex-col gap-4">
                    {navLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-base font-medium text-gray-700 hover:text-black"
                      >
                        {item.label}
                      </Link>
                    ))}

                    <div className="pt-6 border-t flex flex-col gap-3">
                      <a href={PHONE_NUMBER ? `tel:${PHONE_NUMBER}` : "#"}>
                        <Button
                          variant="outline"
                          className="w-full justify-start cursor-pointer"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Talk to Travel Expert
                        </Button>
                      </a>

                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="w-full cursor-pointer">
                          Chat on WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
