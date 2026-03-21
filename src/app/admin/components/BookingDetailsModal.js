"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { formatTime } from "@/utils/formatTime";

export default function BookingDetailsModal({ booking, isOpen, onClose }) {
  if (!booking) return null;

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    assigned: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl p-0 rounded-xl overflow-hidden">
        {/* 🔥 HEADER */}
        <div className="sticky top-0 z-10 bg-white px-5 py-4 border-b flex items-start justify-between">
          <div>
            <DialogTitle className="text-base font-semibold">
              Booking Details
            </DialogTitle>
            <p className="text-xs text-gray-500 mt-1">#{booking.bookingId}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* STATUS */}
            <span
              className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                statusStyles[booking.status] || statusStyles.pending
              }`}
            >
              {booking.status}
            </span>

            {/* ✅ CLEAN CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-black transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 🔥 BODY */}
        <div className="px-5 py-4 space-y-5 text-sm max-h-[75vh] overflow-y-auto">
          {/* ROUTE */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Route</p>

            <div className="space-y-1">
              <p className="font-medium">{booking.pickup}</p>
              <p className="text-gray-400 text-xs">↓</p>
              <p className="font-medium">{booking.drop}</p>
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Info label="Name" value={booking.name} />
            <Info label="Phone" value={booking.phone} />

            <Info
              label="Email"
              value={booking.email}
              className="sm:col-span-2 break-all"
            />

            <Info
              label="Trip Type"
              value={
                booking.tripType === "roundtrip" ? "Round Trip" : "One Way"
              }
            />

            <Info label="Vehicle" value={booking.vehicle} />

            <Info
              label="Pickup Date"
              value={new Date(booking.startDate).toDateString()}
            />

            <Info
              label="Pickup Time"
              value={booking.startTime ? formatTime(booking.startTime) : "-"}
            />

            {booking.tripType === "roundtrip" && (
              <>
                <Info
                  label="Return Date"
                  value={
                    booking.endDate
                      ? new Date(booking.endDate).toDateString()
                      : "-"
                  }
                />

                <Info
                  label="Return Time"
                  value={booking.endTime ? formatTime(booking.endTime) : "-"}
                />
              </>
            )}

            <Info
              label="Driver"
              value={booking.driver?.fullName || "Not Assigned"}
            />
          </div>

          {/* TOTAL */}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm text-gray-500">Total Amount</span>
            <span className="text-lg font-semibold">₹{booking.price}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- FIELD ---------- */

function Info({ label, value, className = "" }) {
  return (
    <div className={className}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-medium text-sm leading-snug">{value || "-"}</p>
    </div>
  );
}
