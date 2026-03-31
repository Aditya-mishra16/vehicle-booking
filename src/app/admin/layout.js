"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center h-16 border-b bg-white px-4 md:px-6 flex-shrink-0">
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

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
