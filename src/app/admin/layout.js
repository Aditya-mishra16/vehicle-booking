"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ── SIDEBAR ───────────────────────────────────────────────────── */}
      {/*
        On desktop: md:static, sits in the flex row.
        Sidebar manages its own collapsed/expanded width via internal state.
        We only manage mobileOpen here so the hamburger in the topbar
        can open the drawer.
      */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar */}
        <div className="flex items-center h-16 border-b bg-white px-4 md:px-6 flex-shrink-0">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden mr-3 p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1">
            <Topbar />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
