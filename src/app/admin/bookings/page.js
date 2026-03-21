"use client";

import { useEffect, useState, useMemo, useDeferredValue } from "react";
import BookingDetailsModal from "../components/BookingDetailsModal";
import AssignDriverModal from "../components/AssignDriverModal";
import { toast } from "sonner";
import { formatTime } from "@/utils/formatTime";
import { MoreVertical, Search } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const deferredSearch = useDeferredValue(globalFilter);

  const [statusFilter, setStatusFilter] = useState("all");
  const [sorting, setSorting] = useState([]);

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [assignBooking, setAssignBooking] = useState(null);

  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    setMounted(true);
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmBooking = async (id) => {
    if (loadingId) return;

    const toastId = toast.loading("Confirming booking...");
    setLoadingId(id);

    try {
      const res = await fetch(`/api/admin/bookings/${id}/confirm`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Booking confirmed", { id: toastId });
        fetchBookings();
      } else {
        toast.error(data.error || "Failed to confirm", { id: toastId });
      }
    } catch {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  const cancelBooking = async (id) => {
    if (loadingId) return;

    if (!window.confirm("Cancel this booking?")) return;

    const toastId = toast.loading("Cancelling booking...");
    setLoadingId(id);

    try {
      const res = await fetch(`/api/admin/bookings/${id}/confirm`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Booking cancelled", { id: toastId });
        fetchBookings();
      } else {
        toast.error(data.error || "Failed to cancel", { id: toastId });
      }
    } catch {
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusConfig = useMemo(() => {
    return (status = "pending") => {
      const map = {
        pending: "bg-yellow-100 text-yellow-700",
        confirmed: "bg-blue-100 text-blue-700",
        assigned: "bg-purple-100 text-purple-700",
        completed: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
      };
      return map[status] || map.pending;
    };
  }, []);

  const filteredData = useMemo(() => {
    return bookings
      .filter((b) =>
        statusFilter === "all" ? true : b.status === statusFilter,
      )
      .filter((b) => {
        const value = deferredSearch.toLowerCase();
        return (
          b.bookingId?.toLowerCase().includes(value) ||
          b.name?.toLowerCase().includes(value) ||
          b.email?.toLowerCase().includes(value) ||
          b.pickup?.toLowerCase().includes(value) ||
          b.drop?.toLowerCase().includes(value)
        );
      });
  }, [bookings, deferredSearch, statusFilter]);

  const columns = useMemo(
    () => [
      { accessorKey: "bookingId", header: "Booking ID" },

      {
        header: "Customer",
        cell: ({ row }) => {
          const b = row.original;
          return (
            <div>
              <div className="font-medium">{b.name}</div>
              <div className="text-xs text-gray-500">{b.email}</div>
              <div className="text-xs text-gray-400">{b.phone}</div>
            </div>
          );
        },
      },

      {
        header: "Route",
        cell: ({ row }) => {
          const b = row.original;
          return (
            <span className="whitespace-nowrap font-medium">
              {b.pickup} → {b.drop}
            </span>
          );
        },
      },

      {
        header: "Schedule",
        cell: ({ row }) => {
          const b = row.original;
          return (
            <div>
              <div>{new Date(b.startDate).toDateString()}</div>
              <div className="text-xs text-gray-500">
                {formatTime(b.startTime)}
              </div>
            </div>
          );
        },
      },

      { accessorKey: "vehicle", header: "Vehicle" },

      {
        header: "Driver",
        cell: ({ row }) => {
          const b = row.original;
          return b.driver?.fullName ? (
            <span className="text-green-600 font-medium">
              {b.driver.fullName}
            </span>
          ) : (
            <span className="text-gray-400">Not Assigned</span>
          );
        },
      },

      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => `₹${row.original.price}`,
      },

      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status || "pending";
          return (
            <span
              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusConfig(
                status,
              )}`}
            >
              {status}
            </span>
          );
        },
      },

      {
        id: "actions",
        cell: ({ row }) => {
          const b = row.original;
          const isLoading = loadingId === b._id;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  disabled={isLoading}
                  className="p-2 rounded-md hover:bg-gray-100 transition"
                >
                  <MoreVertical size={18} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBooking(b);
                    setOpenModal(true);
                  }}
                >
                  View Details
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmBooking(b._id);
                  }}
                  disabled={
                    b.status === "confirmed" || b.status === "cancelled"
                  }
                  className="text-green-600"
                >
                  {isLoading ? "Processing..." : "Confirm"}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setAssignBooking(b);
                    setOpenAssignModal(true);
                  }}
                >
                  Assign Driver
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelBooking(b._id);
                  }}
                  className="text-red-600"
                >
                  Cancel Booking
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
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-semibold mb-4">Bookings</h2>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-4">
        {/* Search with icon */}
        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search bookings..."
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
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500">
            Loading bookings...
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
                  <td colSpan="9" className="p-10 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => {
                      setSelectedBooking(row.original);
                      setOpenModal(true);
                    }}
                    className="border-t hover:bg-gray-50 cursor-pointer transition"
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
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />

      <AssignDriverModal
        booking={assignBooking}
        isOpen={openAssignModal}
        onClose={() => setOpenAssignModal(false)}
        onSuccess={fetchBookings}
      />
    </div>
  );
}
