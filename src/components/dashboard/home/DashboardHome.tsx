"use client";

import {
  useGetDashboardHomeQuery,
  useGetRecognitionHistoryQuery,
} from "@/redux/api/dashboardHome/homeSliceApi";
import React, { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface TopRecognized {
  _id: string;
  totalPoints: number;
  totalRecognitions: number;
}

interface WeeklyGraph {
  _id: number;
  total: number;
}

interface DashboardData {
  totalRecognitions: number;
  pointsDistributed: number;
  activeUsers: number;
  weeklyGraph: WeeklyGraph[];
  topRecognized: TopRecognized[];
}

interface RecognitionItem {
  _id: string;
  senderEmail: string;
  receiverEmail: string;
  image: string;
  points: number;
  message: string;
  additionalMessage: string;
  createdAt: string;
}

interface RecognitionHistoryResponse {
  data: RecognitionItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

// ── SVG Icons ────────────────────────────────────────────────────────────────

const BadgeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-6 w-6"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <circle cx="12" cy="8" r="5" />
    <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
  </svg>
);

const TrendIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-6 w-6"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const PeopleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-6 w-6"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SortIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-3 w-3"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M8 9l4-4 4 4" />
    <path d="M8 15l4 4 4-4" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-4 w-4"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const ChevronIcon = ({ dir }: { dir: "left" | "right" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-4 w-4"
    stroke="currentColor"
    strokeWidth={2}
  >
    {dir === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Extract initials from an email address */
function getInitials(email: string): string {
  const local = email.split("@")[0];
  const parts = local.split(/[._\-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

/** Format an ISO date string to "DD Mon YYYY" */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Format large numbers with commas */
function formatNumber(n: number): string {
  return n.toLocaleString();
}

// ── Chart ────────────────────────────────────────────────────────────────────

const LineChart = ({ weeklyGraph }: { weeklyGraph: WeeklyGraph[] }) => {
  const W = 660;
  const H = 220;
  const PAD = { top: 24, right: 24, bottom: 36, left: 52 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  // Use actual week IDs from API as X axis — span min to max week found
  const sorted = [...weeklyGraph].sort((a, b) => a._id - b._id);

  // If no data yet, show empty state
  if (sorted.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-400">
        No activity data available
      </div>
    );
  }

  // Determine X range: use API week IDs directly
  const minWeek = sorted[0]._id;
  const maxWeek = sorted[sorted.length - 1]._id;
  // If only one data point, give it a range so it renders centered
  const weekRange = maxWeek === minWeek ? 1 : maxWeek - minWeek;

  const maxVal = Math.max(...sorted.map((w) => w.total), 1);
  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) =>
    Math.round((maxVal / yTickCount) * i),
  );

  // Map a week _id to its SVG X coordinate
  const xPos = (weekId: number) =>
    PAD.left + ((weekId - minWeek) / weekRange) * chartW;

  // Map a value to its SVG Y coordinate
  const yPos = (v: number) => PAD.top + chartH - (v / maxVal) * chartH;

  // Build polyline / area path from real data points
  const linePoints = sorted
    .map((w) => `${xPos(w._id)},${yPos(w.total)}`)
    .join(" ");

  const areaPoints = [
    `${xPos(sorted[0]._id)},${PAD.top + chartH}`,
    ...sorted.map((w) => `${xPos(w._id)},${yPos(w.total)}`),
    `${xPos(sorted[sorted.length - 1]._id)},${PAD.top + chartH}`,
  ].join(" ");

  // X-axis labels: show every week that has data, plus nicely spaced tick marks
  const xLabels = sorted.map((w) => ({ id: w._id, label: `Wk ${w._id}` }));

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ minWidth: 320 }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y grid lines + labels */}
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              y1={yPos(t)}
              x2={W - PAD.right}
              y2={yPos(t)}
              stroke="#e5e7eb"
              strokeWidth={1}
              strokeDasharray={t === 0 ? "none" : "4 3"}
            />
            <text
              x={PAD.left - 8}
              y={yPos(t) + 4}
              textAnchor="end"
              fontSize={10}
              fill="#9ca3af"
            >
              {t}
            </text>
          </g>
        ))}

        {/* Gradient fill */}
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Area under the line */}
        <polygon points={areaPoints} fill="url(#areaGrad)" />

        {/* Line */}
        <polyline
          points={linePoints}
          fill="none"
          stroke="#f97316"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data point dots with white ring */}
        {sorted.map((w) => (
          <g key={w._id}>
            <circle
              cx={xPos(w._id)}
              cy={yPos(w.total)}
              r={5}
              fill="white"
              stroke="#f97316"
              strokeWidth={2}
            />
            <circle
              cx={xPos(w._id)}
              cy={yPos(w.total)}
              r={2.5}
              fill="#f97316"
            />
            {/* Value label above each dot */}
            <text
              x={xPos(w._id)}
              y={yPos(w.total) - 9}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill="#f97316"
            >
              {w.total}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xLabels.map(({ id, label }) => (
          <text
            key={id}
            x={xPos(id)}
            y={H - 6}
            textAnchor="middle"
            fontSize={10}
            fill="#9ca3af"
          >
            {label}
          </text>
        ))}

        {/* X axis baseline */}
        <line
          x1={PAD.left}
          y1={PAD.top + chartH}
          x2={W - PAD.right}
          y2={PAD.top + chartH}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────

const Avatar = ({ initials, faded }: { initials: string; faded?: boolean }) => (
  <div
    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
    style={{
      backgroundColor: faded ? "#fdba74" : "#f97316",
      opacity: faded ? 0.5 : 1,
    }}
  >
    {initials}
  </div>
);

const SkeletonRow = () => (
  <tr className="border-b border-gray-50">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="px-5 py-3.5">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
      </td>
    ))}
  </tr>
);

const StatCardSkeleton = () => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-start justify-between">
      <div className="h-10 w-10 animate-pulse rounded-xl bg-orange-50" />
      <div className="h-5 w-12 animate-pulse rounded-full bg-green-50" />
    </div>
    <div className="h-8 w-24 animate-pulse rounded bg-gray-100" />
    <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-100" />
  </div>
);

const columns = [
  "Sender",
  "Recipient",
  "Additional Personalized Message",
  "Points",
  "Date",
  "Status",
];

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function HomeDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: dashboardRes, isLoading: dashLoading } =
    useGetDashboardHomeQuery("");
  const { data: historyRes, isLoading: historyLoading } =
    useGetRecognitionHistoryQuery({
      page: currentPage,
      limit: pageSize,
    });

  const dashboard: DashboardData | undefined = dashboardRes?.data;
  const recognitions: RecognitionItem[] = historyRes?.data ?? [];
  const meta = historyRes?.meta;
  const totalPages = meta?.totalPage ?? 1;

  // ── Stat cards built from API data ──────────────────────────────────────────
  const statCards = [
    {
      icon: <BadgeIcon />,
      value: dashboard ? formatNumber(dashboard.totalRecognitions) : "—",
      label: "Total Recognitions",
      sub: "This Quarter",
      badge: "+12%",
    },
    {
      icon: <TrendIcon />,
      value: dashboard ? formatNumber(dashboard.pointsDistributed) : "—",
      label: "Points Distributed",
      sub: "pts",
      badge: "+12%",
    },
    {
      icon: <PeopleIcon />,
      value: dashboard ? formatNumber(dashboard.activeUsers) : "—",
      label: "Active Employees",
      sub: "",
      badge: "+12%",
    },
  ];

  return (
    <div className="">
      <div className="space-y-6">
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {dashLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <StatCardSkeleton key={i} />
              ))
            : statCards.map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-xl bg-orange-50 p-2 text-orange-500">
                      {s.icon}
                    </div>
                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-600">
                      {s.badge}
                    </span>
                  </div>
                  <p className="text-3xl font-bold tracking-tight text-slate-800">
                    {s.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{s.label}</p>
                  {s.sub && (
                    <p className="mt-0.5 text-xs text-slate-400">{s.sub}</p>
                  )}
                </div>
              ))}
        </div>

        {/* ── Chart + Top Recognized ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Chart */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-base font-semibold text-slate-800">
              Recognition Activity (Quarter)
            </h2>
            {dashLoading ? (
              <div className="h-48 w-full animate-pulse rounded-xl bg-gray-100" />
            ) : (
              <LineChart weeklyGraph={dashboard?.weeklyGraph ?? []} />
            )}
          </div>

          {/* Top Recognized */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-800">
              Top Recognized
            </h2>
            <div className="space-y-3">
              {dashLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-14 w-full animate-pulse rounded-xl bg-orange-50"
                    />
                  ))
                : (dashboard?.topRecognized ?? []).map((person, i) => {
                    const faded =
                      i === (dashboard?.topRecognized.length ?? 0) - 1 &&
                      i >= 2;
                    const initials = getInitials(person._id);
                    return (
                      <div
                        key={person._id}
                        className="flex items-center gap-3 rounded-xl bg-orange-50 p-2.5"
                        style={{ opacity: faded ? 0.5 : 1 }}
                      >
                        <Avatar initials={initials} faded={faded} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-orange-500">
                            {person._id}
                          </p>
                          <p className="text-xs text-slate-400">
                            {person.totalRecognitions} recognition
                            {person.totalRecognitions !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <span className="text-base font-bold text-orange-500">
                            {formatNumber(person.totalPoints)}
                          </span>
                          <span className="ml-0.5 text-xs text-slate-400">
                            pts
                          </span>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>

        {/* ── Recent Recognitions Table ── */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between px-5 pb-3 pt-5">
            <h2 className="text-base font-semibold text-slate-800">
              Recent Recognitions
            </h2>
            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-50">
              This Quarter <ChevronDownIcon />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold text-orange-500"
                    >
                      <span className="flex items-center gap-1">
                        {col}
                        <SortIcon />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {historyLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonRow key={i} />
                    ))
                  : recognitions.map((r) => (
                      <tr
                        key={r._id}
                        className="border-b border-gray-50 transition-colors hover:bg-gray-50/60"
                      >
                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-700">
                          {r.senderEmail}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-700">
                          {r.receiverEmail}
                        </td>
                        {/* Occasion: derive from message or show additionalMessage snippet */}
                        <td
                          className="max-w-[180px] truncate px-5 py-3.5 text-slate-600"
                          title={r.additionalMessage}
                        >
                          {r.additionalMessage.replace(
                            "AdditionalMessage ",
                            "",
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-700">
                          {r.points}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">
                          {formatDate(r.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5">
                          <span className="rounded-full border border-green-100 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-600">
                            Delivered
                          </span>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Showing</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-md border border-gray-200 px-2 py-0.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>out of {formatNumber(meta?.total ?? 0)}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-gray-50 disabled:opacity-40 lg:text-sm"
                disabled={currentPage === 1}
              >
                <ChevronIcon dir="left" /> Previous
              </button>

              {(() => {
                // Smart page window: always show up to 3 pages around current
                const pages: number[] = [];
                const start = Math.max(
                  1,
                  Math.min(currentPage - 1, totalPages - 2),
                );
                const end = Math.min(totalPages, start + 2);
                for (let n = start; n <= end; n++) pages.push(n);

                return (
                  <>
                    {start > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentPage(1)}
                          className="h-8 w-8 rounded-lg text-sm font-medium text-slate-600 transition-colors hover:bg-gray-100"
                        >
                          1
                        </button>
                        {start > 2 && (
                          <span className="px-1 text-slate-400">…</span>
                        )}
                      </>
                    )}

                    {pages.map((n) => (
                      <button
                        key={n}
                        onClick={() => setCurrentPage(n)}
                        className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === n
                            ? "bg-orange-500 text-white"
                            : "text-slate-600 hover:bg-gray-100"
                        }`}
                      >
                        {n}
                      </button>
                    ))}

                    {end < totalPages && (
                      <>
                        {end < totalPages - 1 && (
                          <span className="px-1 text-slate-400">…</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="h-8 w-8 rounded-lg text-sm font-medium text-slate-600 transition-colors hover:bg-gray-100"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </>
                );
              })()}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="flex items-center gap-1 rounded-md bg-orange-500 px-2 py-1.5 text-xs text-white transition-colors hover:bg-orange-600 disabled:opacity-40 lg:px-3 lg:text-sm"
                disabled={currentPage === totalPages}
              >
                Next <ChevronIcon dir="right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
