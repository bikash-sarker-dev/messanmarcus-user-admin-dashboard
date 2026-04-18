"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Logo from "@/assets/logo_messan.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetCategoriseQuery } from "@/redux/api/categorise/categoriseSliceApi";
import {
  useAiGeneratePostMutation,
  useAiReGeneratePostMutation,
  useGetAllUsersQuery,
  useSendRecongitionMutation,
} from "@/redux/api/users/usersSliceApi";
import { useGetMeProfileQuery } from "@/redux/api/getMe/getMeApi";

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════
type Screen = "dashboard" | "recognize" | "details" | "card";
type Tab = "sent" | "received";

interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  accountType: string;
  isActive: string;
  createdAt: string;
  wallet: {
    pointsAllocated: number;
    pointsUsed: number;
    pointsBalance: number;
  };
}

interface ApiCategory {
  _id: string;
  name: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface DetailsState {
  category: string;
  categoryId: string;
  tone: string;
  values: string[];
  points: number;
  selectedImageUrl: string | null;
}

interface RecipientState {
  name: string;
  email: string;
  dept: string;
}

interface GeneratedMessage {
  message: string;
  department: string;
  category: string;
  tone: string;
  recipient_name: string;
  messageId: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// STATIC DATA
// ══════════════════════════════════════════════════════════════════════════════
const OCCASIONS = [
  "Daily Recognition",
  "Milestone",
  "Promotion",
  "Welcome",
  "Appreciation",
  "Birthday",
  "Work Anniversary",
  "Team Award",
];

// Tone mapping: display → API value
const TONES: { label: string; value: string }[] = [
  { label: "Professional & Polished", value: "PROFESSIONAL_POLISHED" },
  { label: "Warm & Heartfelt", value: "WARM_HEARTFELT" },
  { label: "Energetic & Hype", value: "ENERGETIC_HYPE" },
  { label: "Appreciative, Short & Sweet", value: "APPRECIATIVE_SHORT_SWEET" },
  { label: "Witty & Fun", value: "WITTY_FUN" },
];

const VALUES = [
  "Exceeding Expectations",
  "Results Driver",
  "Quality Champion",
  "Operational Excellence",
  "Dependability",
  "Accountability & Ownership",
  "Innovation Catalyst",
  "Creative Thinking",
  "Problem Solver",
  "Adaptability",
  "Team Player",
  "Cross-Team Collaborator",
  "Supportive Peer",
  "Role Model",
  "Positivity Champion",
  "Empowering Leader",
  "Inspiring Mentor",
  "Rising Star",
  "Integrity in Action",
  "Customer Champion",
];

const PER_PAGE = 10;

// ══════════════════════════════════════════════════════════════════════════════
// ICONS
// ══════════════════════════════════════════════════════════════════════════════
const I = {
  Badge: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="9" r="5" />
      <path d="M8.5 15.5l-1.5 5.5 5-2.5 5 2.5-1.5-5.5" />
    </svg>
  ),
  SendOut: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth={2}
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Mail: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Sort: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-3 w-3 opacity-40"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
    </svg>
  ),
  Plus: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Logout: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  ),
  ChevDown: ({ open }: { open: boolean }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      stroke="currentColor"
      strokeWidth={2}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Close: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth={2}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  ChevLeft: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth={2}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevRight: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth={2}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Refresh: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth={2}
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  ),
  Edit: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Plane: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
    </svg>
  ),
  Home: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Check: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  ),
  Spinner: () => (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </svg>
  ),
};

// ══════════════════════════════════════════════════════════════════════════════
// PAGINATION
// ══════════════════════════════════════════════════════════════════════════════
function getPages(cur: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (cur >= total - 3)
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", cur - 1, cur, cur + 1, "...", total];
}

function Pagination({
  cur,
  total,
  totalRows,
  perPage,
  onChange,
}: {
  cur: number;
  total: number;
  totalRows: number;
  perPage: number;
  onChange: (p: number) => void;
}) {
  const pages = getPages(cur, total);
  const start = (cur - 1) * perPage + 1;
  const end = Math.min(cur * perPage, totalRows);
  return (
    <div className="flex flex-col items-start justify-between gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
      <p className="shrink-0 text-xs text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-600">
          {start}–{end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-600">
          {totalRows.toLocaleString()}
        </span>
      </p>
      <div className="flex flex-wrap items-center gap-1">
        <button
          onClick={() => onChange(cur - 1)}
          disabled={cur === 1}
          className={`flex items-center gap-0.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors sm:px-2.5 ${cur === 1 ? "cursor-not-allowed text-gray-300" : "text-gray-500 hover:bg-gray-100"}`}
        >
          <I.ChevLeft /> <span className="hidden sm:inline">Previous</span>
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`e${i}`}
              className="w-6 text-center text-xs text-gray-400 sm:w-7"
            >
              …
            </span>
          ) : (
            <button
              key={`p${p}`}
              onClick={() => onChange(p as number)}
              className={`h-6 w-6 rounded-lg text-xs font-semibold transition-colors sm:h-7 sm:w-7 ${p === cur ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"}`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onChange(cur + 1)}
          disabled={cur === total}
          className={`flex items-center gap-0.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors sm:px-2.5 ${cur === total ? "cursor-not-allowed text-gray-300" : "text-gray-500 hover:bg-gray-100"}`}
        >
          <span className="hidden sm:inline">Next</span> <I.ChevRight />
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STEP BAR
// ══════════════════════════════════════════════════════════════════════════════
const STEPS: { key: Screen; label: string; short: string }[] = [
  { key: "recognize", label: "Who to Recognize", short: "Recipient" },
  { key: "details", label: "Select Details", short: "Details" },
  { key: "card", label: "Preview & Send", short: "Preview" },
];

function StepBar({
  screen,
  onStepClick,
}: {
  screen: Screen;
  onStepClick: (s: Screen) => void;
}) {
  const idx = STEPS.findIndex((s) => s.key === screen);
  if (idx === -1) return null;
  return (
    <div className="border-b border-gray-100 bg-white px-4 py-2.5 sm:px-6">
      <div className="scrollbar-hide mx-auto flex max-w-7xl items-center justify-center gap-1 overflow-x-auto sm:gap-2">
        <button
          onClick={() => onStepClick("dashboard")}
          className="flex shrink-0 items-center gap-1 text-xs text-gray-400 transition-colors hover:text-orange-500"
        >
          <I.Home /> <span className="hidden sm:inline">Dashboard</span>
        </button>
        {STEPS.map((step, i) => (
          <div
            key={step.key}
            className="flex shrink-0 items-center gap-1 sm:gap-2"
          >
            <I.ChevRight />
            <button
              onClick={() => i <= idx && onStepClick(step.key)}
              className={`flex items-center gap-1.5 whitespace-nowrap text-xs font-medium transition-colors ${i < idx ? "cursor-pointer text-orange-400 hover:text-orange-500" : i === idx ? "cursor-default font-semibold text-orange-600" : "cursor-not-allowed text-gray-300"}`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold sm:h-5 sm:w-5 sm:text-[10px] ${i < idx ? "bg-orange-100 text-orange-500" : i === idx ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}
              >
                {i < idx ? <I.Check /> : i + 1}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.short}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NAVBAR
// ══════════════════════════════════════════════════════════════════════════════
function Navbar({ onLogoClick }: { onLogoClick: () => void }) {
  const { data, isLoading } = useGetMeProfileQuery("");
  const user = data?.data || {};
  return (
    <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white px-4 shadow-sm sm:px-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-[70px] items-center justify-between">
          <button
            onClick={onLogoClick}
            className="group flex shrink-0 items-center gap-2"
          >
            <Image src={Logo} width={110} height={110} alt="logo" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 rounded-full bg-gray-900 py-1 pl-1 pr-2 text-white shadow-sm sm:pr-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-[10px] font-bold">
                SR
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="whitespace-nowrap text-[13px] font-semibold">
                  {user?.name}
                </p>
                <p className="whitespace-nowrap text-[11px] text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={onLogoClick}
              className="hidden h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white shadow transition-colors hover:bg-orange-600 sm:flex"
              title="Logout"
            >
              <I.Logout />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// WELCOME MODAL
// ══════════════════════════════════════════════════════════════════════════════
function WelcomeModal({
  onClose,
  onSend,
  visible,
}: {
  onClose: () => void;
  onSend: () => void;
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/55"
        onClick={onClose}
        style={{ zIndex: 0 }}
      />
      <div
        className="relative w-full max-w-sm rounded-2xl bg-orange-500 p-6 shadow-2xl sm:p-8"
        style={{ zIndex: 1, animation: "modalIn 0.3s ease-out forwards" }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
        >
          <I.Close />
        </button>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
          <I.Star />
        </div>
        <h2 className="mb-2 text-xl font-bold text-white">
          Welcome to Greetely! 🎉
        </h2>
        <p className="mb-7 text-sm leading-relaxed text-white/85">
          Send your first recognition in under 60 seconds and make someone's
          day!
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSend();
          }}
          className="w-full rounded-xl bg-white py-3 text-sm font-bold text-orange-500 shadow transition-all hover:bg-orange-50 active:scale-[0.98]"
        >
          Send Recognition Now
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="mt-3 w-full py-1.5 text-sm text-white/75 transition-colors hover:text-white"
        >
          I'll explore first
        </button>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.88) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CATEGORY IMAGE MODAL — uses real API images
// ══════════════════════════════════════════════════════════════════════════════
function CategoryImageModal({
  category,
  currentImageUrl,
  onSave,
  onClose,
}: {
  category: ApiCategory | null;
  currentImageUrl: string | null;
  onSave: (imageUrl: string) => void;
  onClose: () => void;
}) {
  const [tempUrl, setTempUrl] = useState<string | null>(currentImageUrl);

  if (!category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        style={{ zIndex: 0 }}
      />
      <div
        className="relative flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl"
        style={{
          zIndex: 1,
          maxHeight: "90vh",
          animation: "modalIn .25s ease-out forwards",
        }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Select Category Image
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">{category.name}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
          >
            <I.Close />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {category.images.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No images available for this category.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
              {category.images.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTempUrl(imgUrl)}
                  className={`relative aspect-[3/4] overflow-hidden rounded-xl border-2 transition-all hover:scale-[1.03] ${tempUrl === imgUrl ? "border-orange-500 shadow-[0_0_0_3px_rgba(249,115,22,.2)]" : "border-gray-100 hover:border-orange-300"}`}
                >
                  <img
                    src={imgUrl}
                    alt={`${category.name} template ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {tempUrl === imgUrl && (
                    <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 shadow">
                      <I.Check />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            disabled={tempUrl === null}
            onClick={() => tempUrl !== null && onSave(tempUrl)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all ${tempUrl !== null ? "bg-orange-500 shadow-md shadow-orange-200 hover:bg-orange-600" : "cursor-not-allowed bg-gray-200"}`}
          >
            Save
          </button>
        </div>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.93) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 1 — DASHBOARD (API-driven users table with server pagination)
// ══════════════════════════════════════════════════════════════════════════════
function DashboardScreen({
  showModal,
  onCloseModal,
  onSendRecognition,
}: {
  showModal: boolean;
  onCloseModal: () => void;
  onSendRecognition: () => void;
}) {
  const [tab, setTab] = useState<Tab>("sent");
  const [page, setPage] = useState(1);

  // ── API: fetch users with server-side pagination ──────────────────────────
  const { data: usersResponse, isLoading: userLoading } = useGetAllUsersQuery(
    { page, limit: PER_PAGE },
    { refetchOnMountOrArgChange: true },
  );

  const users: ApiUser[] = usersResponse?.data ?? [];
  const meta: ApiMeta = usersResponse?.meta ?? {
    page: 1,
    limit: PER_PAGE,
    total: 0,
    totalPage: 1,
  };

  // Reset to page 1 when switching tabs
  const handleTabChange = (t: Tab) => {
    setTab(t);
    setPage(1);
  };

  // Wallet stats from first user (current logged-in user)
  const currentUserWallet = users[0]?.wallet;
  const pointsBalance = currentUserWallet?.pointsBalance ?? 2500;
  const pointsUsed = currentUserWallet?.pointsUsed ?? 0;

  return (
    <>
      <WelcomeModal
        visible={showModal}
        onClose={onCloseModal}
        onSend={onSendRecognition}
      />
      <main className="mx-auto max-w-7xl space-y-5 px-3 py-5 sm:space-y-6 sm:px-6 sm:py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-2xl bg-orange-500 p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                <I.Badge />
              </div>
              <span className="text-sm font-semibold text-white/90">
                Points Balance
              </span>
            </div>
            <p className="text-4xl font-extrabold tracking-tight text-white">
              {userLoading ? "—" : pointsBalance.toLocaleString()}
            </p>
            <div className="mt-2 flex justify-between text-xs text-white/70">
              <span>Available</span>
              <span>Resets in 24 days</span>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-400">
                <I.SendOut />
              </div>
              <span className="text-sm font-semibold text-gray-500">
                Points Used
              </span>
            </div>
            <p className="text-4xl font-extrabold tracking-tight text-gray-900">
              {userLoading ? "—" : pointsUsed}
            </p>
            <p className="mt-2 text-xs font-medium text-teal-500">
              This quarter
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
                <I.Mail />
              </div>
              <span className="text-sm font-semibold text-gray-500">
                Total Users
              </span>
            </div>
            <p className="text-4xl font-extrabold tracking-tight text-gray-900">
              {userLoading ? "—" : meta.total}
            </p>
            <p className="mt-2 text-xs font-medium text-green-500">
              In your organization
            </p>
          </div>
        </div>

        {/* Users table */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <h2 className="whitespace-nowrap text-base font-bold text-gray-900 sm:text-lg">
              Team Members
            </h2>
            <button
              onClick={onSendRecognition}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-md bg-orange-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <I.Plus /> Send Recognition
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-100 px-4 sm:gap-5 sm:px-6">
            {(["sent", "received"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                className={`whitespace-nowrap border-b-2 pb-3 text-sm font-semibold transition-colors ${tab === t ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                {t === "sent" ? `All Users (${meta.total})` : `Active Users`}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="bg-gray-50/80">
                  {[
                    "Name",
                    "Email",
                    "Department",
                    "Role",
                    "Points Balance",
                    "Status",
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 text-left sm:px-6">
                      <span className="flex items-center gap-1 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-orange-500">
                        {h} <I.Sort />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {userLoading ? (
                  // Skeleton rows
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-gray-50">
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-4 py-3.5 sm:px-6">
                          <div
                            className="h-4 animate-pulse rounded bg-gray-100"
                            style={{ width: `${60 + Math.random() * 40}%` }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-sm text-gray-400"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users
                    .filter((u) =>
                      tab === "sent" ? true : u.isActive === "ACTIVE",
                    )
                    .map((user) => (
                      <tr
                        key={user._id}
                        className="border-t border-gray-50 transition-colors hover:bg-orange-50/30"
                      >
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-800 sm:px-6 sm:py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-600">
                              {user.name.slice(0, 2).toUpperCase()}
                            </div>
                            {user.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 sm:px-6 sm:py-3.5">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-3.5">
                          <span className="inline-flex whitespace-nowrap rounded-full border border-orange-100 bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-600">
                            {user.department}
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-3.5">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === "SUPER_ADMIN" ? "bg-purple-50 text-purple-600" : "bg-gray-100 text-gray-600"}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-800 sm:px-6 sm:py-3.5">
                          {user.wallet?.pointsBalance?.toLocaleString() ?? "—"}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${user.isActive === "ACTIVE" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${user.isActive === "ACTIVE" ? "bg-green-500" : "bg-red-500"}`}
                            />
                            {user.isActive}
                          </span>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

          {!userLoading && meta.totalPage > 1 && (
            <Pagination
              cur={page}
              total={meta.totalPage}
              totalRows={meta.total}
              perPage={PER_PAGE}
              onChange={(p) => {
                if (p >= 1 && p <= meta.totalPage) setPage(p);
              }}
            />
          )}
        </div>
      </main>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 2 — WHO TO RECOGNIZE
// ══════════════════════════════════════════════════════════════════════════════
function RecognizeScreen({
  onContinue,
}: {
  onContinue: (r: RecipientState) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("");
  const [deptOpen, setDeptOpen] = useState(false);
  const canContinue = name.trim() !== "" && email.trim() !== "";

  const DEPARTMENTS = [
    "Sales",
    "Marketing",
    "Finance & Accounting",
    "Operations",
    "Human Resources (HR)",
    "Information Technology (IT)",
    "Customer Service",
    "Research & Development (R&D)",
    "Legal, Risk & Compliance",
    "Administration",
  ];

  return (
    <div className="flex w-full flex-1 items-center justify-center p-4 sm:p-8 lg:justify-start lg:p-10">
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-1 text-xl font-bold text-orange-500 sm:text-2xl">
          Who would you like to recognize?
        </h1>
        <p className="mb-6 text-sm text-gray-400">
          Search and select a team member from your organization
        </p>

        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
          Full Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. John Doe"
          className="mb-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 sm:mb-5"
        />

        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
          Email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="xyz@gmail.com"
          type="email"
          className="mb-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 sm:mb-5"
        />

        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
          Select from Departments{" "}
          <span className="font-normal text-gray-400">(Optional)</span>
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setDeptOpen((o) => !o)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all hover:border-gray-300"
          >
            <span className={dept ? "text-gray-700" : "text-gray-300"}>
              {dept || "Select from Directory"}
            </span>
            <I.ChevDown open={deptOpen} />
          </button>
          {deptOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDeptOpen(false)}
              />
              <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
                <div className="sticky top-0 border-b border-gray-50 bg-white px-4 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Departments (Optional)
                  </p>
                </div>
                {DEPARTMENTS.map((d, i) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDept(d);
                      setDeptOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-orange-50 hover:text-orange-600 ${dept === d ? "bg-orange-50 font-medium text-orange-600" : "text-gray-700"}`}
                  >
                    {i + 1}. {d}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          disabled={!canContinue}
          onClick={() => canContinue && onContinue({ name, email, dept })}
          className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${canContinue ? "bg-orange-500 text-white shadow-md shadow-orange-200 hover:bg-orange-600" : "cursor-not-allowed bg-gray-200 text-gray-400"}`}
        >
          Continue to Details <I.ArrowRight />
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 3 — SELECT DETAILS (real API categories + images)
// ══════════════════════════════════════════════════════════════════════════════
function SelectDetailsScreen({
  recipientName,
  onGenerate,
}: {
  recipientName: string;
  onGenerate: (d: DetailsState) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<ApiCategory | null>(
    null,
  );
  const [tone, setTone] = useState("");
  const [toneValue, setToneValue] = useState("");
  const [values, setValues] = useState<string[]>([]);
  const [points, setPoints] = useState(100);

  const [imgModalOpen, setImgModalOpen] = useState(false);
  // Map: categoryId → selected image URL
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>(
    {},
  );

  // ── API: fetch categories ─────────────────────────────────────────────────
  const { data: categoriesResponse, isLoading: catsLoading } =
    useGetCategoriseQuery("");
  const categories: ApiCategory[] = categoriesResponse?.data ?? [];

  const MAX_BALANCE = 2500;
  const after = MAX_BALANCE - points;
  const canGenerate =
    selectedCategory !== null && tone !== "" && values.length > 0;
  const pct = ((points - 50) / 450) * 100;

  const toggleVal = (v: string) =>
    setValues((p) =>
      p.includes(v) ? p.filter((x) => x !== v) : p.length < 3 ? [...p, v] : p,
    );

  const handleCategoryClick = (cat: ApiCategory) => {
    setSelectedCategory(cat._id === selectedCategory?._id ? null : cat);
    setImgModalOpen(true);
  };

  const handleImageSave = (imageUrl: string) => {
    if (selectedCategory) {
      setCategoryImages((prev) => ({
        ...prev,
        [selectedCategory._id]: imageUrl,
      }));
    }
    setImgModalOpen(false);
  };

  const handleToneSelect = (toneObj: { label: string; value: string }) => {
    if (tone === toneObj.label) {
      setTone("");
      setToneValue("");
    } else {
      setTone(toneObj.label);
      setToneValue(toneObj.value);
    }
  };

  const Chip = ({
    label,
    selected,
    onClick,
    hasImage,
  }: {
    label: string;
    selected: boolean;
    onClick: () => void;
    hasImage?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all sm:text-sm ${selected ? "border-orange-500 bg-orange-500 text-white shadow-sm" : "border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-500"}`}
    >
      {label}
      {hasImage && (
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${selected ? "bg-white/30 text-white" : "bg-orange-100 text-orange-500"}`}
        >
          ✓
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50">
      {imgModalOpen && (
        <CategoryImageModal
          category={selectedCategory}
          currentImageUrl={
            selectedCategory
              ? (categoryImages[selectedCategory._id] ?? null)
              : null
          }
          onSave={handleImageSave}
          onClose={() => setImgModalOpen(false)}
        />
      )}

      <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8">
        <div className="flex flex-col items-start gap-5 lg:flex-row lg:gap-6">
          {/* LEFT */}
          <div className="w-full space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:space-y-8 sm:p-8 lg:flex-1">
            {recipientName && (
              <p className="text-sm text-gray-500">
                Recognizing:{" "}
                <span className="font-semibold text-orange-500">
                  {recipientName}
                </span>
              </p>
            )}

            {/* Categories from API */}
            <section>
              <h2 className="mb-1 text-base font-bold text-orange-500 sm:text-lg">
                Select Categories
              </h2>
              <p className="mb-3 text-xs text-gray-400">
                Click a category to select it and choose a card image template
              </p>
              {catsLoading ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-32 animate-pulse rounded-full bg-gray-100"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Chip
                      key={cat._id}
                      label={cat.name}
                      selected={selectedCategory?._id === cat._id}
                      hasImage={!!categoryImages[cat._id]}
                      onClick={() => handleCategoryClick(cat)}
                    />
                  ))}
                </div>
              )}
              {selectedCategory && categoryImages[selectedCategory._id] && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-14 w-10 shrink-0 overflow-hidden rounded-lg border-2 border-orange-300">
                    <img
                      src={categoryImages[selectedCategory._id]}
                      alt="selected"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-orange-500">
                      Card template selected
                    </p>
                    <button
                      type="button"
                      onClick={() => setImgModalOpen(true)}
                      className="text-xs text-gray-400 underline transition-colors hover:text-orange-500"
                    >
                      Change image
                    </button>
                  </div>
                </div>
              )}
            </section>

            <div className="border-t border-gray-100" />

            {/* Tone */}
            <section>
              <h2 className="mb-3 text-base font-bold text-orange-500 sm:mb-4 sm:text-lg">
                Choose Tone of the Recognition
              </h2>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <Chip
                    key={t.value}
                    label={t.label}
                    selected={tone === t.label}
                    onClick={() => handleToneSelect(t)}
                  />
                ))}
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Values */}
            <section>
              <div className="mb-3 flex flex-wrap items-baseline gap-2 sm:mb-4">
                <h2 className="text-base font-bold text-orange-500 sm:text-lg">
                  Employee Recognition Value
                </h2>
                <span className="text-xs font-medium text-orange-400 sm:text-sm">
                  (Choose up to 3 — {values.length}/3)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {VALUES.map((v) => (
                  <Chip
                    key={v}
                    label={v}
                    selected={values.includes(v)}
                    onClick={() => toggleVal(v)}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT — Assign Points */}
          <div className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-20 lg:w-72 lg:shrink-0">
            <h2 className="mb-5 text-lg font-bold text-orange-500 sm:text-xl">
              Assign Points
            </h2>
            <input
              type="range"
              min={50}
              max={500}
              step={50}
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              className="mb-1 h-2 w-full cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right,#F97316 0%,#F97316 ${pct}%,#e5e7eb ${pct}%,#e5e7eb 100%)`,
              }}
            />
            <div className="mb-5 text-center">
              <span className="text-4xl font-extrabold text-orange-500">
                {points}
              </span>
              <span className="ml-1 text-sm text-gray-400">pts</span>
            </div>

            <div className="mb-5 space-y-2.5 border-b border-gray-100 pb-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Available Balance:</span>
                <span className="font-semibold text-orange-500">
                  {MAX_BALANCE.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">After this recognition:</span>
                <span
                  className={`font-semibold ${after < 0 ? "text-red-500" : "text-orange-500"}`}
                >
                  {after.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-sm font-bold text-gray-800">Summary</p>
              <div className="space-y-2 text-sm">
                {[
                  [
                    "Occasion:",
                    selectedCategory?.name ?? "—",
                    "text-orange-500",
                  ],
                  [
                    "Tone:",
                    tone ? tone.split(" & ")[0] : "—",
                    "text-green-600",
                  ],
                  [
                    "Values:",
                    values.length > 0 ? `${values.length} selected` : "—",
                    "text-green-600",
                  ],
                  [
                    "Card Image:",
                    selectedCategory && categoryImages[selectedCategory._id]
                      ? "Selected ✓"
                      : "—",
                    "text-orange-500",
                  ],
                ].map(([label, val, col]) => (
                  <div key={label as string} className="flex justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span
                      className={`ml-2 max-w-[140px] truncate text-right font-semibold ${col}`}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {!canGenerate && (
              <p className="mb-3 text-center text-xs text-gray-400">
                Select a category, tone, and at least 1 value to continue
              </p>
            )}
            <button
              disabled={!canGenerate}
              onClick={() =>
                canGenerate &&
                selectedCategory &&
                onGenerate({
                  category: selectedCategory.name,
                  categoryId: selectedCategory._id,
                  tone,
                  values,
                  points,
                  selectedImageUrl:
                    categoryImages[selectedCategory._id] ?? null,
                })
              }
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${canGenerate ? "bg-orange-500 text-white shadow-md shadow-orange-200 hover:bg-orange-600" : "cursor-not-allowed bg-gray-200 text-gray-400"}`}
            >
              Generate Card <I.ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 4 — CARD PREVIEW (AI generate + regenerate + send)
// ══════════════════════════════════════════════════════════════════════════════
function CardPreviewScreen({
  recipient,
  details,
  onEditCard,
  senderName,
}: {
  recipient: RecipientState;
  details: DetailsState;
  onEditCard: () => void;
  senderName: string;
}) {
  const [generatedData, setGeneratedData] = useState<GeneratedMessage | null>(
    null,
  );
  const [sent, setSent] = useState(false);
  const [additionalMessage, setAdditionalMessage] = useState("");
  const [editableMessage, setEditableMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const [aiGenerateMassage, { isLoading: messLoading }] =
    useAiGeneratePostMutation();
  const [aiReGenerateMassage, { isLoading: messReLoading }] =
    useAiReGeneratePostMutation();
  const [sendRecognitionMessage, { isLoading: sendLoading }] =
    useSendRecongitionMutation();

  // ── Generate message on mount ─────────────────────────────────────────────
  const generateMessage = useCallback(async () => {
    setApiError("");
    try {
      const payload = {
        category: details.category,
        department: recipient.dept || "General",
        recipient_name: recipient.name,
        recognition_values: details.values,
        tone: details.tone,
      };
      const res = await aiGenerateMassage(payload).unwrap();
      setGeneratedData(res.data);
      setEditableMessage(res.data.message);
    } catch (err) {
      setApiError("Failed to generate message. Please try again.");
    }
  }, [details, recipient, aiGenerateMassage]);

  useEffect(() => {
    generateMessage();
  }, []);

  // ── Regenerate ────────────────────────────────────────────────────────────
  const handleRegenerate = async () => {
    setApiError("");
    try {
      const payload = {
        category: details.category,
        department: recipient.dept || "General",
        recipient_name: recipient.name,
        recognition_values: details.values,
        tone: details.tone,
      };
      const res = await aiReGenerateMassage(payload).unwrap();

      setGeneratedData(res.data);
      setEditableMessage(res.data.message);
    } catch (err) {
      setApiError("Failed to regenerate message. Please try again.");
    }
  };

  // ── Send recognition ──────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!generatedData) return;
    setApiError("");
    try {
      const payload = {
        receiverEmail: recipient.email,
        image: details.selectedImageUrl ?? "",
        points: details.points,
        messageId: generatedData.messageId,
        additionalMessage: editableMessage,
      };
      await sendRecognitionMessage(payload).unwrap();
      setSent(true);
    } catch (err) {
      setApiError("Failed to send recognition. Please try again.");
    }
  };

  const isGenerating = messLoading;
  const isRegenerating = messReLoading;

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8">
        {apiError && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            ⚠️ {apiError}
            <button
              onClick={() => setApiError("")}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <I.Close />
            </button>
          </div>
        )}

        <div className="flex flex-col items-start gap-5 lg:flex-row">
          {/* Recognition Card */}
          <div className="flex w-full lg:flex-1">
            <div className="w-full max-w-[500px] rounded-2xl bg-orange-500 p-6 shadow-xl">
              <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-white sm:mb-8 sm:text-4xl">
                Greetely
              </h1>
              <p className="mb-1 text-xs text-white/60">To:</p>
              <p className="text-xl font-bold text-white sm:text-2xl">
                {recipient.name || "Recipient"}
              </p>
              <p className="mb-4 mt-0.5 text-xs text-white/60 sm:mb-5">
                {recipient.dept || "Your Organization"}
              </p>

              {/* <div className="mb-5 max-h-[150px] rounded-xl bg-white/20 p-4 sm:mb-6 sm:max-h-[220px] sm:p-5">
        
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2 py-4 text-white/80">
                    <I.Spinner />{" "}
                    <span className="text-sm">Generating your message…</span>
                  </div>
                ) : (
                  <div className="relative">
                    <textarea
                      value={editableMessage}
                      onChange={(e) => setEditableMessage(e.target.value)}
                      disabled={sent}
                      rows={8}
                      className="w-full resize-none rounded-lg bg-white/10 p-3 text-sm leading-relaxed text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 disabled:opacity-60"
                      placeholder="Your message will appear here..."
                    />
                    <span className="absolute bottom-2 right-2 text-[10px] text-white/40">
                      {editableMessage.length} chars
                    </span>
                  </div>
                )}
              </div> */}

              <div className="mb-6 rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-md">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-6 text-white/80">
                    <I.Spinner />
                    <span className="text-sm tracking-wide">
                      Generating your message...
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <textarea
                      value={editableMessage}
                      onChange={(e) => setEditableMessage(e.target.value)}
                      disabled={sent}
                      rows={6}
                      className="w-full resize-none rounded-xl bg-white/5 p-4 text-sm leading-relaxed text-white transition-all duration-200 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:opacity-50"
                      placeholder="✍️ Your message will appear here..."
                    />

                    {/* Footer */}
                    <div className="mt-2 flex items-center justify-between text-xs text-white/50">
                      <span>{editableMessage.length} characters</span>

                      {!sent && (
                        <span className="italic text-white/40">
                          You can edit before sending
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected card image preview */}
              {details.selectedImageUrl && (
                <div className="mb-4 overflow-hidden rounded-xl border-2 border-white/30">
                  <img
                    src={details.selectedImageUrl}
                    alt="card template"
                    className="h-28 w-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-white/25 px-3 py-1.5 text-xs font-semibold text-white sm:px-4 sm:py-2">
                  {details.values[0] || "Recognition"}
                </span>
                <span className="rounded-xl bg-white/25 px-3 py-1.5 text-xs font-semibold text-white sm:px-4 sm:py-2">
                  {details.points} Pts
                </span>
              </div>
            </div>
          </div>

          {/* Additional message */}
          <div className="w-full lg:flex-1">
            <label className="mb-2 block text-lg font-bold text-orange-500">
              Write Message{" "}
              <span className="text-sm font-normal text-gray-400">
                (optional)
              </span>
            </label>
            <textarea
              value={additionalMessage}
              onChange={(e) => setAdditionalMessage(e.target.value)}
              rows={16}
              placeholder="Add a personal message..."
              disabled={sent}
              className="w-full resize-none rounded-lg border border-orange-300 p-3 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 disabled:opacity-60"
            />
            <p className="mt-2 text-xs text-orange-400">
              {additionalMessage.length} characters
            </p>
          </div>

          {/* Actions panel */}
          <div className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:w-[300px] lg:shrink-0">
            <h2 className="mb-4 text-lg font-bold text-orange-500 sm:mb-5 sm:text-xl">
              Actions
            </h2>
            <div className="mb-5 space-y-3 sm:mb-6">
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating || isGenerating || sent}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-orange-500 px-4 py-2.5 text-sm font-semibold text-orange-500 transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRegenerating ? (
                  <>
                    <I.Spinner /> Regenerating…
                  </>
                ) : (
                  <>
                    <I.Refresh /> Re-generate Card
                  </>
                )}
              </button>
              <button
                onClick={onEditCard}
                disabled={sent}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <I.Edit /> Edit Card
              </button>
            </div>

            <div className="mb-5 border-b border-gray-100 pb-5">
              <p className="mb-3 text-sm font-bold text-gray-800">
                Recognition Summary
              </p>
              <div className="space-y-2 text-sm">
                {[
                  ["Recipient:", recipient.name, "text-orange-500"],
                  ["Email:", recipient.email, "text-gray-600"],
                  ["Category:", details.category, "text-orange-500"],
                  ["Points:", `${details.points} Pts`, "text-orange-500"],
                  ["Tone:", details.tone.split(" & ")[0], "text-green-600"],
                  [
                    "Values:",
                    `${details.values.length} selected`,
                    "text-green-600",
                  ],
                  [
                    "Card Image:",
                    details.selectedImageUrl ? "Selected ✓" : "None",
                    "text-orange-500",
                  ],
                ].map(([label, val, col]) => (
                  <div key={label as string} className="flex justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span
                      className={`ml-2 max-w-[150px] truncate text-right font-semibold ${col}`}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {sent ? (
              <div className="flex w-full flex-col items-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-semibold text-white">
                <div className="flex items-center gap-2">
                  <I.Check /> Recognition Sent!
                </div>
                <p className="text-xs font-normal text-white/80">
                  Email sent to {recipient.email}
                </p>
              </div>
            ) : (
              <button
                onClick={handleSend}
                disabled={sendLoading || isGenerating || !generatedData}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sendLoading ? (
                  <>
                    <I.Spinner /> Sending…
                  </>
                ) : (
                  <>
                    <I.Plane /> Send Recognition
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function GreetelyDashboard() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [showModal, setShowModal] = useState(true);
  const [recipient, setRecipient] = useState<RecipientState>({
    name: "",
    email: "",
    dept: "",
  });
  const [details, setDetails] = useState<DetailsState>({
    category: "",
    categoryId: "",
    tone: "",
    values: [],
    points: 100,
    selectedImageUrl: null,
  });

  const startRecognition = useCallback(() => {
    setShowModal(false);
    setScreen("recognize");
  }, []);

  const logOutHandle = () => {
    router.push("http://206.162.244.175:3041");
  };

  const handleStepClick = useCallback(
    (s: Screen) => {
      const order: Screen[] = ["dashboard", "recognize", "details", "card"];
      const targetIdx = order.indexOf(s);
      const curIdx = order.indexOf(screen);
      if (targetIdx <= curIdx) setScreen(s);
    },
    [screen],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogoClick={logOutHandle} />

      {screen !== "dashboard" && (
        <StepBar screen={screen} onStepClick={handleStepClick} />
      )}

      {screen === "dashboard" && (
        <DashboardScreen
          showModal={showModal}
          onCloseModal={() => setShowModal(false)}
          onSendRecognition={startRecognition}
        />
      )}
      {screen === "recognize" && (
        <RecognizeScreen
          onContinue={(r) => {
            setRecipient(r);
            setScreen("details");
          }}
        />
      )}
      {screen === "details" && (
        <SelectDetailsScreen
          recipientName={recipient.name}
          onGenerate={(d) => {
            setDetails(d);
            setScreen("card");
          }}
        />
      )}
      {screen === "card" && (
        <CardPreviewScreen
          recipient={recipient}
          details={details}
          onEditCard={() => setScreen("details")}
          senderName="Saifur Rahman"
        />
      )}
    </div>
  );
}
