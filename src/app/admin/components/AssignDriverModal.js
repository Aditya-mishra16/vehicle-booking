"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function AssignDriverModal({
  booking,
  isOpen,
  onClose,
  onSuccess,
}) {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDrivers();
    }
  }, [isOpen]);

  const fetchDrivers = async () => {
    try {
      const res = await fetch("/api/admin/drivers");
      const data = await res.json();

      const approvedDrivers =
        data.drivers?.filter((d) => d.status === "approved") || [];

      setDrivers(approvedDrivers);
    } catch {
      toast.error("Failed to load drivers");
    }
  };

  const assignDriver = async () => {
    if (!selectedDriver) {
      toast.error("Please select a driver");
      return;
    }

    setLoading(true);

    const loadingToast = toast.loading("Assigning driver...");

    try {
      const res = await fetch(
        `/api/admin/bookings/${booking._id}/assign-driver`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            driverId: selectedDriver,
          }),
        },
      );

      const data = await res.json();

      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success("Driver assigned successfully");

        setSelectedDriver("");

        onSuccess();
        onClose();
      } else {
        toast.error(data.error || "Failed to assign driver");
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Server error while assigning driver");
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[420px] rounded-xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Assign Driver</h2>

          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Driver Select */}
        <select
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
          disabled={loading}
          className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor"
        >
          <option value="">Select Driver</option>

          {drivers.map((driver) => (
            <option key={driver._id} value={driver._id}>
              {driver.fullName} • {driver.city}
            </option>
          ))}
        </select>

        {/* Assign Button */}
        <button
          onClick={assignDriver}
          disabled={loading}
          className="
            mt-4 w-full bg-brandColor text-white py-3 rounded-lg
            hover:opacity-90
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading ? "Assigning..." : "Assign Driver"}
        </button>
      </div>
    </div>
  );
}
