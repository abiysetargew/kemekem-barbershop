"use client";
import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Appointment, Barber, Branch, Service } from "@/types/database";

const STATUSES = ["all", "pending", "confirmed", "completed", "cancelled"] as const;

export function AppointmentsTable({
  appointments,
  barbers,
  services,
  branches,
}: {
  appointments: Appointment[];
  barbers: Barber[];
  services: Service[];
  branches: Branch[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUSES)[number]>("all");

  const filtered = useMemo(() => {
    if (statusFilter === "all") return appointments;
    return appointments.filter((a) => a.status === statusFilter);
  }, [appointments, statusFilter]);

  const columns: ColumnDef<Appointment>[] = useMemo(
    () => [
      {
        accessorKey: "appointment_number",
        header: "ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold">
            {row.original.appointment_number}
          </span>
        ),
      },
      {
        accessorKey: "customer_name",
        header: "Customer",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.customer_name}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.customer_phone}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "service_id",
        header: "Service",
        cell: ({ row }) =>
          services.find((s) => s.id === row.original.service_id)?.name || "—",
      },
      {
        accessorKey: "barber_id",
        header: "Barber",
        cell: ({ row }) =>
          barbers.find((b) => b.id === row.original.barber_id)?.name || "—",
      },
      {
        accessorKey: "branch_id",
        header: "Branch",
        cell: ({ row }) =>
          branches.find((b) => b.id === row.original.branch_id)?.name || "—",
      },
      {
        accessorKey: "appointment_date",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 text-xs uppercase tracking-wider"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div>
            <div>{row.original.appointment_date}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.start_time.slice(0, 5)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const variant =
            status === "completed"
              ? "secondary"
              : status === "cancelled"
              ? "destructive"
              : status === "confirmed"
              ? "gold"
              : "outline";
          return (
            <Badge variant={variant as any} className="capitalize">
              {status}
            </Badge>
          );
        },
      },
    ],
    [barbers, services, branches]
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, ID..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-all",
                statusFilter === s
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground/50"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-4 py-3 text-left font-medium">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-border transition-colors hover:bg-muted/20">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs">
        <span className="text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {Math.max(1, table.getPageCount())}
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}