"use client";

import "./globals.css";
import "leaflet/dist/leaflet.css";
import "react-day-picker/dist/style.css";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContactButton from "@/components/common/FloatingContactButton";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans bg-background text-foreground min-h-screen`}
      >
        {!isAdminRoute && <Navbar />}

        <main className={!isHome && !isAdminRoute ? "pt-16" : ""}>
          {children}
        </main>

        {!isAdminRoute && <Footer />}

        {!isAdminRoute && <FloatingContactButton />}

        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
