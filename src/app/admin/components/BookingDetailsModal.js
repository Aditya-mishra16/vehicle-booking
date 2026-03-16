"use client";

import { X } from "lucide-react";

export default function BookingDetailsModal({ booking, isOpen, onClose }) {
  if (!isOpen || !booking) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[500px] rounded-xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Booking Details</h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <p>
            <strong>Booking ID:</strong> {booking.bookingId}
          </p>
          <p>
            <strong>Name:</strong> {booking.name}
          </p>
          <p>
            <strong>Email:</strong> {booking.email}
          </p>
          <p>
            <strong>Phone:</strong> {booking.phone}
          </p>
          <p>
            <strong>Pickup:</strong> {booking.pickup}
          </p>
          <p>
            <strong>Drop:</strong> {booking.drop}
          </p>
          <p>
            <strong>Vehicle:</strong> {booking.vehicle}
          </p>
          <p>
            <strong>Price:</strong> ₹{booking.price}
          </p>
          <p>
            <strong>Date:</strong> {new Date(booking.startDate).toDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
