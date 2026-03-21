"use client";

import { useEffect, useState, useMemo, useDeferredValue } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactMessageModal from "../components/ContactMessageModal";

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

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [sorting, setSorting] = useState([]);

  const [globalFilter, setGlobalFilter] = useState("");
  const deferredSearch = useDeferredValue(globalFilter);
  const [dateSort, setDateSort] = useState("newest");

  const [selectedContact, setSelectedContact] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/contacts");
      const data = await res.json();
      if (data.success) {
        setContacts(data.contacts);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    const val = deferredSearch.toLowerCase();

    const filtered = contacts.filter(
      (c) =>
        c.name?.toLowerCase().includes(val) ||
        c.email?.toLowerCase().includes(val) ||
        c.message?.toLowerCase().includes(val),
    );

    return [...filtered].sort((a, b) => {
      const diff =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return dateSort === "newest" ? -diff : diff;
    });
  }, [contacts, deferredSearch, dateSort]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "message",
        header: "Message",
        cell: ({ row }) => (
          <div className="truncate max-w-[350px] text-gray-600">
            {row.original.message}
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-gray-500">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
      },
    ],
    [],
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
      <h2 className="text-2xl font-semibold mb-4">Contacts</h2>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-4">
        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search contacts..."
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
          <Select value={dateSort} onValueChange={setDateSort}>
            <SelectTrigger className="w-44 bg-white">
              <SelectValue placeholder="Sort by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Most Recent</SelectItem>
              <SelectItem value="oldest">Least Recent</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500">
            Loading contacts...
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
                  <td colSpan="4" className="p-10 text-center text-gray-500">
                    No contact messages received
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => {
                      setSelectedContact(row.original);
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

      <ContactMessageModal
        contact={selectedContact}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}
