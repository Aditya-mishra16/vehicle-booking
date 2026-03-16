"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left */}
          <div>
            <h2 className="text-5xl md:text-[64px] font-bold leading-none text-brandColor">
              CabEazy
            </h2>

            <p className="text-gray-300 text-base md:text-lg mt-4 max-w-md leading-relaxed">
              Fixed fares, reliable rides, and a smoother way to travel between
              cities.
            </p>
          </div>

          {/* Right Navigation */}
          <div className="md:justify-self-end md:text-right mt-8 md:mt-0">
            <p className="text-gray-400 mb-3 text-sm md:text-base">
              Navigation
            </p>

            <ul className="space-y-3 text-base md:text-lg">
              <li>
                <Link href="/" className="hover:text-brandColor transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-brandColor transition"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-brandColor transition">
                  Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-brandColor transition"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-brandColor transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8" />

        {/* Bottom Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm md:text-base">
          <div>
            <p className="text-gray-400 mb-1">Phone</p>
            <p>+91 3920392929</p>
          </div>

          <div>
            <p className="text-gray-400 mb-1">Email</p>
            <p>Cabeazy.travel@gmail.com</p>
          </div>

          <div>
            <p className="text-gray-400 mb-1">Address</p>
            <p>
              Mumbai-400072,
              <br />
              Maharashtra, India
            </p>
          </div>

          <div>
            <p className="text-gray-400 mb-1">Opening Hours</p>
            <p>Mon-Sun: 9.00 - 20.00</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
