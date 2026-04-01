"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContactButton from "@/components/common/FloatingContactButton";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <main className={!isHome && !isAdminRoute ? "pt-16" : ""}>
        {children}
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingContactButton />}
    </>
  );
}
