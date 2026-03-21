"use client";

import { useEffect, useState, useMemo, useDeferredValue } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { X, Search } from "lucide-react";

export default function AssignDriverModal({
  booking,
  isOpen,
  onClose,
  onSuccess,
}) {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search); // smooth UX

  useEffect(() => {
    if (isOpen) fetchDrivers();
  }, [isOpen]);

  const fetchDrivers = async () => {
    try {
      setFetching(true);

      const res = await fetch("/api/admin/drivers");
      const data = await res.json();

      const approved =
        data.drivers?.filter((d) => d.status === "approved") || [];

      setDrivers(approved);
    } catch {
      toast.error("Failed to load drivers");
    } finally {
      setFetching(false);
    }
  };

  /* ---------- FILTER ---------- */

  const filteredDrivers = useMemo(() => {
    const value = deferredSearch.toLowerCase();

    return drivers.filter((d) => {
      return (
        d.fullName?.toLowerCase().includes(value) ||
        d.city?.toLowerCase().includes(value)
      );
    });
  }, [drivers, deferredSearch]);

  /* ---------- SELECT / UNSELECT ---------- */

  const handleSelect = (id) => {
    setSelectedDriver((prev) => (prev === id ? "" : id)); // toggle
  };

  /* ---------- ASSIGN ---------- */

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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ driverId: selectedDriver }),
        },
      );

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (data.success) {
        toast.success("Driver assigned");
        setSelectedDriver("");
        setSearch("");
        onSuccess();
        onClose();
      } else {
        toast.error(data.error || "Failed to assign driver");
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Server error");
    }

    setLoading(false);
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg p-0 rounded-xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <DialogTitle className="text-base font-semibold">
              Assign Driver
            </DialogTitle>
            <p className="text-xs text-gray-500 mt-1">
              Booking #{booking.bookingId}
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="px-5 pt-4">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search driver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-sm"
            />
          </div>
        </div>

        {/* LIST */}
        <div className="p-5 pt-3 space-y-2 max-h-[50vh] overflow-y-auto">
          {fetching ? (
            <p className="text-sm text-gray-500 text-center">
              Loading drivers...
            </p>
          ) : filteredDrivers.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No drivers found
            </p>
          ) : (
            filteredDrivers.map((driver) => {
              const isSelected = selectedDriver === driver._id;

              return (
                <div
                  key={driver._id}
                  onClick={() => handleSelect(driver._id)}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition
                    ${
                      isSelected
                        ? "border-brandColor bg-brandColor/10"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{driver.fullName}</p>
                      <p className="text-xs text-gray-500">
                        {driver.city || "—"}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="text-xs text-brandColor font-medium">
                        ✓ Selected
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t">
          <button
            onClick={assignDriver}
            disabled={loading}
            className="
              w-full bg-brandColor text-white py-2.5 rounded-lg text-sm font-medium
              hover:opacity-90 transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Assigning..." : "Assign Driver"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
