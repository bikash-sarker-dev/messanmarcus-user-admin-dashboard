// "use client";

// import { useState, useMemo } from "react";
// import { Eye, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
// import { ALL_DATA } from "./recognitionData";
// import { useGetRecognitionHistoryQuery } from "@/redux/api/dashboardHome/homeSliceApi";

// interface DropdownOption {
//   label: string;
//   value: string;
// }

// function FilterDropdown({
//   options,
//   selected,
//   onSelect,
// }: {
//   options: DropdownOption[];
//   selected: string;
//   onSelect: (value: string) => void;
// }) {
//   const [open, setOpen] = useState(false);
//   const selectedLabel =
//     options.find((o) => o.value === selected)?.label ?? options[0].label;

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setOpen((o) => !o)}
//         className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-white px-4 py-2 text-sm font-medium transition-all ${
//           open
//             ? "border-orange-400 text-orange-500"
//             : "border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500"
//         }`}
//       >
//         {selectedLabel}
//         <ChevronDown className="h-3.5 w-3.5" />
//       </button>
//       {open && (
//         <>
//           <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
//           <div className="absolute left-0 top-full z-20 mt-1.5 min-w-[170px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
//             {options.map((opt) => (
//               <div
//                 key={opt.value}
//                 onClick={() => {
//                   onSelect(opt.value);
//                   setOpen(false);
//                 }}
//                 className={`cursor-pointer px-4 py-2.5 text-sm transition-colors ${
//                   selected === opt.value
//                     ? "bg-orange-50 font-medium text-orange-500"
//                     : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
//                 }`}
//               >
//                 {opt.label}
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// type SortKey =
//   | "sender"
//   | "recipient"
//   | "occasion"
//   | "points"
//   | "dateVal"
//   | "status";

// export default function RecognitionsTable() {
//   const [occasionFilter, setOccasionFilter] = useState("All");
//   const [deptFilter, setDeptFilter] = useState("All");
//   const [quarterFilter, setQuarterFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(11);
//   const [sortKey, setSortKey] = useState<SortKey>("dateVal");
//   const [sortAsc, setSortAsc] = useState(false);

//   const [pageSize, setPageSize] = useState(10);

//   const { data: historyRes, isLoading: historyLoading } =
//     useGetRecognitionHistoryQuery({
//       page: currentPage,
//       limit: pageSize,
//     });

//   const filtered = useMemo(() => {
//     return ALL_DATA.filter((r) => {
//       if (occasionFilter !== "All" && r.occasion !== occasionFilter)
//         return false;
//       if (deptFilter !== "All" && r.dept !== deptFilter) return false;
//       if (quarterFilter !== "all" && r.quarter !== quarterFilter) return false;
//       return true;
//     }).sort((a, b) => {
//       const av = a[sortKey],
//         bv = b[sortKey];
//       if (typeof av === "string" && typeof bv === "string")
//         return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
//       return sortAsc
//         ? (av as number) - (bv as number)
//         : (bv as number) - (av as number);
//     });
//   }, [occasionFilter, deptFilter, quarterFilter, sortKey, sortAsc]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
//   const safePage = Math.min(currentPage, totalPages);
//   const pageData = filtered.slice(
//     (safePage - 1) * rowsPerPage,
//     safePage * rowsPerPage,
//   );

//   function handleSort(key: SortKey) {
//     if (sortKey === key) setSortAsc((a) => !a);
//     else {
//       setSortKey(key);
//       setSortAsc(true);
//     }
//     setCurrentPage(1);
//   }

//   function resetPage() {
//     setCurrentPage(1);
//   }

//   const pageNumbers: (number | "...")[] =
//     totalPages <= 5
//       ? Array.from({ length: totalPages }, (_, i) => i + 1)
//       : [1, 2, 3, "...", totalPages];

//   const cols: { key: SortKey; label: string }[] = [
//     { key: "sender", label: "Sender" },
//     { key: "recipient", label: "Recipient" },
//     { key: "occasion", label: "Occasion" },
//     { key: "points", label: "Points" },
//     { key: "dateVal", label: "Date" },
//     { key: "status", label: "Status" },
//   ];

//   return (
//     <div className="">
//       <div className="">
//         <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
//           {/* Header */}
//           <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-5 pb-4 pt-5 sm:flex-row sm:items-center sm:px-8">
//             <h1 className="text-2xl font-semibold text-gray-900 lg:text-3xl">
//               Recognitions
//             </h1>
//             <div className="flex flex-wrap gap-2">
//               <FilterDropdown
//                 selected={quarterFilter}
//                 options={[
//                   { label: "All Time", value: "all" },
//                   { label: "This Quarter", value: "q1-2026" },
//                   { label: "Last Quarter", value: "q4-2025" },
//                 ]}
//                 onSelect={(v) => {
//                   setQuarterFilter(v);
//                   resetPage();
//                 }}
//               />
//               <FilterDropdown
//                 selected={deptFilter}
//                 options={[
//                   { label: "All Department", value: "All" },
//                   { label: "Engineering", value: "Engineering" },
//                   { label: "Marketing", value: "Marketing" },
//                   { label: "Design", value: "Design" },
//                   { label: "HR", value: "HR" },
//                   { label: "Sales", value: "Sales" },
//                 ]}
//                 onSelect={(v) => {
//                   setDeptFilter(v);
//                   resetPage();
//                 }}
//               />
//               <FilterDropdown
//                 selected={occasionFilter}
//                 options={[
//                   { label: "All Occasion", value: "All" },
//                   { label: "Daily Recognition", value: "Daily Recognition" },
//                   { label: "Milestone", value: "Milestone" },
//                   { label: "Promotion", value: "Promotion" },
//                   { label: "Welcome", value: "Welcome" },
//                   { label: "Appreciation", value: "Appreciation" },
//                 ]}
//                 onSelect={(v) => {
//                   setOccasionFilter(v);
//                   resetPage();
//                 }}
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[680px]">
//               <thead>
//                 <tr className="border-b border-gray-100">
//                   {cols.map((col) => (
//                     <th
//                       key={col.key}
//                       onClick={() => handleSort(col.key)}
//                       className="cursor-pointer select-none px-5 py-3.5 text-left text-sm font-semibold text-orange-500 sm:px-7"
//                     >
//                       <span className="inline-flex items-center gap-1">
//                         {col.label}
//                         <svg
//                           className="h-3 w-3 opacity-50"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                         >
//                           <path d="m7 15 5-5 5 5" />
//                           <path d="m7 9 5 5 5-5" opacity=".4" />
//                         </svg>
//                       </span>
//                     </th>
//                   ))}
//                   <th className="px-5 py-3.5 text-left text-sm font-semibold text-orange-500 sm:px-7">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pageData.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={7}
//                       className="py-16 text-center text-sm text-gray-400"
//                     >
//                       No records match the selected filters.
//                     </td>
//                   </tr>
//                 ) : (
//                   pageData.map((row, i) => (
//                     <tr
//                       key={row.id}
//                       className={`border-b border-gray-50 transition-colors hover:bg-orange-50/40 ${i % 2 !== 0 ? "bg-gray-50/30" : ""}`}
//                     >
//                       <td className="px-5 py-3.5 text-sm font-medium text-gray-900 sm:px-7">
//                         {row.sender}
//                       </td>
//                       <td className="px-5 py-3.5 text-sm text-gray-700 sm:px-7">
//                         {row.recipient}
//                       </td>
//                       <td className="px-5 py-3.5 text-sm text-gray-700 sm:px-7">
//                         {row.occasion}
//                       </td>
//                       <td className="px-5 py-3.5 text-sm font-medium text-gray-900 sm:px-7">
//                         {row.points}
//                       </td>
//                       <td className="px-5 py-3.5 text-sm text-gray-500 sm:px-7">
//                         {row.date}
//                       </td>
//                       <td className="px-5 py-3.5 sm:px-7">
//                         {row.status === "Delivered" ? (
//                           <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
//                             Delivered
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-600">
//                             Pending
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-5 py-3.5 sm:px-7">
//                         <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 transition-colors hover:bg-orange-500">
//                           <Eye className="h-3.5 w-3.5 text-white" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Footer */}
//           <div className="flex flex-col items-start justify-between gap-4 border-t border-gray-100 px-5 py-3.5 sm:flex-row sm:items-center sm:px-8">
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//               <span>Showing</span>
//               <div className="relative">
//                 <select
//                   value={rowsPerPage}
//                   onChange={(e) => {
//                     setRowsPerPage(Number(e.target.value));
//                     setCurrentPage(1);
//                   }}
//                   className="appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-7 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
//                 >
//                   {[5, 10, 11, 20].map((n) => (
//                     <option key={n} value={n}>
//                       {n}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
//               </div>
//               <span>
//                 of{" "}
//                 <span className="font-semibold text-gray-800">
//                   {filtered.length}
//                 </span>
//               </span>
//             </div>

//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                 disabled={safePage === 1}
//                 className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-30"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//                 <span className="hidden sm:inline">Previous</span>
//               </button>

//               {pageNumbers.map((p, i) =>
//                 p === "..." ? (
//                   <span
//                     key={`dots-${i}`}
//                     className="px-1 text-sm text-gray-400"
//                   >
//                     ...
//                   </span>
//                 ) : (
//                   <button
//                     key={p}
//                     onClick={() => setCurrentPage(p as number)}
//                     className={`h-8 w-8 rounded-full text-sm font-medium transition-all ${
//                       safePage === p
//                         ? "bg-orange-500 text-white"
//                         : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
//                     }`}
//                   >
//                     {p}
//                   </button>
//                 ),
//               )}

//               <button
//                 onClick={() =>
//                   setCurrentPage((p) => Math.min(totalPages, p + 1))
//                 }
//                 disabled={safePage === totalPages}
//                 className="flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-30"
//               >
//                 <span className="hidden sm:inline">Next</span>
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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
        className="relative w-[340px] max-w-[95vw] overflow-hidden rounded-2xl"
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
