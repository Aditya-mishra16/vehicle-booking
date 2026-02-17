import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link href="/" className="text-xl font-bold">
          VehicleBooking
        </Link>

        <div className="flex gap-6">
          <Link href="/" className="hover:text-gray-200">
            Home
          </Link>

          <Link href="/vehicles" className="hover:text-gray-200">
            Vehicles
          </Link>

          <Link href="/drivers" className="hover:text-gray-200">
            Drivers
          </Link>

          <Link href="/contact" className="hover:text-gray-200">
            Contact
          </Link>

          <Link href="/login" className="bg-white text-blue-600 px-4 py-1 rounded">
            Login
          </Link>
        </div>

      </div>
    </nav>
  );
}