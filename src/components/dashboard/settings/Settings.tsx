// "use client";
// import React, { useState } from "react";
// import { Settings, Database, Globe, Bell } from "lucide-react";

// interface ToggleProps {
//   enabled: boolean;
//   onChange: (enabled: boolean) => void;
// }

// const Toggle: React.FC<ToggleProps> = ({ enabled, onChange }) => (
//   <button
//     onClick={() => onChange(!enabled)}
//     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//       enabled ? "bg-blue-600" : "bg-gray-300"
//     }`}
//   >
//     <span
//       className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//         enabled ? "translate-x-6" : "translate-x-1"
//       }`}
//     />
//   </button>
// );

// interface SettingCardProps {
//   icon: React.ReactNode;
//   title: string;
//   subtitle: string;
//   children: React.ReactNode;
// }

// const SettingCard: React.FC<SettingCardProps> = ({
//   icon,
//   title,
//   subtitle,
//   children,
// }) => (
//   <div className="rounded-lg border border-gray-200 bg-white p-6">
//     <div className="mb-6 flex items-start gap-3">
//       <div className="rounded-lg bg-blue-50 p-2 text-blue-600">{icon}</div>
//       <div>
//         <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
//         <p className="text-sm text-gray-500">{subtitle}</p>
//       </div>
//     </div>
//     {children}
//   </div>
// );

// const Setting: React.FC = () => {
//   const [aiSuggestions, setAiSuggestions] = useState(true);
//   const [autoComplete, setAutoComplete] = useState(true);
//   const [smartAnalytics, setSmartAnalytics] = useState(false);
//   const [emailNotifications, setEmailNotifications] = useState(true);
//   const [pushNotifications, setPushNotifications] = useState(true);
//   const [slackNotifications, setSlackNotifications] = useState(false);

//   return (
//     <div className="min-h-screen">
//       <div className="">
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//           {/* AI Settings */}
//           <SettingCard
//             icon={<Settings size={20} />}
//             title="AI Settings"
//             subtitle="Configure AI-powered features"
//           >
//             <div className="space-y-5">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="font-medium text-gray-900">AI Suggestions</h3>
//                   <p className="text-sm text-gray-500">
//                     Enable AI-powered suggestions
//                   </p>
//                 </div>
//                 <Toggle enabled={aiSuggestions} onChange={setAiSuggestions} />
//               </div>

//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="font-medium text-gray-900">Auto-complete</h3>
//                   <p className="text-sm text-gray-500">
//                     AI-powered auto-complete
//                   </p>
//                 </div>
//                 <Toggle enabled={autoComplete} onChange={setAutoComplete} />
//               </div>

//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="font-medium text-gray-900">Smart Analytics</h3>
//                   <p className="text-sm text-gray-500">AI-driven insights</p>
//                 </div>
//                 <Toggle enabled={smartAnalytics} onChange={setSmartAnalytics} />
//               </div>
//             </div>
//           </SettingCard>

//           {/* Storage Limits */}
//           <SettingCard
//             icon={<Database size={20} />}
//             title="Storage Limits"
//             subtitle="Manage storage quotas"
//           >
//             <div className="space-y-4">
//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Free Tier Storage (GB)
//                 </label>
//                 <input
//                   type="text"
//                   value="5"
//                   readOnly
//                   className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Pro Tier Storage (GB)
//                 </label>
//                 <input
//                   type="text"
//                   value="100"
//                   readOnly
//                   className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-medium text-gray-700">
//                   Enterprise Tier Storage (GB)
//                 </label>
//                 <input
//                   type="text"
//                   value="1000"
//                   readOnly
//                   className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900"
//                 />
//               </div>
//             </div>
//           </SettingCard>

//           {/* Localization */}
//           <SettingCard
//             icon={<Globe size={20} />}
//             title="Localization"
//             subtitle="Language and region settings"
//           >
//             <div>
//               <label className="mb-2 block text-sm font-medium text-gray-700">
//                 Default Language
//               </label>
//               <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
//                 <option>English (US)</option>
//                 <option>Spanish</option>
//                 <option>French</option>
//                 <option>German</option>
//                 <option>Chinese</option>
//               </select>
//             </div>
//           </SettingCard>

//           {/* Notifications */}
//           <SettingCard
//             icon={<Bell size={20} />}
//             title="Notifications"
//             subtitle="Configure notification preferences"
//           >
//             <div className="space-y-5">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="font-medium text-gray-900">
//                     Email Notifications
//                   </h3>
//                   <p className="text-sm text-gray-500">Send email updates</p>
//                 </div>
//                 <Toggle
//                   enabled={emailNotifications}
//                   onChange={setEmailNotifications}
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="font-medium text-gray-900">
//                     Push Notifications
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     Browser push notifications
//                   </p>
//                 </div>
//                 <Toggle
//                   enabled={pushNotifications}
//                   onChange={setPushNotifications}
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="font-medium text-gray-900">
//                     Slack Notifications
//                   </h3>
//                   <p className="text-sm text-gray-500">Send alerts to Slack</p>
//                 </div>
//                 <Toggle
//                   enabled={slackNotifications}
//                   onChange={setSlackNotifications}
//                 />
//               </div>
//             </div>
//           </SettingCard>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Setting;

"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

// ─── NOTE ─────────────────────────────────────────────────────────────────────
// Install dependency:  npm install react-hook-form
// ─────────────────────────────────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "general" | "points" | "branding";

interface GeneralForm {
  companyName: string;
  companyEmail: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PointsForm {
  quarterlyAllocation: number;
  maxPointsPerRecognition: number;
  quarterResetDate: string;
}

interface BrandingForm {
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  companyTagline: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconUser({ active }: { active: boolean }) {
  return (
    <svg
      className={`h-4 w-4 ${active ? "text-white" : "text-gray-500"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}
function IconPoints({ active }: { active: boolean }) {
  return (
    <svg
      className={`h-4 w-4 ${active ? "text-white" : "text-gray-500"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
function IconBranding({ active }: { active: boolean }) {
  return (
    <svg
      className={`h-4 w-4 ${active ? "text-white" : "text-gray-500"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
      />
    </svg>
  );
}
function IconSave({ className }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
      />
    </svg>
  );
}
function IconEye({ show }: { show: boolean }) {
  return show ? (
    <svg
      className="h-4 w-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  ) : (
    <svg
      className="h-4 w-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg
      className="h-4 w-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

// ─── Shared field components ──────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-sm font-bold text-gray-800">
      {children}
    </label>
  );
}
function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-gray-400">{children}</p>;
}
function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="mt-1.5 text-xs text-red-500">{message}</p>
  ) : null;
}

const inputBase =
  "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all placeholder:text-gray-300 focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400";
const inputNormal = `${inputBase} border-gray-200 bg-white text-gray-800`;
const inputError = `${inputBase} border-red-300 bg-red-50/30 text-gray-800`;

// ─── Success Toast ────────────────────────────────────────────────────────────
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-gray-900 px-5 py-3 text-white shadow-2xl duration-300">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500">
        <svg
          className="h-3.5 w-3.5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

// ─── General Tab ─────────────────────────────────────────────────────────────
function GeneralTab({ onSaved }: { onSaved: () => void }) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GeneralForm>({
    defaultValues: {
      companyName: "Greetely",
      companyEmail: "greetely.xyz@gmail.com",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  async function onSubmit(data: GeneralForm) {
    await new Promise((r) => setTimeout(r, 600));
    console.log("General saved:", data);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* ── General Settings ── */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900">General Settings</h2>

          <div>
            <FieldLabel>Company Name</FieldLabel>
            <input
              {...register("companyName", {
                required: "Company name is required",
              })}
              placeholder="Greetely"
              className={errors.companyName ? inputError : inputNormal}
            />
            <FieldError message={errors.companyName?.message} />
          </div>

          <div>
            <FieldLabel>Company Email</FieldLabel>
            <input
              {...register("companyEmail", {
                required: "Company email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Enter a valid email",
                },
              })}
              type="email"
              placeholder="greetely.xyz@gmail.com"
              className={errors.companyEmail ? inputError : inputNormal}
            />
            <FieldError message={errors.companyEmail?.message} />
          </div>
        </div>

        {/* ── Change Password ── */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Change Password</h2>

          {/* Old Password */}
          <div>
            <FieldLabel>Old Password</FieldLabel>
            <div className="relative">
              <input
                {...register("oldPassword", {
                  minLength: { value: 1, message: "Old password is required" },
                })}
                type={showOld ? "text" : "password"}
                placeholder="••••••••••"
                className={`${errors.oldPassword ? inputError : inputNormal} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <IconEye show={showOld} />
              </button>
            </div>
            <FieldError message={errors.oldPassword?.message} />
          </div>

          {/* New Password */}
          <div>
            <FieldLabel>Enter New Password</FieldLabel>
            <div className="relative">
              <input
                {...register("newPassword", {
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                type={showNew ? "text" : "password"}
                placeholder="••••••••••"
                className={`${errors.newPassword ? inputError : inputNormal} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <IconEye show={showNew} />
              </button>
            </div>
            <FieldError message={errors.newPassword?.message} />
          </div>

          {/* Confirm Password */}
          <div>
            <FieldLabel>Confirm New Password</FieldLabel>
            <div className="relative">
              <input
                {...register("confirmPassword", {
                  validate: (val) =>
                    !newPassword ||
                    val === newPassword ||
                    "Passwords do not match",
                })}
                type={showConf ? "text" : "password"}
                placeholder="••••••••••"
                className={`${errors.confirmPassword ? inputError : inputNormal} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConf(!showConf)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <IconEye show={showConf} />
              </button>
            </div>
            <FieldError message={errors.confirmPassword?.message} />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="mt-10 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-md bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <IconSave />
          {isSubmitting ? "Saving…" : "Update Changes"}
        </button>
      </div>
    </form>
  );
}

// ─── Points Allocation Tab ────────────────────────────────────────────────────
function PointsTab({ onSaved }: { onSaved: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PointsForm>({
    defaultValues: {
      quarterlyAllocation: 10000,
      maxPointsPerRecognition: 1000,
      quarterResetDate: "2026-07-31",
    },
  });

  async function onSubmit(data: PointsForm) {
    await new Promise((r) => setTimeout(r, 600));
    console.log("Points saved:", data);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="max-w-xl space-y-8">
        <h2 className="text-lg font-bold text-gray-900">Points Allocation</h2>

        {/* Quarterly Allocation */}
        <div>
          <FieldLabel>Quarterly Allocation per Employee</FieldLabel>
          <div className="relative">
            <input
              {...register("quarterlyAllocation", {
                required: "This field is required",
                min: { value: 1, message: "Must be at least 1" },
                valueAsNumber: true,
              })}
              type="number"
              placeholder="10,000"
              className={`${errors.quarterlyAllocation ? inputError : inputNormal} pr-14`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-amber-500">
              pts
            </span>
          </div>
          <FieldError message={errors.quarterlyAllocation?.message} />
          <FieldHint>
            Each employee will receive this amount at the start of every quarter
          </FieldHint>
        </div>

        {/* Max Points per Recognition */}
        <div>
          <FieldLabel>Maximum Points per Recognition</FieldLabel>
          <div className="relative">
            <input
              {...register("maxPointsPerRecognition", {
                required: "This field is required",
                min: { value: 1, message: "Must be at least 1" },
                valueAsNumber: true,
              })}
              type="number"
              placeholder="1,000"
              className={`${errors.maxPointsPerRecognition ? inputError : inputNormal} pr-14`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-amber-500">
              pts
            </span>
          </div>
          <FieldError message={errors.maxPointsPerRecognition?.message} />
          <FieldHint>
            The maximum points that can be awarded in a single recognition
          </FieldHint>
        </div>

        {/* Quarter Reset Date */}
        <div>
          <FieldLabel>Quarter Reset Date</FieldLabel>
          <div className="relative">
            <input
              {...register("quarterResetDate", {
                required: "Reset date is required",
              })}
              type="date"
              className={`${errors.quarterResetDate ? inputError : inputNormal} pr-10`}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <IconCalendar />
            </span>
          </div>
          <FieldError message={errors.quarterResetDate?.message} />
          <FieldHint>Next quarter starts on this date</FieldHint>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-md bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <IconSave />
            {isSubmitting ? "Saving…" : "Update Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

// ─── Branding Tab ─────────────────────────────────────────────────────────────
function BrandingTab({ onSaved }: { onSaved: () => void }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BrandingForm>({
    defaultValues: {
      primaryColor: "#f97316",
      accentColor: "#fbbf24",
      logoUrl: "",
      companyTagline: "",
    },
  });

  const primaryColor = watch("primaryColor");
  const accentColor = watch("accentColor");

  async function onSubmit(data: BrandingForm) {
    await new Promise((r) => setTimeout(r, 600));
    console.log("Branding saved:", data);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="max-w-xl space-y-8">
        <h2 className="text-lg font-bold text-gray-900">Branding</h2>

        {/* Primary Color */}
        <div>
          <FieldLabel>Primary Color</FieldLabel>
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <input
                {...register("primaryColor", {
                  required: "Primary color is required",
                })}
                type="color"
                className="h-12 w-12 cursor-pointer rounded-xl border border-gray-200 p-1 outline-none focus:ring-2 focus:ring-orange-400/30"
              />
            </div>
            <div className="relative flex-1">
              <input
                {...register("primaryColor")}
                type="text"
                placeholder="#f97316"
                className={inputNormal}
              />
              <span
                className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-gray-200"
                style={{ background: primaryColor }}
              />
            </div>
          </div>
          <FieldHint>
            Used for buttons, highlights, and key UI elements
          </FieldHint>
        </div>

        {/* Accent Color */}
        <div>
          <FieldLabel>Accent Color</FieldLabel>
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <input
                {...register("accentColor", {
                  required: "Accent color is required",
                })}
                type="color"
                className="h-12 w-12 cursor-pointer rounded-xl border border-gray-200 p-1 outline-none focus:ring-2 focus:ring-orange-400/30"
              />
            </div>
            <div className="relative flex-1">
              <input
                {...register("accentColor")}
                type="text"
                placeholder="#fbbf24"
                className={inputNormal}
              />
              <span
                className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-gray-200"
                style={{ background: accentColor }}
              />
            </div>
          </div>
          <FieldHint>
            Used for points badges, charts, and secondary accents
          </FieldHint>
        </div>

        {/* Logo URL */}
        <div>
          <FieldLabel>Logo URL</FieldLabel>
          <input
            {...register("logoUrl", {
              pattern: {
                value: /^(https?:\/\/).+/,
                message: "Enter a valid URL starting with http(s)://",
              },
            })}
            type="url"
            placeholder="https://yourcompany.com/logo.png"
            className={errors.logoUrl ? inputError : inputNormal}
          />
          <FieldError message={errors.logoUrl?.message} />
          <FieldHint>
            PNG or SVG recommended. Will appear in the top nav.
          </FieldHint>
        </div>

        {/* Tagline */}
        <div>
          <FieldLabel>Company Tagline</FieldLabel>
          <input
            {...register("companyTagline", {
              maxLength: { value: 80, message: "Max 80 characters" },
            })}
            type="text"
            placeholder="Recognising great work every day"
            className={errors.companyTagline ? inputError : inputNormal}
          />
          <FieldError message={errors.companyTagline?.message} />
          <FieldHint>
            Shown on the recognition feed and onboarding screen
          </FieldHint>
        </div>

        {/* Preview strip */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
          <div
            className="flex items-center gap-3 px-5 py-3"
            style={{ background: primaryColor }}
          >
            <span className="text-sm font-bold text-white">Preview</span>
            <span
              className="ml-auto rounded-full px-3 py-1 text-xs font-bold text-gray-900"
              style={{ background: accentColor }}
            >
              2,500 pts
            </span>
          </div>
          <div className="bg-white px-5 py-4">
            <p className="text-xs text-gray-500">
              This is how your brand colors look across the platform.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <IconSave />
            {isSubmitting ? "Saving…" : "Update Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [toast, setToast] = useState<string | null>(null);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "general",
      label: "General",
      icon: <IconUser active={activeTab === "general"} />,
    },
    {
      id: "points",
      label: "Points Allocation",
      icon: <IconPoints active={activeTab === "points"} />,
    },
    // {
    //   id: "branding",
    //   label: "Branding",
    //   icon: <IconBranding active={activeTab === "branding"} />,
    // },
  ];

  function showToast(msg: string) {
    setToast(msg);
  }

  return (
    <div className="min-h-screen font-sans">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <div className="">
        {/* ── Page Title ── */}
        <h1 className="lg:text- mb-6 text-2xl font-bold text-gray-900">
          Settings
        </h1>

        {/* ── Tab Bar ── */}
        <div className="mb-8 flex items-center gap-1 border-b border-gray-200">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 sm:px-5 ${
                  isActive
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                } `}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.id === "general"
                    ? "General"
                    : tab.id === "points"
                      ? "Points"
                      : "Brand"}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          {activeTab === "general" && (
            <GeneralTab
              onSaved={() => showToast("General settings saved successfully!")}
            />
          )}
          {activeTab === "points" && (
            <PointsTab
              onSaved={() => showToast("Points allocation updated!")}
            />
          )}
          {activeTab === "branding" && (
            <BrandingTab
              onSaved={() => showToast("Branding preferences saved!")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
