"use client";

import { useState, useMemo } from "react";
import { Eye, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ALL_DATA } from "./recognitionData";
import { useGetRecognitionHistoryQuery } from "@/redux/api/dashboardHome/homeSliceApi";

interface DropdownOption {
  label: string;
  value: string;
}

function FilterDropdown({
  options,
  selected,
  onSelect,
}: {
  options: DropdownOption[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedLabel =
    options.find((o) => o.value === selected)?.label ?? options[0].label;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-white px-4 py-2 text-sm font-medium transition-all ${
          open
            ? "border-orange-400 text-orange-500"
            : "border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
        }`}
      >
        {selectedLabel}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1.5 min-w-[170px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onSelect(opt.value);
                  setOpen(false);
                }}
                className={`cursor-pointer px-4 py-2.5 text-sm transition-colors ${
                  selected === opt.value
                    ? "bg-orange-50 font-medium text-orange-500"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

type SortKey =
  | "sender"
  | "recipient"
  | "occasion"
  | "points"
  | "dateVal"
  | "status";

export default function RecognitionsTable() {
  const [occasionFilter, setOccasionFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [quarterFilter, setQuarterFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(11);
  const [sortKey, setSortKey] = useState<SortKey>("dateVal");
  const [sortAsc, setSortAsc] = useState(false);

  const [pageSize, setPageSize] = useState(10);

  const { data: historyRes, isLoading: historyLoading } =
    useGetRecognitionHistoryQuery({
      page: currentPage,
      limit: pageSize,
    });

  const filtered = useMemo(() => {
    return ALL_DATA.filter((r) => {
      if (occasionFilter !== "All" && r.occasion !== occasionFilter)
        return false;
      if (deptFilter !== "All" && r.dept !== deptFilter) return false;
      if (quarterFilter !== "all" && r.quarter !== quarterFilter) return false;
      return true;
    }).sort((a, b) => {
      const av = a[sortKey],
        bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string")
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortAsc
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
  }, [occasionFilter, deptFilter, quarterFilter, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const pageData = filtered.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage,
  );

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((a) => !a);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
    setCurrentPage(1);
  }

  function resetPage() {
    setCurrentPage(1);
  }

  const pageNumbers: (number | "...")[] =
    totalPages <= 5
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : [1, 2, 3, "...", totalPages];

  const cols: { key: SortKey; label: string }[] = [
    { key: "sender", label: "Sender" },
    { key: "recipient", label: "Recipient" },
    { key: "occasion", label: "Occasion" },
    { key: "points", label: "Points" },
    { key: "dateVal", label: "Date" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="">
      <div className="">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-5 pb-4 pt-5 sm:flex-row sm:items-center sm:px-8">
            <h1 className="text-2xl font-semibold text-gray-900 lg:text-3xl">
              Recognitions
            </h1>
            <div className="flex flex-wrap gap-2">
              <FilterDropdown
                selected={quarterFilter}
                options={[
                  { label: "All Time", value: "all" },
                  { label: "This Quarter", value: "q1-2026" },
                  { label: "Last Quarter", value: "q4-2025" },
                ]}
                onSelect={(v) => {
                  setQuarterFilter(v);
                  resetPage();
                }}
              />
              <FilterDropdown
                selected={deptFilter}
                options={[
                  { label: "All Department", value: "All" },
                  { label: "Engineering", value: "Engineering" },
                  { label: "Marketing", value: "Marketing" },
                  { label: "Design", value: "Design" },
                  { label: "HR", value: "HR" },
                  { label: "Sales", value: "Sales" },
                ]}
                onSelect={(v) => {
                  setDeptFilter(v);
                  resetPage();
                }}
              />
              <FilterDropdown
                selected={occasionFilter}
                options={[
                  { label: "All Occasion", value: "All" },
                  { label: "Daily Recognition", value: "Daily Recognition" },
                  { label: "Milestone", value: "Milestone" },
                  { label: "Promotion", value: "Promotion" },
                  { label: "Welcome", value: "Welcome" },
                  { label: "Appreciation", value: "Appreciation" },
                ]}
                onSelect={(v) => {
                  setOccasionFilter(v);
                  resetPage();
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {cols.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="cursor-pointer select-none px-5 py-3.5 text-left text-sm font-semibold text-orange-500 sm:px-7"
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.label}
                        <svg
                          className="h-3 w-3 opacity-50"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="m7 15 5-5 5 5" />
                          <path d="m7 9 5 5 5-5" opacity=".4" />
                        </svg>
                      </span>
                    </th>
                  ))}
                  <th className="px-5 py-3.5 text-left text-sm font-semibold text-orange-500 sm:px-7">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-16 text-center text-sm text-gray-400"
                    >
                      No records match the selected filters.
                    </td>
                  </tr>
                ) : (
                  pageData.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`border-b border-gray-50 transition-colors hover:bg-orange-50/40 ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}
                    >
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-900 sm:px-7">
                        {row.sender}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700 sm:px-7">
                        {row.recipient}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700 sm:px-7">
                        {row.occasion}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-900 sm:px-7">
                        {row.points}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500 sm:px-7">
                        {row.date}
                      </td>
                      <td className="px-5 py-3.5 sm:px-7">
                        {row.status === "Delivered" ? (
                          <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                            Delivered
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-600">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 sm:px-7">
                        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 transition-colors hover:bg-orange-500">
                          <Eye className="h-3.5 w-3.5 text-white" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-start justify-between gap-4 border-t border-gray-100 px-5 py-3.5 sm:flex-row sm:items-center sm:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Showing</span>
              <div className="relative">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-7 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  {[5, 10, 11, 20].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
              </div>
              <span>
                of{" "}
                <span className="font-semibold text-gray-800">
                  {filtered.length}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {pageNumbers.map((p, i) =>
                p === "..." ? (
                  <span
                    key={`dots-${i}`}
                    className="px-1 text-sm text-gray-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    className={`h-8 w-8 rounded-full text-sm font-medium transition-all ${
                      safePage === p
                        ? "bg-orange-500 text-white"
                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={safePage === totalPages}
                className="flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
