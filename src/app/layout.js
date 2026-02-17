import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        <main className="max-w-7xl mx-auto px-6 py-6">
          {children}
        </main>

      </body>
    </html>
  );
}