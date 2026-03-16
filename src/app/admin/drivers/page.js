"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await fetch("/api/admin/drivers");
      const data = await res.json();

      setDrivers(data.drivers || []);
    } catch {
      toast.error("Failed to load drivers");
    }
  };

  const updateStatus = async (id, status) => {
    const loadingToast = toast.loading("Updating driver...");

    try {
      const res = await fetch(`/api/admin/drivers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success("Driver updated successfully");
        fetchDrivers();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Failed to update driver");
    }
  };

  const getStatusBadge = (status) => {
    if (status === "approved")
      return (
        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
          Approved
        </span>
      );

    if (status === "rejected")
      return (
        <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
          Rejected
        </span>
      );

    return (
      <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
        Pending
      </span>
    );
  };

  return (
    <div>
      {/* Page Title */}
      <h2 className="text-2xl font-semibold mb-6">Drivers</h2>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Driver</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">City</th>
              <th className="p-4 text-left">Vehicle</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No drivers found
                </td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <tr key={driver._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{driver.fullName}</td>

                  <td className="p-4">{driver.phone}</td>

                  <td className="p-4">{driver.city}</td>

                  <td className="p-4">{driver.vehicle}</td>

                  {/* Status */}
                  <td className="p-4">{getStatusBadge(driver.status)}</td>

                  {/* Actions */}
                  <td className="p-4 flex gap-3">
                    {/* Approve */}
                    <button
                      disabled={driver.status === "approved"}
                      onClick={() => updateStatus(driver._id, "approved")}
                      className="
                        flex items-center gap-1
                        px-3 py-1 rounded-md
                        text-sm
                        bg-green-600 text-white
                        hover:bg-green-700
                        disabled:opacity-40
                      "
                    >
                      <Check size={14} />
                      Approve
                    </button>

                    {/* Reject */}
                    <button
                      disabled={driver.status === "rejected"}
                      onClick={() => updateStatus(driver._id, "rejected")}
                      className="
                        flex items-center gap-1
                        px-3 py-1 rounded-md
                        text-sm
                        bg-red-600 text-white
                        hover:bg-red-700
                        disabled:opacity-40
                      "
                    >
                      <X size={14} />
                      Reject
                    </button>
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
