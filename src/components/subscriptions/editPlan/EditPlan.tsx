"use client";
import React, { useState } from "react";
import { Info, DollarSign, Zap } from "lucide-react";

interface Features {
  aiPersona: boolean;
  questionRecommender: boolean;
  dealIntelligence: boolean;
  multiLanguage: boolean;
  dashboardAnalytics: boolean;
  prioritySupport: boolean;
}

interface PlanData {
  planName: string;
  status: boolean;
  description: string;
  monthlyPrice: string;
  annualPrice: string;
  currency: string;
  maxMeetings: string;
  maxAiSimulations: string;
  storageLimit: string;
  features: Features;
}

interface FeatureItem {
  key: keyof Features;
  label: string;
}

export default function EidtPlan() {
  const [planData, setPlanData] = useState<PlanData>({
    planName: "Pro",
    status: true,
    description: "Brief description of the plan",
    monthlyPrice: "29",
    annualPrice: "29",
    currency: "USD ($)",
    maxMeetings: "100",
    maxAiSimulations: "50",
    storageLimit: "100",
    features: {
      aiPersona: true,
      questionRecommender: true,
      dealIntelligence: false,
      multiLanguage: true,
      dashboardAnalytics: true,
      prioritySupport: false,
    },
  });

  const handleInputChange = (
    field: keyof Omit<PlanData, "features">,
    value: string | boolean,
  ): void => {
    setPlanData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature: keyof Features): void => {
    setPlanData((prev) => ({
      ...prev,
      features: { ...prev.features, [feature]: !prev.features[feature] },
    }));
  };

  const featureList: FeatureItem[] = [
    { key: "aiPersona", label: "AI Persona Customization" },
    { key: "questionRecommender", label: "Question Recommender" },
    { key: "dealIntelligence", label: "Deal Intelligence" },
    { key: "multiLanguage", label: "Multi-language Support" },
    { key: "dashboardAnalytics", label: "Dashboard Analytics" },
    { key: "prioritySupport", label: "Priority Support" },
  ];

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Edit Subscription Plan
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Modify plan details, pricing, features, and visibility settings
          </p>
        </div>

        {/* Plan Information Section */}
        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Plan Information
            </h2>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Plan Name
              </label>
              <input
                type="text"
                value={planData.planName}
                onChange={(e) => handleInputChange("planName", e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                <span className="text-sm text-gray-700">Active</span>
                <button
                  onClick={() => handleInputChange("status", !planData.status)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    planData.status ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  aria-label="Toggle status"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      planData.status ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={planData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Monthly Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="text"
                  value={planData.monthlyPrice}
                  onChange={(e) =>
                    handleInputChange("monthlyPrice", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-7 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Annual Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="text"
                  value={planData.annualPrice}
                  onChange={(e) =>
                    handleInputChange("annualPrice", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-7 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                value={planData.currency}
                onChange={(e) => handleInputChange("currency", e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feature Limits Section */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Feature Limits
            </h2>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Max Meetings per Month
              </label>
              <input
                type="text"
                value={planData.maxMeetings}
                onChange={(e) =>
                  handleInputChange("maxMeetings", e.target.value)
                }
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Max AI Simulations
              </label>
              <input
                type="text"
                value={planData.maxAiSimulations}
                onChange={(e) =>
                  handleInputChange("maxAiSimulations", e.target.value)
                }
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Storage Limit (GB)
            </label>
            <input
              type="text"
              value={planData.storageLimit}
              onChange={(e) =>
                handleInputChange("storageLimit", e.target.value)
              }
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Feature Toggles */}
          <div className="space-y-3">
            {featureList.map((feature, idx) => (
              <div
                key={feature.key}
                className={`flex items-center justify-between rounded-md p-3 ${idx % 2 === 0 ? "bg-gray-50" : ""}`}
              >
                <span className="text-sm text-gray-700">{feature.label}</span>
                <button
                  onClick={() => handleFeatureToggle(feature.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    planData.features[feature.key]
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
                  aria-label={`Toggle ${feature.label}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      planData.features[feature.key]
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Plan
          </button>

          <div className="flex gap-3">
            <button className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
              Reset to Default
            </button>
            <button className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300">
              Cancel
            </button>
            <button className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
