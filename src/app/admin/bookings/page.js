"use client";

import { useEffect, useState } from "react";
import BookingDetailsModal from "../components/BookingDetailsModal";
import AssignDriverModal from "../components/AssignDriverModal";
import { toast } from "sonner";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [assignBooking, setAssignBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();

      setBookings(data.bookings || []);
    } catch {
      toast.error("Failed to load bookings");
    }
  };

  const openDetails = (booking) => {
    setSelectedBooking(booking);
    setOpenModal(true);
  };

  const openAssignDriver = (booking) => {
    setAssignBooking(booking);
    setOpenAssignModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Bookings</h2>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Booking ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Route</th>
              <th className="p-4 text-left">Vehicle</th>
              <th className="p-4 text-left">Driver</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
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

                  {/* Driver */}
                  <td className="p-4">
                    {booking.driver?.fullName || (
                      <span className="text-gray-400">Not Assigned</span>
                    )}
                  </td>

                  <td className="p-4">₹{booking.price}</td>

                  <td className="p-4">
                    {new Date(booking.startDate).toDateString()}
                  </td>

                  <td className="p-4 flex gap-4">
                    <button
                      onClick={() => openDetails(booking)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>

                    <button
                      onClick={() => openAssignDriver(booking)}
                      className="text-brandColor hover:underline"
                    >
                      Assign Driver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />

      {/* Assign Driver Modal */}
      <AssignDriverModal
        booking={assignBooking}
        isOpen={openAssignModal}
        onClose={() => setOpenAssignModal(false)}
        onSuccess={fetchBookings}
      />
    </div>
  );
}
