"use client";
import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Type definitions
interface ChartDataPoint {
  month: string;
  revenue: number;
  transactions: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
}

interface StatCardProps {
  title: string;
  value: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

// Generate sample data with proper typing
const generateData = (): ChartDataPoint[] => {
  const months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Mar",
    "Mar",
    "Mar",
    "Mar",
    "Apr",
    "May",
    "Jun",
  ];
  return months.map(
    (month: string): ChartDataPoint => ({
      month,
      revenue: 70000 + Math.random() * 50000,
      transactions: Math.floor(100 + Math.random() * 50),
    }),
  );
};

// Custom Tooltip Component
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data: ChartDataPoint = payload[0].payload;
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
        <p className="mb-1 text-sm font-semibold text-gray-700">{data.month}</p>
        <p className="text-sm text-gray-600">
          Revenue ($):{" "}
          <span className="font-semibold">
            ${data.revenue.toFixed(0).toLocaleString()}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          Transactions:{" "}
          <span className="font-semibold">{data.transactions}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  bgColor,
  textColor,
  borderColor,
}) => {
  return (
    <div className={`${bgColor} rounded-xl border p-5 ${borderColor}`}>
      <p className={`text-sm ${textColor} mb-1 font-medium`}>{title}</p>
      <p className="text-2xl font-bold text-gray-900 sm:text-3xl">{value}</p>
    </div>
  );
};

// Main Component
const RevenueGrowthChart: React.FC = () => {
  const [data] = useState<ChartDataPoint[]>(generateData());
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);

  // Calculate statistics
  const totalRevenue: number = data.reduce(
    (sum: number, item: ChartDataPoint) => sum + item.revenue,
    0,
  );
  const avgRevenue: number = totalRevenue / data.length;
  const totalTransactions: number = data.reduce(
    (sum: number, item: ChartDataPoint) => sum + item.transactions,
    0,
  );

  // Chart event handlers
  const handleMouseMove = (state: any): void => {
    if (
      state.isTooltipActive &&
      state.activePayload &&
      state.activePayload.length > 0
    ) {
      setHoveredPoint(state.activePayload[0].payload as ChartDataPoint);
    }
  };

  const handleMouseLeave = (): void => {
    setHoveredPoint(null);
  };

  // Y-axis formatter
  const formatYAxis = (value: number): string => {
    return `${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="">
        <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8 lg:p-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">
              Revenue Growth
            </h1>
            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Track your business performance over time
            </p>
          </div>

          {/* Chart Container */}
          <div className="relative w-full" style={{ height: "450px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#9ca3af"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatYAxis}
                  domain={[0, 140000]}
                  ticks={[0, 35000, 70000, 105000, 140000]}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "#8b5cf6", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                  activeDot={{
                    r: 6,
                    fill: "#8b5cf6",
                    stroke: "#fff",
                    strokeWidth: 3,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueGrowthChart;
