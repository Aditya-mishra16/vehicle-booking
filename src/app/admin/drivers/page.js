"use client";

import { useEffect, useState, useMemo, useDeferredValue } from "react";
import { toast } from "sonner";
import { Plus, MoreVertical, Search } from "lucide-react";

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

import AddDriverModal from "@/app/admin/components/AddDriverModal";

const VEHICLE_TYPES = [
  { value: "sedan-intercity", label: "Sedan Intercity" },
  { value: "mini-intercity", label: "Mini Intercity" },
  { value: "suv-intercity", label: "SUV Intercity" },
];

const getVehicleLabel = (type) =>
  VEHICLE_TYPES.find((v) => v.value === type)?.label || type;

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const [globalFilter, setGlobalFilter] = useState("");
  const deferredSearch = useDeferredValue(globalFilter);
  const [statusFilter, setStatusFilter] = useState("all");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    setMounted(true);
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/drivers");
      const data = await res.json();
      setDrivers(data.drivers || []);
    } catch {
      toast.error("Failed to load drivers");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    if (loadingId) return;
    const toastId = toast.loading("Updating driver...");
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/drivers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      toast.dismiss(toastId);
      if (data.success) {
        toast.success("Driver updated successfully");
        fetchDrivers();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.dismiss(toastId);
      toast.error("Failed to update driver");
    } finally {
      setLoadingId(null);
    }
  };

  const deleteDriver = async (id) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;
    const toastId = toast.loading("Deleting driver...");
    try {
      const res = await fetch(`/api/admin/drivers/${id}`, { method: "DELETE" });
      const data = await res.json();
      toast.dismiss(toastId);
      if (data.success) {
        toast.success("Driver deleted");
        fetchDrivers();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.dismiss(toastId);
      toast.error("Failed to delete driver");
    }
  };

  const getStatusConfig = useMemo(() => {
    return (status = "pending") => {
      const map = {
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
        pending: "bg-yellow-100 text-yellow-700",
      };
      return map[status] || map.pending;
    };
  }, []);

  const filteredData = useMemo(() => {
    return drivers
      .filter((d) =>
        statusFilter === "all" ? true : d.status === statusFilter,
      )
      .filter((d) =>
        vehicleFilter === "all" ? true : d.vehicleType === vehicleFilter,
      )
      .filter((d) => {
        const val = deferredSearch.toLowerCase();
        return (
          d.fullName?.toLowerCase().includes(val) ||
          d.phone?.toLowerCase().includes(val) ||
          d.email?.toLowerCase().includes(val) ||
          d.city?.toLowerCase().includes(val) ||
          d.vehicleName?.toLowerCase().includes(val)
        );
      });
  }, [drivers, deferredSearch, statusFilter, vehicleFilter]);

  const columns = useMemo(
    () => [
      {
        header: "Driver",
        cell: ({ row }) => {
          const d = row.original;
          return (
            <div>
              <div className="font-medium">{d.fullName}</div>
              <div className="text-xs text-gray-500">{d.email || "—"}</div>
            </div>
          );
        },
      },
      { accessorKey: "phone", header: "Phone" },
      { accessorKey: "city", header: "City" },
      {
        header: "Vehicle",
        cell: ({ row }) => {
          const d = row.original;
          return (
            <div>
              <div className="font-medium">{d.vehicleName}</div>
              <div className="text-xs text-gray-500">
                {getVehicleLabel(d.vehicleType)}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status || "pending";
          return (
            <span
              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusConfig(status)}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const d = row.original;
          const isProcessing = loadingId === d._id;
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
                    updateStatus(d._id, "approved");
                  }}
                  disabled={d.status === "approved"}
                  className="text-green-600"
                >
                  {isProcessing ? "Processing..." : "Approve"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    updateStatus(d._id, "rejected");
                  }}
                  disabled={d.status === "rejected"}
                  className="text-red-600"
                >
                  Reject
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDriver(d._id);
                  }}
                  className="text-gray-700"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [loadingId, getStatusConfig],
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
        <h2 className="text-2xl font-semibold">Drivers</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-brandColor transition text-sm"
        >
          <Plus size={16} />
          Add Driver
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
            placeholder="Search drivers..."
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

        {mounted && (
          <div className="flex gap-2 flex-wrap">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger className="w-44 bg-white">
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                {VEHICLE_TYPES.map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500">
            Loading drivers...
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
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    No drivers found
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

      {/* ADD DRIVER MODAL */}
      <AddDriverModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={fetchDrivers}
      />
    </div>
  );
}
