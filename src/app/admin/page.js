"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();

      if (data.success) {
        setStats(data.stats);
        setRecentBookings(data.recentBookings);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to load dashboard");
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    const loadingToast = toast.loading("Logging out...");

    try {
      const res = await fetch("/api/admin/auth/logout", {
        method: "POST",
      });

      const data = await res.json();

      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success("Logged out successfully");

        window.location.href = "/admin-login";
      } else {
        toast.error("Logout failed");
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Server error during logout");
    }

    setLoggingOut(false);
  };

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  const statCards = [
    { title: "Total Bookings", value: stats.totalBookings },
    { title: "Total Vehicles", value: stats.totalVehicles },
    { title: "Total Drivers", value: stats.totalDrivers },
    { title: "Contact Messages", value: stats.totalContacts },
    { title: "Unassigned Bookings", value: stats.unassignedBookings },
    { title: "Pending Drivers", value: stats.pendingDrivers },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="
            bg-red-500 text-white px-4 py-2 rounded-lg
            hover:opacity-90
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        {statCards.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow border p-6 hover:shadow-md transition"
          >
            <p className="text-gray-500 text-sm">{item.title}</p>

            <h3 className="text-3xl font-semibold mt-2">{item.value}</h3>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recent Bookings</h3>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Booking ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Route</th>
              <th className="p-4 text-left">Vehicle</th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {recentBookings.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No recent bookings
                </td>
              </tr>
            ) : (
              recentBookings.map((booking) => (
                <tr key={booking._id} className="border-t">
                  <td className="p-4 font-medium">{booking.bookingId}</td>

                  <td className="p-4">
                    <div>{booking.name}</div>
                    <div className="text-xs text-gray-500">{booking.email}</div>
                  </td>

                  <td className="p-4">
                    {booking.pickup} → {booking.drop}
                  </td>

                  <td className="p-4">{booking.vehicle}</td>

                  <td className="p-4">
                    {new Date(booking.startDate).toDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
