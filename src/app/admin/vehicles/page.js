"use client";

import { useEffect, useState } from "react";
import AddVehicleModal from "../components/AddVehicleModal";
import EditVehicleModal from "../components/EditVehicleModal";
import { toast } from "sonner";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await fetch("/api/admin/vehicles");
      const data = await res.json();

      setVehicles(data.vehicles || []);
    } catch (error) {
      toast.error("Failed to load vehicles");
    }
  };

  const deleteVehicle = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this vehicle?",
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Vehicle deleted successfully");
        fetchVehicles();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Failed to delete vehicle");
    }
  };

  const openEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setOpenEditModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Vehicles</h2>

        <button
          onClick={() => setOpenAddModal(true)}
          className="bg-brandColor text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          Add Vehicle
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Vehicle</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Seats</th>
              <th className="p-4 text-left">Price / KM</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No vehicles found
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr key={vehicle._id} className="border-t">
                  <td className="p-4 font-medium">{vehicle.name}</td>
                  <td className="p-4">{vehicle.type}</td>
                  <td className="p-4">{vehicle.seats}</td>
                  <td className="p-4">₹{vehicle.pricePerKm}</td>

                  <td className="p-4 flex gap-4">
                    <button
                      onClick={() => openEdit(vehicle)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteVehicle(vehicle._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={fetchVehicles}
      />

      {/* Edit Vehicle Modal */}
      <EditVehicleModal
        vehicle={selectedVehicle}
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSuccess={fetchVehicles}
      />
    </div>
  );
}
