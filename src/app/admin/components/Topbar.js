"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const PAGE_TITLES = {
  admin: "Dashboard",
  vehicles: "Vehicles",
  bookings: "Bookings",
  drivers: "Drivers",
  contacts: "Contacts",
};

export default function Topbar() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label =
      PAGE_TITLES[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
    const isLast = i === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <div className="flex items-center justify-between w-full h-full">
      {/* Left — Brand title + breadcrumb */}
      <div>
        <h1 className="text-base font-semibold leading-tight">
          <span className="text-gray-900">CabEazy </span>
          <span className="text-brandColor">Admin Panel</span>
        </h1>

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-1 mt-0.5">
          {crumbs.map((crumb) => (
            <span key={crumb.href} className="flex items-center gap-1">
              {!crumb.isLast ? (
                <>
                  <Link
                    href={crumb.href}
                    className="text-xs text-gray-400 hover:text-brandColor transition-colors"
                  >
                    {crumb.label}
                  </Link>
                  <ChevronRight size={11} className="text-gray-300" />
                </>
              ) : (
                <span className="text-xs text-brandColor font-medium">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Right — Admin avatar */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-medium text-gray-800">Admin</span>
          <span className="text-xs text-gray-400">CabEazy</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-brandColor text-white flex items-center justify-center font-semibold text-sm flex-shrink-0 shadow-sm">
          A
        </div>
      </div>
    </div>
  );
}
