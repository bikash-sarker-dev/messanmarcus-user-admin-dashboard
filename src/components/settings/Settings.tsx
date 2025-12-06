"use client";
import React, { useState } from "react";
import { Settings, Database, Globe, Bell } from "lucide-react";

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? "bg-blue-600" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

interface SettingCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const SettingCard: React.FC<SettingCardProps> = ({
  icon,
  title,
  subtitle,
  children,
}) => (
  <div className="rounded-lg border border-gray-200 bg-white p-6">
    <div className="mb-6 flex items-start gap-3">
      <div className="rounded-lg bg-blue-50 p-2 text-blue-600">{icon}</div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

const Setting: React.FC = () => {
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [autoComplete, setAutoComplete] = useState(true);
  const [smartAnalytics, setSmartAnalytics] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* AI Settings */}
          <SettingCard
            icon={<Settings size={20} />}
            title="AI Settings"
            subtitle="Configure AI-powered features"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">AI Suggestions</h3>
                  <p className="text-sm text-gray-500">
                    Enable AI-powered suggestions
                  </p>
                </div>
                <Toggle enabled={aiSuggestions} onChange={setAiSuggestions} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Auto-complete</h3>
                  <p className="text-sm text-gray-500">
                    AI-powered auto-complete
                  </p>
                </div>
                <Toggle enabled={autoComplete} onChange={setAutoComplete} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Smart Analytics</h3>
                  <p className="text-sm text-gray-500">AI-driven insights</p>
                </div>
                <Toggle enabled={smartAnalytics} onChange={setSmartAnalytics} />
              </div>
            </div>
          </SettingCard>

          {/* Storage Limits */}
          <SettingCard
            icon={<Database size={20} />}
            title="Storage Limits"
            subtitle="Manage storage quotas"
          >
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Free Tier Storage (GB)
                </label>
                <input
                  type="text"
                  value="5"
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Pro Tier Storage (GB)
                </label>
                <input
                  type="text"
                  value="100"
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Enterprise Tier Storage (GB)
                </label>
                <input
                  type="text"
                  value="1000"
                  readOnly
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900"
                />
              </div>
            </div>
          </SettingCard>

          {/* Localization */}
          <SettingCard
            icon={<Globe size={20} />}
            title="Localization"
            subtitle="Language and region settings"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Default Language
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Chinese</option>
              </select>
            </div>
          </SettingCard>

          {/* Notifications */}
          <SettingCard
            icon={<Bell size={20} />}
            title="Notifications"
            subtitle="Configure notification preferences"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-gray-500">Send email updates</p>
                </div>
                <Toggle
                  enabled={emailNotifications}
                  onChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Push Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Browser push notifications
                  </p>
                </div>
                <Toggle
                  enabled={pushNotifications}
                  onChange={setPushNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Slack Notifications
                  </h3>
                  <p className="text-sm text-gray-500">Send alerts to Slack</p>
                </div>
                <Toggle
                  enabled={slackNotifications}
                  onChange={setSlackNotifications}
                />
              </div>
            </div>
          </SettingCard>
        </div>
      </div>
    </div>
  );
};

export default Setting;
