"use client";
import React from "react";
import { Users, CreditCard, DollarSign, TrendingUp } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  iconBgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  change,
  iconBgColor,
}) => {
  const isPositive = change.startsWith("+");

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div
        className={`${iconBgColor} mb-4 flex h-12 w-12 items-center justify-center rounded-lg`}
      >
        {icon}
      </div>
      <h3 className="mb-1 text-sm font-medium text-gray-500">{title}</h3>
      <p className="mb-2 text-3xl font-bold text-gray-900">{value}</p>
      <p
        className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
      >
        {change} from last month
      </p>
    </div>
  );
};

export default function DashboardOverview() {
  const stats = [
    {
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: "Total Users",
      value: "12,458",
      change: "+12.5%",
      iconBgColor: "bg-purple-100",
    },
    {
      icon: <CreditCard className="h-6 w-6 text-purple-600" />,
      title: "Active Subscriptions",
      value: "8,234",
      change: "+8.2%",
      iconBgColor: "bg-purple-100",
    },
    {
      icon: <DollarSign className="h-6 w-6 text-purple-600" />,
      title: "Monthly Revenue",
      value: "$124,567",
      change: "+15.3%",
      iconBgColor: "bg-purple-100",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
      title: "Subscription Health",
      value: "94.2%",
      change: "+2.4%",
      iconBgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-600 sm:text-base">
            Manage all users, buyers, sellers, and dealers
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              iconBgColor={stat.iconBgColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
