"use client";

import "./globals.css";
import "leaflet/dist/leaflet.css";
import "react-day-picker/dist/style.css";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans bg-background text-foreground min-h-screen`}
      >
        <Navbar />

        {/* Automatically add spacing only for non-home pages */}
        <main className={!isHome ? "pt-16" : ""}>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
