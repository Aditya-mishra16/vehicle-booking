"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, X, Trash2, Plus } from "lucide-react";

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

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

  const deleteDriver = async (id) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;

    const loadingToast = toast.loading("Deleting driver...");

    try {
      const res = await fetch(`/api/admin/drivers/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success("Driver deleted");
        fetchDrivers();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Failed to delete driver");
    }
  };

  const createDriver = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const body = {
      fullName: form.get("fullName"),
      phone: form.get("phone"),
      email: form.get("email"),
      city: form.get("city"),
      vehicle: form.get("vehicle"),
    };

    const res = await fetch("/api/admin/drivers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Driver added successfully");
      setShowCreate(false);
      fetchDrivers();
    } else {
      toast.error(data.error);
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Drivers</h2>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-brandColor transition"
        >
          <Plus size={16} />
          Add Driver
        </button>
      </div>

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

                  <td className="p-4">{getStatusBadge(driver.status)}</td>

                  <td className="p-4 flex items-center gap-2">
                    <button
                      disabled={driver.status === "approved"}
                      onClick={() => updateStatus(driver._id, "approved")}
                      className="flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-40"
                    >
                      <Check size={14} />
                      Approve
                    </button>

                    <button
                      disabled={driver.status === "rejected"}
                      onClick={() => updateStatus(driver._id, "rejected")}
                      className="flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-40"
                    >
                      <X size={14} />
                      Reject
                    </button>

                    <button
                      onClick={() => deleteDriver(driver._id)}
                      className="flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-gray-800 text-white hover:bg-black"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Driver Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Add Driver</h3>

            <form onSubmit={createDriver} className="space-y-3">
              <input
                name="fullName"
                placeholder="Full Name"
                className="border p-2 w-full rounded"
                required
              />

              <input
                name="phone"
                placeholder="Phone"
                className="border p-2 w-full rounded"
                required
              />

              <input
                name="email"
                placeholder="Email"
                className="border p-2 w-full rounded"
              />

              <input
                name="city"
                placeholder="City"
                className="border p-2 w-full rounded"
                required
              />

              <input
                name="vehicle"
                placeholder="Vehicle"
                className="border p-2 w-full rounded"
                required
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>

                <button className="px-3 py-1 bg-black text-white rounded hover:bg-brandColor">
                  Save Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
