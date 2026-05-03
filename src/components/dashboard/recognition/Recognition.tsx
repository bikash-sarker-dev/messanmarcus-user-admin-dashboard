"use client";

import { useState, useMemo } from "react";
import { Eye, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useGetRecognitionHistoryQuery } from "@/redux/api/dashboardHome/homeSliceApi";

// ── Types ──────────────────────────────────────────────────────────────────
interface RecognitionItem {
  _id: string;
  senderEmail: string;
  receiverEmail: string;
  image: string;
  points: number;
  message: string;
  additionalMessage?: string;
  createdAt: string;
}

// ── Detail Modal ───────────────────────────────────────────────────────────
function RecognitionModal({
  item,
  onClose,
}: {
  item: RecognitionItem;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative max-w-md overflow-hidden rounded-2xl"
        style={{ background: "#f07011" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/25 text-white hover:bg-white/40"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Body */}
        <div className="px-6 pb-4 pt-6">
          <p className="mb-4 text-2xl font-bold text-white">Greetely</p>
          <p className="text-xs text-white/75">To:</p>
          <p className="text-lg font-bold text-white">
            {item.receiverEmail.split("@")[0]}
          </p>
          <p className="mb-4 text-xs text-white/75">{item.receiverEmail}</p>

          {/* Message card */}
          <div className="mb-3 rounded-xl bg-white/20 p-4">
            <p className="text-sm leading-relaxed text-white">{item.message}</p>
          </div>

          {item.additionalMessage && (
            <p className="mb-2 text-xs text-white/80">
              {item.additionalMessage}
            </p>
          )}

          <p className="text-xs text-white/60">
            Sent by: {item.senderEmail.split("@")[0]}
          </p>
          <p className="text-xs text-white/60">
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-3.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
        >
          <span className="rounded-lg bg-white/20 px-3 py-1.5 text-sm font-medium text-white">
            Recognition
          </span>
          <span className="text-base font-bold text-white">
            {item.points} Pts
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const nums: (number | "...")[] =
    totalPages <= 6
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : [1, 2, 3, "...", totalPages];

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {nums.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-1 text-sm text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`h-8 w-8 rounded-full text-sm font-medium transition-all ${
              currentPage === p
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function RecognitionsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedItem, setSelectedItem] = useState<RecognitionItem | null>(
    null,
  );
  const [sortKey, setSortKey] = useState<keyof RecognitionItem>("createdAt");
  const [sortAsc, setSortAsc] = useState(false);

  const { data: historyRes, isLoading } = useGetRecognitionHistoryQuery({
    page: currentPage,
    limit: pageSize,
  });

  // API-driven pagination — server handles filtering
  const rows: RecognitionItem[] = historyRes?.data ?? [];
  const meta = historyRes?.meta;
  const totalPages = meta?.totalPage ?? 1;
  const total = meta?.total ?? 0;
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  // Client-side sort of current page
  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const av = a[sortKey] as string | number;
      const bv = b[sortKey] as string | number;
      if (typeof av === "string")
        return sortAsc
          ? av.localeCompare(bv as string)
          : (bv as string).localeCompare(av);
      return sortAsc
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
  }, [rows, sortKey, sortAsc]);

  function handleSort(key: keyof RecognitionItem) {
    if (sortKey === key) setSortAsc((a) => !a);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const cols: { key: keyof RecognitionItem; label: string }[] = [
    { key: "senderEmail", label: "Sender" },
    { key: "receiverEmail", label: "Recipient" },
    { key: "message", label: "Message" },
    { key: "points", label: "Points" },
    { key: "createdAt", label: "Date" },
  ];

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-100 px-5 py-5 sm:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 lg:text-3xl">
            Recognitions
          </h1>
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
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-sm text-gray-400"
                  >
                    Loading…
                  </td>
                </tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-sm text-gray-400"
                  >
                    No recognitions found.
                  </td>
                </tr>
              ) : (
                sorted.map((row, i) => (
                  <tr
                    key={row._id}
                    className={`border-b border-gray-50 transition-colors hover:bg-orange-50/40 ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}
                  >
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900 sm:px-7">
                      {row.senderEmail.split("@")[0]}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 sm:px-7">
                      {row.receiverEmail.split("@")[0]}
                    </td>
                    <td className="max-w-[200px] truncate px-5 py-3.5 text-sm text-gray-500 sm:px-7">
                      {row.message.slice(0, 55)}…
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900 sm:px-7">
                      {row.points} pts
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 sm:px-7">
                      {new Date(row.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5 sm:px-7">
                      <button
                        onClick={() => setSelectedItem(row)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 transition-colors hover:bg-orange-500"
                      >
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
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {total === 0 ? 0 : start}–{end}
            </span>{" "}
            of <span className="font-semibold text-gray-800">{total}</span>
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <RecognitionModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}
