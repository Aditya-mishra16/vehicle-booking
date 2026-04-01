import "./globals.css";
import "leaflet/dist/leaflet.css";
import "react-day-picker/dist/style.css";

import { Inter } from "next/font/google";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Cab Booking",
  description: "Book your ride easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>

      <body
        className={`${inter.variable} font-sans bg-background text-foreground min-h-screen`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>

        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
