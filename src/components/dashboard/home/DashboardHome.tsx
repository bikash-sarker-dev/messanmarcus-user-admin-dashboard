"use client";

import {
  useGetDashboardHomeQuery,
  useGetRecognitionHistroyQuery,
} from "@/redux/api/dashboardHome/homeSliceApi";
import React, { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub: string;
  badge: string;
}

interface TopPerson {
  initials: string;
  name: string;
  email: string;
  pts: number;
  faded?: boolean;
}

interface Recognition {
  sender: string;
  recipient: string;
  occasion: string;
  points: number;
  date: string;
  status: "Delivered" | "Pending";
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

// ── Chart ────────────────────────────────────────────────────────────────────

const chartData = [210, 135, 30, 300, 230, 620, 510, 640, 740, 620, 820, 620];
const weeks = Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`);

const LineChart = () => {
  const W = 660;
  const H = 220;
  const PAD = { top: 20, right: 20, bottom: 30, left: 48 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const max = 900;
  const yTicks = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  const xPos = (i: number) => PAD.left + (i / (chartData.length - 1)) * chartW;
  const yPos = (v: number) => PAD.top + chartH - (v / max) * chartH;

  const points = chartData.map((v, i) => `${xPos(i)},${yPos(v)}`).join(" ");
  const areaPoints = [
    `${xPos(0)},${PAD.top + chartH}`,
    ...chartData.map((v, i) => `${xPos(i)},${yPos(v)}`),
    `${xPos(chartData.length - 1)},${PAD.top + chartH}`,
  ].join(" ");

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ minWidth: 320 }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y grid lines */}
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              y1={yPos(t)}
              x2={W - PAD.right}
              y2={yPos(t)}
              stroke="#e5e7eb"
              strokeWidth={1}
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

        {/* Area fill */}
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#areaGrad)" />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="#f97316"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dots */}
        {chartData.map((v, i) => (
          <circle key={i} cx={xPos(i)} cy={yPos(v)} r={3.5} fill="#f97316" />
        ))}

        {/* X labels */}
        {weeks.map((w, i) => (
          <text
            key={i}
            x={xPos(i)}
            y={H - 4}
            textAnchor="middle"
            fontSize={9}
            fill="#9ca3af"
          >
            {w}
          </text>
        ))}
      </svg>
    </div>
  );
};

// ── Data ─────────────────────────────────────────────────────────────────────

const stats: StatCard[] = [
  {
    icon: <BadgeIcon />,
    value: "1,248",
    label: "Total Recognitions",
    sub: "This Quarter",
    badge: "+12%",
  },
  {
    icon: <TrendIcon />,
    value: "48,200",
    label: "Points Distributed",
    sub: "pts",
    badge: "+12%",
  },
  {
    icon: <PeopleIcon />,
    value: "142",
    label: "Active Employees",
    sub: "",
    badge: "+12%",
  },
];

const topPeople: TopPerson[] = [
  {
    initials: "SA",
    name: "Sarah Ahmed",
    email: "sarah.ahmed@company.com",
    pts: 100,
  },
  {
    initials: "KM",
    name: "Kathryn Murphy",
    email: "kenzi.lawson@example.com",
    pts: 100,
  },
  {
    initials: "MM",
    name: "Marvin McKinney",
    email: "debbie.baker@example.com",
    pts: 100,
  },
  {
    initials: "MM",
    name: "Marvin McKinney",
    email: "debbie.baker@example.com",
    pts: 100,
  },
  {
    initials: "MM",
    name: "Marvin McKinney",
    email: "debbie.baker@example.com",
    pts: 100,
    faded: true,
  },
];

const recognitions: Recognition[] = [
  {
    sender: "Kristin Watson",
    recipient: "Kristin Watson",
    occasion: "Daily Recognition",
    points: 100,
    date: "12 Jan 2026",
    status: "Delivered",
  },
  {
    sender: "Annette Black",
    recipient: "Annette Black",
    occasion: "Milestone",
    points: 200,
    date: "12 Jan 2026",
    status: "Delivered",
  },
  {
    sender: "Jacob Jones",
    recipient: "Jacob Jones",
    occasion: "Promotion",
    points: 150,
    date: "12 Jan 2026",
    status: "Delivered",
  },
  {
    sender: "Arlene McCoy",
    recipient: "Arlene McCoy",
    occasion: "Welcome",
    points: 120,
    date: "12 Jan 2026",
    status: "Delivered",
  },
  {
    sender: "Cody Fisher",
    recipient: "Cody Fisher",
    occasion: "Appreciation",
    points: 50,
    date: "12 Jan 2026",
    status: "Delivered",
  },
];

const columns = ["Sender", "Recipient", "Occasion", "Points", "Date", "Status"];

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

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function HomeDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 16;

  // hooks api

  const { data, isLoading } = useGetDashboardHomeQuery("");
  const { data: recongitionHistory, isLoading: RecongLoading } =
    useGetRecognitionHistroyQuery("");

  return (
    <div className="">
      <div className="space-y-6">
        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s, i) => (
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
            <LineChart />
          </div>

          {/* Top Recognized */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-800">
              Top Recognized
            </h2>
            <div className="space-y-3">
              {topPeople.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl bg-orange-50 p-2.5"
                  style={{ opacity: p.faded ? 0.5 : 1 }}
                >
                  <Avatar initials={p.initials} faded={p.faded} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-orange-500">
                      {p.name}
                    </p>
                    <p className="truncate text-xs text-slate-400">{p.email}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-base font-bold text-orange-500">
                      {p.pts}
                    </span>
                    <span className="ml-0.5 text-xs text-slate-400">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Recognitions Table ── */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* Table header row */}
          <div className="flex items-center justify-between px-5 pb-3 pt-5">
            <h2 className="text-base font-semibold text-slate-800">
              Recent Recognitions
            </h2>
            <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-50">
              This Quarter <ChevronDownIcon />
            </button>
          </div>

          {/* Table */}
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
                {recognitions.map((r, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-50 transition-colors hover:bg-gray-50/60"
                  >
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-700">
                      {r.sender}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-700">
                      {r.recipient}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                      {r.occasion}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-700">
                      {r.points}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-500">
                      {r.date}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span className="rounded-full border border-green-100 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-600">
                        {r.status}
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
              <select className="rounded-md border border-gray-200 px-2 py-0.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-300">
                <option>11</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span>out of 1,450</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:bg-gray-50 disabled:opacity-40 lg:text-sm"
                disabled={currentPage === 1}
              >
                <ChevronIcon dir="left" /> Previous
              </button>

              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`h-4 w-4 rounded-lg text-xs font-medium transition-colors lg:h-8 lg:w-8 lg:text-sm ${
                    currentPage === n
                      ? "bg-orange-500 text-white"
                      : "text-slate-600 hover:bg-gray-100"
                  }`}
                >
                  {n}
                </button>
              ))}

              <span className="px-1 text-slate-400">…</span>

              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? "bg-orange-500 text-white"
                    : "text-slate-600 hover:bg-gray-100"
                }`}
              >
                {totalPages}
              </button>

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
