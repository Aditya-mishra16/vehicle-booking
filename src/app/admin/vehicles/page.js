"use client";

import { useEffect, useState, useMemo, useDeferredValue } from "react";
import { toast } from "sonner";
import { Plus, MoreVertical, Search } from "lucide-react";

import AddVehicleModal from "../components/AddVehicleModal";
import EditVehicleModal from "../components/EditVehicleModal";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState([]);

  const [globalFilter, setGlobalFilter] = useState("");
  const deferredSearch = useDeferredValue(globalFilter);
  const [typeFilter, setTypeFilter] = useState("all");

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    setMounted(true);
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/vehicles");
      const data = await res.json();
      setVehicles(data.vehicles || []);
    } catch {
      toast.error("Failed to load vehicles");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVehicle = async (id) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    const toastId = toast.loading("Deleting vehicle...");
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      toast.dismiss(toastId);
      if (data.success) {
        toast.success("Vehicle deleted successfully");
        fetchVehicles();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.dismiss(toastId);
      toast.error("Failed to delete vehicle");
    } finally {
      setLoadingId(null);
    }
  };

  // Unique vehicle types for filter dropdown
  const vehicleTypes = useMemo(() => {
    const types = [...new Set(vehicles.map((v) => v.type).filter(Boolean))];
    return types.sort();
  }, [vehicles]);

  const filteredData = useMemo(() => {
    const val = deferredSearch.toLowerCase();
    return vehicles
      .filter((v) => (typeFilter === "all" ? true : v.type === typeFilter))
      .filter(
        (v) =>
          v.name?.toLowerCase().includes(val) ||
          v.type?.toLowerCase().includes(val),
      );
  }, [vehicles, deferredSearch, typeFilter]);

  const columns = useMemo(
    () => [
      {
        header: "Vehicle",
        accessorKey: "name",
        cell: ({ row }) => (
          <span className="font-medium text-gray-900">{row.original.name}</span>
        ),
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
            {row.original.type}
          </span>
        ),
      },
      {
        header: "Seats",
        accessorKey: "seats",
        cell: ({ row }) => (
          <span className="text-gray-600">{row.original.seats}</span>
        ),
      },
      {
        header: "Price / KM",
        accessorKey: "pricePerKm",
        cell: ({ row }) => (
          <span className="font-medium text-gray-900">
            ₹{row.original.pricePerKm}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const v = row.original;
          const isProcessing = loadingId === v._id;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  disabled={isProcessing}
                  className="p-2 rounded-md hover:bg-gray-100 transition"
                >
                  <MoreVertical size={18} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVehicle(v);
                    setOpenEditModal(true);
                  }}
                  className="text-blue-600"
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteVehicle(v._id);
                  }}
                  className="text-red-600"
                >
                  {isProcessing ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [loadingId],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Vehicles</h2>
        <button
          onClick={() => setOpenAddModal(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-brandColor transition text-sm"
        >
          <Plus size={16} />
          Add Vehicle
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-4">
        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search vehicles..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="
              w-full h-10 pl-9 pr-4
              rounded-md border border-input
              bg-white text-sm
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0
              placeholder:text-muted-foreground
            "
          />
        </div>

        {mounted && vehicleTypes.length > 0 && (
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-44 bg-white">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {vehicleTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500">
            Loading vehicles...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase sticky top-0">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-4 text-left cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-500">
                    No vehicles found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
        <div className="text-sm text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* MODALS */}
      <AddVehicleModal
        isOpen={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={fetchVehicles}
      />
      <EditVehicleModal
        vehicle={selectedVehicle}
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSuccess={fetchVehicles}
      />
    </div>
  );
}
