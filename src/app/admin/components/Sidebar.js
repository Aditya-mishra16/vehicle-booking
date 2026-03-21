"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Car,
  Users,
  Phone,
  Mail,
  ChevronLeft,
  X,
} from "lucide-react";

const links = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Vehicles", href: "/admin/vehicles", icon: Car },
  { name: "Bookings", href: "/admin/bookings", icon: Phone },
  { name: "Drivers", href: "/admin/drivers", icon: Users },
  { name: "Contacts", href: "/admin/contacts", icon: Mail },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true); // default collapsed

  // Close mobile drawer on route change
  useEffect(() => {
    onMobileClose?.();
  }, [pathname]);

  return (
    <>
      {/* ── MOBILE BACKDROP ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* ── SIDEBAR PANEL ───────────────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 bg-white border-r border-gray-100
          flex flex-col shadow-xl
          transition-all duration-300 ease-in-out

          /* Mobile: slide in/out — always full width on mobile */
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:shadow-none

          /* Desktop width: collapsed = icon rail, expanded = full */
          w-64
          ${collapsed ? "md:w-[72px]" : "md:w-64"}
        `}
      >
        {/* ── BRAND ─────────────────────────────────────────────────── */}
        <div
          className={`
            flex items-center border-b border-gray-100 h-16 flex-shrink-0
            ${collapsed ? "md:justify-center md:px-0 px-5 gap-3" : "px-5 gap-3"}
          `}
        >
          <div className="w-8 h-8 rounded-xl bg-brandColor flex items-center justify-center flex-shrink-0">
            <Car size={16} className="text-white" />
          </div>

          <span
            className={`
              text-base font-bold text-gray-900 whitespace-nowrap
              ${collapsed ? "md:hidden" : ""}
            `}
          >
            CabEazy <span className="text-brandColor">Admin</span>
          </span>

          {/* Mobile close */}
          <button
            onClick={onMobileClose}
            className="ml-auto p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── NAV LINKS ─────────────────────────────────────────────── */}
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto px-3 py-4">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  relative flex items-center gap-3 rounded-xl
                  transition-all duration-150 group
                  ${collapsed ? "md:justify-center md:h-11 md:w-11 md:mx-auto md:px-0 px-4 py-3" : "px-4 py-3"}
                  ${
                    active
                      ? "bg-brandColor text-white shadow-sm"
                      : "text-gray-600 hover:bg-orange-50 hover:text-brandColor"
                  }
                `}
              >
                <Icon size={18} className="flex-shrink-0" />

                <span
                  className={`
                    text-sm font-medium whitespace-nowrap
                    ${collapsed ? "md:hidden" : ""}
                  `}
                >
                  {link.name}
                </span>

                {active && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                )}

                {/* Collapsed tooltip — desktop only */}
                {collapsed && (
                  <span
                    className="
                      pointer-events-none absolute left-full ml-3
                      bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5
                      whitespace-nowrap opacity-0 group-hover:opacity-100
                      transition-opacity duration-150 z-50 shadow-lg
                      hidden md:block
                    "
                  >
                    {link.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── COLLAPSE TOGGLE (desktop only) ────────────────────────── */}
        <div className="border-t border-gray-100 p-3 hidden md:block flex-shrink-0">
          <button
            onClick={() => setCollapsed((p) => !p)}
            className={`
              flex items-center gap-2.5 w-full
              px-3 py-2.5 rounded-xl text-sm
              text-gray-500 hover:bg-gray-100 hover:text-gray-900
              transition-all duration-150
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <ChevronLeft
              size={17}
              className={`transition-transform duration-300 flex-shrink-0 ${
                collapsed ? "rotate-180" : ""
              }`}
            />
            {!collapsed && <span className="font-medium">Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
