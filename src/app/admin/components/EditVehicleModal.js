"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function EditVehicleModal({
  vehicle,
  isOpen,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    seats: "",
    pricePerKm: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name || "",
        type: vehicle.type || "",
        seats: vehicle.seats || "",
        pricePerKm: vehicle.pricePerKm || "",
      });
    }
  }, [vehicle]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading("Updating vehicle...");

    try {
      const res = await fetch(`/api/admin/vehicles/${vehicle._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          seats: Number(formData.seats),
          pricePerKm: Number(formData.pricePerKm),
        }),
      });

      const data = await res.json();

      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success("Vehicle updated successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Failed to update vehicle");
    }

    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[450px] rounded-xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Edit Vehicle</h2>

          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Vehicle Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Vehicle Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor"
            />
          </div>

          {/* Vehicle Type */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Vehicle Type</label>
            <input
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor"
            />
          </div>

          {/* Seats */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Seats</label>
            <input
              type="number"
              name="seats"
              value={formData.seats}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Price Per KM (₹)</label>
            <input
              type="number"
              name="pricePerKm"
              value={formData.pricePerKm}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandColor"
            />
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-brandColor text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Vehicle"}
          </button>
        </form>
      </div>
    </div>
  );
}
