"use client";

import Link from "next/link";
import { LayoutDashboard, Car, Users, Phone, Mail } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Vehicles", href: "/admin/vehicles", icon: Car },
    { name: "Bookings", href: "/admin/bookings", icon: Phone },
    { name: "Drivers", href: "/admin/drivers", icon: Users },
    { name: "Contacts", href: "/admin/contacts", icon: Mail },
  ];

  return (
    <div className="w-64 bg-white border-r flex flex-col p-6">
      <h2 className="text-2xl font-semibold text-brandColor mb-10">
        CabEazy Admin
      </h2>

      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;

          const active = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
              ${
                active
                  ? "bg-brandColor text-white"
                  : "text-gray-700 hover:bg-orange-50"
              }`}
            >
              <Icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
