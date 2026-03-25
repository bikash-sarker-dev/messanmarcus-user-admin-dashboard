"use client";

import React, { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Quarter = "This Quarter" | "Last Quarter" | "This Year" | "Last Year";
type DeptFilter =
  | "All Department"
  | "Engineering"
  | "Sales"
  | "Marketing"
  | "Product"
  | "HR";

// ─── Data ─────────────────────────────────────────────────────────────────────
const BAR_DATA = [
  { label: "Engineering", value: 800 },
  { label: "Sales", value: 700 },
  { label: "Marketing", value: 550 },
  { label: "Product", value: 900 },
  { label: "HR", value: 300 },
  { label: "Finance", value: 650 },
  { label: "UI Design", value: 860 },
  { label: "Developer", value: 700 },
  { label: "AI Engineer", value: 460 },
  { label: "Graphics", value: 875 },
  { label: "Motion", value: 700 },
  { label: "VFX", value: 510 },
];

const PIE_DATA = [
  { label: "Excellence", value: 20, color: "#ec4899" },
  { label: "Integrity", value: 26, color: "#a855f7" },
  { label: "Collaboration", value: 15, color: "#f97316" },
  { label: "Innovation", value: 22, color: "#22c55e" },
  { label: "Leadership", value: 17, color: "#fb923c" },
];

const LINE_DATA = [
  { month: "January", value: 0 },
  { month: "February", value: 150 },
  { month: "March", value: 160 },
  { month: "April", value: 200 },
  { month: "May", value: 220 },
  { month: "June", value: 195 },
  { month: "July", value: 400 },
  { month: "August", value: 490 },
  { month: "September", value: 490 },
  { month: "October", value: 590 },
  { month: "November", value: 660 },
  { month: "December", value: 810 },
  { month: "January+", value: 870 },
];

const QUARTERS: Quarter[] = [
  "This Quarter",
  "Last Quarter",
  "This Year",
  "Last Year",
];
const DEPT_FILTERS: DeptFilter[] = [
  "All Department",
  "Engineering",
  "Sales",
  "Marketing",
  "Product",
  "HR",
];

// ─── Dropdown ─────────────────────────────────────────────────────────────────
function Dropdown<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex min-w-[140px] items-center justify-between gap-2 rounded-md border border-gray-400 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
      >
        {value}
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${value === opt ? "bg-orange-50 font-semibold text-orange-600" : "text-gray-700 hover:bg-gray-50"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ data }: { data: typeof BAR_DATA }) {
  const max = Math.max(...data.map((d) => d.value));
  const yTicks = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex min-h-0 flex-1 gap-0">
        {/* Y axis */}
        <div className="flex w-10 shrink-0 flex-col-reverse justify-between pb-6 pr-3 text-xs text-gray-400">
          {yTicks.map((t) => (
            <span key={t} className="leading-none">
              {t}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Bars + grid */}
          <div className="relative min-h-0 flex-1">
            {/* Grid lines */}
            <div className="pointer-events-none absolute inset-0 flex flex-col-reverse justify-between pb-0">
              {yTicks.map((t) => (
                <div key={t} className="w-full border-t border-gray-100" />
              ))}
            </div>

            {/* Bars */}
            <div className="absolute inset-0 flex items-end gap-1 px-1 sm:gap-2">
              {data.map((d, i) => {
                const pct = (d.value / max) * 100;
                return (
                  <div
                    key={i}
                    className="group flex h-full flex-1 cursor-pointer flex-col items-center justify-end"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Tooltip */}
                    {hovered === i && (
                      <div className="pointer-events-none absolute bottom-full z-10 mb-1 whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-xs text-white">
                        {d.label}: {d.value}
                      </div>
                    )}
                    <div
                      className="w-full rounded-t-md transition-all duration-150"
                      style={{
                        height: `${pct}%`,
                        background:
                          hovered === i
                            ? "linear-gradient(180deg, #fb923c 0%, #f97316 100%)"
                            : "linear-gradient(180deg, #f97316 0%, #ea6c00 100%)",
                        minHeight: 4,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* X labels */}
          <div className="mt-2 flex gap-1 px-1 sm:gap-2">
            {data.map((d, i) => (
              <div
                key={i}
                className="flex-1 truncate text-center text-[9px] leading-tight text-gray-400 sm:text-[10px]"
              >
                {d.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pie Chart ────────────────────────────────────────────────────────────────
function PieChart({ data }: { data: typeof PIE_DATA }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 80;
  const innerR = 0; // solid pie (no donut)
  const [hovered, setHovered] = useState<number | null>(null);

  // Convert percentages to slice paths
  let cumulative = 0;
  const slices = data.map((d, i) => {
    const startAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;
    cumulative += d.value;
    const endAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = d.value > 50 ? 1 : 0;

    const midAngle = startAngle + (endAngle - startAngle) / 2;
    const expand = hovered === i ? 8 : 0;
    const offsetX = Math.cos(midAngle) * expand;
    const offsetY = Math.sin(midAngle) * expand;

    let pathD: string;
    if (innerR === 0) {
      pathD = [
        `M ${cx + offsetX} ${cy + offsetY}`,
        `L ${x1 + offsetX} ${y1 + offsetY}`,
        `A ${r} ${r} 0 ${largeArc} 1 ${x2 + offsetX} ${y2 + offsetY}`,
        "Z",
      ].join(" ");
    } else {
      const ix1 = cx + innerR * Math.cos(startAngle);
      const iy1 = cy + innerR * Math.sin(startAngle);
      const ix2 = cx + innerR * Math.cos(endAngle);
      const iy2 = cy + innerR * Math.sin(endAngle);
      pathD = [
        `M ${x1 + offsetX} ${y1 + offsetY}`,
        `A ${r} ${r} 0 ${largeArc} 1 ${x2 + offsetX} ${y2 + offsetY}`,
        `L ${ix2 + offsetX} ${iy2 + offsetY}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1 + offsetX} ${iy1 + offsetY}`,
        "Z",
      ].join(" ");
    }

    return { ...d, pathD, midAngle, offsetX, offsetY };
  });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-40 w-40 drop-shadow-sm sm:h-48 sm:w-48"
      >
        {slices.map((s, i) => (
          <path
            key={i}
            d={s.pathD}
            fill={s.color}
            stroke="white"
            strokeWidth={2}
            className="cursor-pointer transition-transform duration-150"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ filter: hovered === i ? "brightness(1.1)" : "none" }}
          />
        ))}
      </svg>

      {/* Legend */}
      <div className="grid w-full grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex cursor-pointer items-center gap-1.5"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: d.color }}
            />
            <span className="text-sm font-bold" style={{ color: d.color }}>
              {d.value}%
            </span>
            <span className="truncate text-xs text-gray-500">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Line Chart ───────────────────────────────────────────────────────────────
function LineChart({ data }: { data: typeof LINE_DATA }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const W = 900;
  const H = 300;
  const padL = 52;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxVal = 900;
  const yTicks = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  const points = data.map((d, i) => ({
    x: padL + (i / (data.length - 1)) * chartW,
    y: padT + chartH - (d.value / maxVal) * chartH,
    ...d,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaD = [
    `M ${points[0].x} ${padT + chartH}`,
    ...points.map((p) => `L ${p.x} ${p.y}`),
    `L ${points[points.length - 1].x} ${padT + chartH}`,
    "Z",
  ].join(" ");

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ minWidth: 480 }}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((t) => {
          const y = padT + chartH - (t / maxVal) * chartH;
          return (
            <g key={t}>
              <line
                x1={padL}
                y1={y}
                x2={W - padR}
                y2={y}
                stroke="#f0f0f0"
                strokeWidth={1}
              />
              <text
                x={padL - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-gray-400 text-xs"
                fontSize={11}
              >
                {t}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#lineGrad)" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dots + tooltip trigger */}
        {points.map((p, i) => (
          <g
            key={i}
            onMouseEnter={() => setHovered(i)}
            style={{ cursor: "pointer" }}
          >
            <circle cx={p.x} cy={p.y} r={12} fill="transparent" />
            <circle
              cx={p.x}
              cy={p.y}
              r={hovered === i ? 5 : 3.5}
              fill={hovered === i ? "#f59e0b" : "white"}
              stroke="#f59e0b"
              strokeWidth={2}
              className="transition-all duration-100"
            />
            {hovered === i && (
              <g>
                <rect
                  x={p.x - 36}
                  y={p.y - 32}
                  width={72}
                  height={22}
                  rx={6}
                  fill="#1f2937"
                />
                <text
                  x={p.x}
                  y={p.y - 17}
                  textAnchor="middle"
                  fill="white"
                  fontSize={11}
                  fontWeight={600}
                >
                  {p.value} pts
                </text>
              </g>
            )}
          </g>
        ))}

        {/* X axis labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={H - 8}
            textAnchor="middle"
            fontSize={10}
            fill="#9ca3af"
          >
            {p.month.replace("+", "")}
          </text>
        ))}

        {/* Axes */}
        <line
          x1={padL}
          y1={padT}
          x2={padL}
          y2={padT + chartH}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
        <line
          x1={padL}
          y1={padT + chartH}
          x2={W - padR}
          y2={padT + chartH}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ReportsDashboard() {
  const [quarter, setQuarter] = useState<Quarter>("This Quarter");
  const [dept, setDept] = useState<DeptFilter>("All Department");

  return (
    <div className="">
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
            Reports
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <Dropdown<Quarter>
              value={quarter}
              options={QUARTERS}
              onChange={setQuarter}
            />
            <Dropdown<DeptFilter>
              value={dept}
              options={DEPT_FILTERS}
              onChange={setDept}
            />
          </div>
        </div>

        {/* ── Top Row: Bar + Pie ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Bar Chart */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-base font-bold text-gray-800">
              Recognition by Department
            </h2>
            <div className="h-64 sm:h-72">
              <BarChart data={BAR_DATA} />
            </div>
          </div>

          {/* Pie Chart */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-gray-800">
              Value Alignment Breakdown
            </h2>
            <div className="flex justify-center">
              <PieChart data={PIE_DATA} />
            </div>
          </div>
        </div>

        {/* ── Bottom Row: Line Chart ── */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-800">
            Points Distribution Trend
          </h2>
          <LineChart data={LINE_DATA} />
        </div>
      </div>
    </div>
  );
}
