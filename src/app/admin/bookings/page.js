"use client";

import { useEffect, useState } from "react";
import BookingDetailsModal from "../components/BookingDetailsModal";
import AssignDriverModal from "../components/AssignDriverModal";
import { toast } from "sonner";
import { formatTime } from "@/utils/formatTime";

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

  const confirmBooking = async (id) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}/confirm`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Booking confirmed & email sent");
        fetchBookings(); // refresh table
      } else {
        toast.error("Failed to confirm booking");
      }
    } catch {
      toast.error("Something went wrong");
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

      {/* Table Wrapper */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        <table className="min-w-[1400px] w-full text-sm whitespace-nowrap">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Booking ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Route</th>
              <th className="p-4 text-left">Trip Type</th>
              <th className="p-4 text-left">Pickup Date</th>
              <th className="p-4 text-left">Pickup Time</th>
              <th className="p-4 text-left">Return Date</th>
              <th className="p-4 text-left">Return Time</th>
              <th className="p-4 text-left">Vehicle</th>
              <th className="p-4 text-left">Driver</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="13" className="p-6 text-center text-gray-500">
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
                    <div className="text-xs text-gray-500">{booking.phone}</div>
                  </td>

                  <td className="p-4">
                    {booking.pickup} → {booking.drop}
                  </td>

                  <td className="p-4 capitalize">
                    {booking.tripType === "roundtrip"
                      ? "Round Trip"
                      : "One Way"}
                  </td>

                  <td className="p-4">
                    {booking.startDate
                      ? new Date(booking.startDate).toDateString()
                      : "-"}
                  </td>

                  <td className="p-4">{formatTime(booking.startTime)}</td>

                  <td className="p-4">
                    {booking.endDate
                      ? new Date(booking.endDate).toDateString()
                      : "-"}
                  </td>

                  <td className="p-4">{formatTime(booking.endTime)}</td>

                  <td className="p-4">{booking.vehicle}</td>

                  {/* Driver */}
                  <td className="p-4">
                    {booking.driver?.fullName || (
                      <span className="text-gray-400">Not Assigned</span>
                    )}
                  </td>

                  <td className="p-4">₹{booking.price}</td>

                  <td className="p-4">
                    {new Date(booking.createdAt).toDateString()}
                  </td>

                  <td className="p-4 flex gap-4">
                    <button
                      onClick={() => openDetails(booking)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>

                    <button
                      onClick={() => confirmBooking(booking._id)}
                      className="text-green-600 hover:underline"
                    >
                      Confirm
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
