import React from "react";
import { TrendingUp, TrendingDown, Users } from "lucide-react";
import Link from "next/link";

interface Metric {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

interface Plan {
  name: string;
  highlighted: boolean;
  description: string;
  price: number;
  features: string[];
}

interface Distribution {
  plan: string;
  users: number;
  percentage: number;
  color: string;
}

const SubscriptionPlan: React.FC = () => {
  const metrics: Metric[] = [
    {
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      label: "Monthly Recurring Revenue",
      value: "12,458",
      change: "+12.5% from last month",
      positive: true,
    },
    {
      icon: <TrendingDown className="h-5 w-5 text-red-500" />,
      label: "Churn Rate",
      value: "8,234",
      change: "+8.2% from last month",
      positive: false,
    },
    {
      icon: <Users className="h-5 w-5 text-blue-500" />,
      label: "Active Subscriptions",
      value: "3200",
      change: "+2.4% from last month",
      positive: true,
    },
  ];

  const plans: Plan[] = [
    {
      name: "Basic",
      highlighted: false,
      description:
        "The Slate necessities. Every thing you need to get up and running.",
      price: 16.0,
      features: [
        "3 meeting preparations per month",
        "Basic company insights",
        "Meeting summary export",
        "Email support",
      ],
    },
    {
      name: "Basic",
      highlighted: true,
      description:
        "The Slate necessities. Every thing you need to get up and running.",
      price: 16.0,
      features: [
        "Unlimited meeting preparations",
        "Advanced AI insights & scripts",
        "Competitor analysis",
        "Risk alerts & red flags",
        "Meeting templates",
        "Priority support",
        "Team collaboration (coming soon)",
      ],
    },
    {
      name: "Basic",
      highlighted: false,
      description:
        "The Slate necessities. Every thing you need to get up and running.",
      price: 16.0,
      features: [
        "Unlimited meeting preparations",
        "Team collaboration (coming soon)",
        "Competitor analysis",
        "Risk alerts & red flags",
        "Priority support",
        "Advanced AI insights & scripts",
      ],
    },
  ];

  const distribution: Distribution[] = [
    { plan: "Free", users: 4224, percentage: 34, color: "bg-gray-400" },
    { plan: "Pro", users: 5834, percentage: 47, color: "bg-purple-600" },
    { plan: "Enterprise", users: 2400, percentage: 19, color: "bg-purple-900" },
  ];

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Subscription Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage pricing plans and monitor subscription metrics
            </p>
          </div>
          <Link
            href={`/subscriptions/add-plan`}
            className="rounded-lg bg-purple-600 px-6 py-2.5 font-medium text-white transition hover:bg-purple-700"
          >
            Add New Plan
          </Link>
        </div>

        {/* Metrics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {metrics.map((metric: Metric, index: number) => (
            <div key={index} className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-2">{metric.icon}</div>
              <p className="mb-2 text-sm text-gray-600">{metric.label}</p>
              <p className="mb-2 text-3xl font-bold text-gray-900">
                {metric.value}
              </p>
              <p
                className={`text-sm ${metric.positive ? "text-green-600" : "text-red-600"}`}
              >
                {metric.change}
              </p>
            </div>
          ))}
        </div>

        {/* Subscription Plans */}
        <div className="mb-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Subscription Management
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan: Plan, index: number) => (
              <div
                key={index}
                className={`rounded-lg bg-white p-6 shadow-sm ${plan.highlighted ? "ring-2 ring-purple-600" : ""}`}
              >
                <div
                  className={`mb-4 inline-block rounded-full px-4 py-1 text-sm font-medium ${
                    plan.highlighted
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {plan.name}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-gray-600">
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price.toFixed(2)}
                  </span>
                  <span className="ml-2 text-gray-500">/Month</span>
                </div>
                <div className="mb-6">
                  <p className="mb-3 text-sm font-semibold text-gray-900">
                    Featured Include :
                  </p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <svg
                          className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={`/subscriptions/edit-plan`}
                  className="flex w-full items-center justify-center gap-2 font-medium text-gray-700 transition hover:text-purple-600"
                >
                  Edit Plan
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Distribution */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Subscription Distribution
          </h2>
          <div className="space-y-4">
            {distribution.map((item: Distribution, index: number) => (
              <div key={index}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {item.plan}
                  </span>
                  <span className="text-sm text-gray-500">
                    {item.users} users ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
