"use client";

import { useState, useMemo, useCallback } from "react";
import Logo from "@/assets/logo_messan.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════
type Screen = "dashboard" | "recognize" | "details" | "card";
type Tab = "sent" | "received";

interface RecognitionRow {
  id: number;
  name: string;
  email: string;
  occasion: string;
  points: number;
  date: string;
}
interface DetailsState {
  category: string;
  tone: string;
  values: string[];
  points: number;
}
interface RecipientState {
  name: string;
  email: string;
  dept: string;
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
const NAMES = [
  "Kristin Watson",
  "Annette Black",
  "Jacob Jones",
  "Arlene McCoy",
  "Cody Fisher",
  "James Wilson",
  "Emily Davis",
  "Robert Brown",
  "Linda Miller",
  "Michael Taylor",
  "Sarah Anderson",
  "David Thomas",
  "Jessica Jackson",
  "Daniel White",
  "Ashley Harris",
  "Matthew Martin",
  "Amanda Thompson",
  "Christopher Garcia",
  "Stephanie Martinez",
  "Joshua Robinson",
  "Megan Clark",
  "Andrew Lewis",
  "Lauren Hall",
  "Tyler Allen",
  "Brittany Young",
  "Kevin Hernandez",
  "Rachel King",
  "Brandon Wright",
  "Samantha Lopez",
  "Justin Scott",
];
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
const CATEGORIES = [
  "Peer-to-Peer Recognition",
  "Everyday Appreciation",
  "Thank You Note",
  "Employee Accomplishments",
  "Emerging Leader Recognition",
  "Manager Excellence",
  "Employee Milestones",
  "Employee Welcome",
  "Special Occasions",
];
const TONES = [
  "Professional & Polished",
  "Warm & Heartfelt",
  "Energetic & Hype",
  "Appreciative, Short & Sweet",
  "Witty & Fun",
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
const CARD_MSGS = [
  (n: string) =>
    `${n}, your exceptional work on the Q4 project truly exemplifies our core value of Excellence. Your dedication and attention to detail made a significant impact on the team's success. Thank you for your outstanding contribution!`,
  (n: string) =>
    `${n}, the way you consistently go above and beyond inspires everyone around you. Your commitment to quality and collaborative spirit make our team stronger every single day. We're incredibly grateful to have you!`,
  (n: string) =>
    `${n}, your creative problem-solving and relentless drive have set a new standard for what's possible. This recognition is a small token of our appreciation for the big difference you make. Keep being amazing!`,
];

const PER_PAGE = 11;
function makeRows(n: number): RecognitionRow[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: NAMES[i % NAMES.length],
    email: `user${i + 1}@example.com`,
    occasion: OCCASIONS[i % OCCASIONS.length],
    points: [50, 100, 120, 150, 200, 250][i % 6],
    date: `${String((i % 28) + 1).padStart(2, "0")} Jan 2026`,
  }));
}
const ALL_SENT = makeRows(145);
const ALL_RECEIVED = makeRows(87);

// ══════════════════════════════════════════════════════════════════════════════
// ICONS
// ══════════════════════════════════════════════════════════════════════════════
const I = {
  Logo: () => (
    <svg viewBox="0 0 44 44" className="h-full w-full" fill="none">
      <circle cx="22" cy="22" r="22" fill="#F97316" />
      <path
        d="M11 22a11 11 0 0 1 22 0"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M22 33V22"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="22" cy="18" r="3" fill="white" />
    </svg>
  ),
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
  Menu: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth={2}
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
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
  onChange,
}: {
  cur: number;
  total: number;
  totalRows: number;
  onChange: (p: number) => void;
}) {
  const pages = getPages(cur, total);
  const start = (cur - 1) * PER_PAGE + 1;
  const end = Math.min(cur * PER_PAGE, totalRows);
  return (
    <div className="flex flex-col items-start justify-between gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
      <p className="shrink-0 text-xs text-gray-400">
        Showing <span className="font-semibold text-gray-600">{PER_PAGE}</span>{" "}
        —{" "}
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
              className={`flex items-center gap-1.5 whitespace-nowrap text-xs font-medium transition-colors ${
                i < idx
                  ? "cursor-pointer text-orange-400 hover:text-orange-500"
                  : i === idx
                    ? "cursor-default font-semibold text-orange-600"
                    : "cursor-not-allowed text-gray-300"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold sm:h-5 sm:w-5 sm:text-[10px] ${
                  i < idx
                    ? "bg-orange-100 text-orange-500"
                    : i === idx
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-400"
                }`}
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
function Navbar({
  screen,
  onLogoClick,
  onSendRecognition,
}: {
  screen: Screen;
  onLogoClick: () => void;
  onSendRecognition: () => void;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const isDashboard = screen === "dashboard";

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white px-4 shadow-sm sm:px-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-[70px] items-center justify-between">
          <button
            onClick={() => {
              onLogoClick();
              setMenuOpen(false);
            }}
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
                  Saifur Rahman
                </p>
                <p className="whitespace-nowrap text-[11px] text-gray-400">
                  example.xyz@gmail.com
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onLogoClick();
                setMenuOpen(false);
                router.push("http://206.162.244.131:3041/");
              }}
              className="hidden h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white shadow transition-colors hover:bg-orange-600 sm:flex"
              title="Logout"
            >
              <I.Logout />
            </button>

            {/* <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 transition-colors hover:bg-gray-200 sm:hidden"
            >
              {menuOpen ? <I.Close /> : <I.Menu />}
            </button> */}
          </div>
        </div>
      </div>

      {/* {menuOpen && (
        <div className="space-y-1 border-t border-gray-100 py-3 sm:hidden">
          {isDashboard &&
            ["Dashboard", "Leaderboard", "Rewards", "Reports"].map(
              (item, i) => (
                <button
                  key={item}
                  onClick={() => {
                    if (i === 0) onLogoClick();
                    setMenuOpen(false);
                  }}
                  className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${i === 0 ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  {item}
                </button>
              ),
            )}
          <button
            onClick={() => {
              onSendRecognition();
              setMenuOpen(false);
            }}
            className="mt-1 flex w-full items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            <I.Plus /> Send Recognition
          </button>
          <button
            onClick={() => {
              onLogoClick();
              setMenuOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <I.Logout /> Logout
          </button>
        </div>
      )} */}
    </nav>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// WELCOME MODAL — FIX: z-index layering so close button is always clickable
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

  // SVG ring — static display (no countdown needed, simpler and more reliable)
  const r = 18,
    circ = 2 * Math.PI * r;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* ✅ FIX: Backdrop is BEHIND the modal card via z-index separation */}
      <div
        className="absolute inset-0 bg-black/55"
        onClick={onClose}
        style={{ zIndex: 0 }}
      />

      {/* ✅ FIX: Modal card has its own stacking context above the backdrop */}
      <div
        className="relative w-full max-w-sm rounded-2xl bg-orange-500 p-6 shadow-2xl sm:p-8"
        style={{ zIndex: 1, animation: "modalIn 0.3s ease-out forwards" }}
      >
        {/* ✅ FIX: Close button uses stopPropagation to prevent backdrop click */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
          aria-label="Close modal"
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

      <style>{`
        @keyframes modalIn {
          from { opacity:0; transform:scale(0.88) translateY(16px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 1 — DASHBOARD
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
  // ✅ FIX: Separate page state per tab, and reset on tab switch
  const [sentPage, setSentPage] = useState(1);
  const [receivedPage, setReceivedPage] = useState(1);

  const allRows = tab === "sent" ? ALL_SENT : ALL_RECEIVED;
  const page = tab === "sent" ? sentPage : receivedPage;
  const setPage = tab === "sent" ? setSentPage : setReceivedPage;
  const totalPages = Math.ceil(allRows.length / PER_PAGE);

  const rows = useMemo(
    () => allRows.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [allRows, page],
  );

  // ✅ FIX: Reset page to 1 when switching tabs
  const handleTabChange = (t: Tab) => {
    setTab(t);
    if (t === "sent") setSentPage(1);
    else setReceivedPage(1);
  };

  return (
    <>
      <WelcomeModal
        visible={showModal}
        onClose={onCloseModal}
        onSend={onSendRecognition}
      />

      <main className="mx-auto max-w-7xl space-y-5 px-3 py-5 sm:space-y-6 sm:px-6 sm:py-8">
        {/* Stat Cards */}
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
              2,500
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
                Sent This Month
              </span>
            </div>
            <p className="text-4xl font-extrabold tracking-tight text-gray-900">
              5
            </p>
            <p className="mt-2 text-xs font-medium text-teal-500">
              +2 from last month
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-500">
                <I.Mail />
              </div>
              <span className="text-sm font-semibold text-gray-500">
                Received This Month
              </span>
            </div>
            <p className="text-4xl font-extrabold tracking-tight text-gray-900">
              12
            </p>
            <p className="mt-2 text-xs font-medium text-green-500">Good Job!</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <h2 className="whitespace-nowrap text-base font-bold text-gray-900 sm:text-lg">
              Recent Cases
            </h2>
            <button
              onClick={onSendRecognition}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-md bg-orange-500 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <I.Plus /> <span className="xs:inline hidden">Send </span>
              Send Recognition
            </button>
          </div>

          <div className="flex gap-4 border-b border-gray-100 px-4 sm:gap-5 sm:px-6">
            {(["sent", "received"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                className={`whitespace-nowrap border-b-2 pb-3 text-sm font-semibold transition-colors ${tab === t ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                {t === "sent"
                  ? `Sent (${ALL_SENT.length})`
                  : `Received (${ALL_RECEIVED.length})`}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] text-sm">
              <thead>
                <tr className="bg-gray-50/80">
                  {[
                    tab === "sent" ? "Recipient" : "Sender",
                    "Email ID",
                    "Occasion",
                    "Points",
                    "Date",
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
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-gray-50 transition-colors hover:bg-orange-50/30"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-800 sm:px-6 sm:py-3.5">
                      {row.name}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 sm:px-6 sm:py-3.5">
                      {row.email}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-3.5">
                      <span className="inline-flex whitespace-nowrap rounded-full border border-orange-100 bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-600">
                        {row.occasion}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800 sm:px-6 sm:py-3.5">
                      {row.points}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-400 sm:px-6 sm:py-3.5">
                      {row.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            cur={page}
            total={totalPages}
            totalRows={allRows.length}
            onChange={(p) => {
              if (p >= 1 && p <= totalPages) setPage(p);
            }}
          />
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

  return (
    <div className="">
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
            placeholder="Saifur Rahman"
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
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 3 — SELECT DETAILS
// ══════════════════════════════════════════════════════════════════════════════
function SelectDetailsScreen({
  recipientName,
  onGenerate,
}: {
  recipientName: string;
  onGenerate: (d: DetailsState) => void;
}) {
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");
  const [values, setValues] = useState<string[]>([]);
  const [points, setPoints] = useState(100);
  const MAX_BALANCE = 2500;
  const after = MAX_BALANCE - points;
  const canGenerate = category !== "" && tone !== "" && values.length > 0;
  const pct = ((points - 50) / 450) * 100;

  const toggleVal = (v: string) =>
    setValues((p) =>
      p.includes(v) ? p.filter((x) => x !== v) : p.length < 3 ? [...p, v] : p,
    );

  const Chip = ({
    label,
    selected,
    onClick,
  }: {
    label: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition-all sm:text-sm ${selected ? "border-orange-500 bg-orange-500 text-white shadow-sm" : "border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-500"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50">
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
            <section>
              <h2 className="mb-3 text-base font-bold text-orange-500 sm:mb-4 sm:text-lg">
                Select Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Chip
                    key={c}
                    label={c}
                    selected={category === c}
                    onClick={() => setCategory(c === category ? "" : c)}
                  />
                ))}
              </div>
            </section>
            <div className="border-t border-gray-100" />
            <section>
              <h2 className="mb-3 text-base font-bold text-orange-500 sm:mb-4 sm:text-lg">
                Choose Tone of Value
              </h2>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    selected={tone === t}
                    onClick={() => setTone(t === tone ? "" : t)}
                  />
                ))}
              </div>
            </section>
            <div className="border-t border-gray-100" />
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
          <div className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-20 lg:w-75 lg:shrink-0">
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
                  ["Occasion:", category || "—", "text-orange-500"],
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
                canGenerate && onGenerate({ category, tone, values, points })
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
// SCREEN 4 — CARD PREVIEW
// ══════════════════════════════════════════════════════════════════════════════
function CardPreviewScreen({
  recipient,
  details,
  onEditCard,
}: {
  recipient: RecipientState;
  details: DetailsState;
  onEditCard: () => void;
}) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8">
        <div className="flex flex-col items-start gap-5 lg:flex-row lg:gap-8">
          {/* Orange Card */}
          <div className="flex w-full justify-center lg:flex-1">
            <div className="w-full max-w-[620px] rounded-2xl bg-orange-500 p-6 shadow-xl sm:p-8">
              <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-white sm:mb-8 sm:text-4xl">
                Greetely
              </h1>
              <p className="mb-1 text-xs text-white/60">To:</p>
              <p className="text-xl font-bold text-white sm:text-2xl">
                {recipient.name || "Sarah Ahmed"}
              </p>
              <p className="mb-4 mt-0.5 text-xs text-white/60 sm:mb-5">
                {recipient.dept || "Engineering Department"}
              </p>
              <div className="mb-5 min-h-[110px] rounded-xl bg-white/20 p-4 sm:mb-6 sm:min-h-[130px] sm:p-5">
                <p className="text-sm leading-relaxed text-white">
                  {CARD_MSGS[msgIdx](recipient.name || "Sarah Ahmed")}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-white/25 px-3 py-1.5 text-xs font-semibold text-white sm:px-4 sm:py-2">
                  {details.values[0] || "Teamwork"}
                </span>
                <span className="rounded-xl bg-white/25 px-3 py-1.5 text-xs font-semibold text-white sm:px-4 sm:py-2">
                  {details.points} Pts
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:w-[400px] lg:shrink-0">
            <h2 className="mb-4 text-lg font-bold text-orange-500 sm:mb-5 sm:text-xl">
              Actions
            </h2>

            <div className="mb-5 space-y-3 sm:mb-6">
              <button
                onClick={() => setMsgIdx((i) => (i + 1) % CARD_MSGS.length)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-orange-500 px-4 py-2.5 text-sm font-semibold text-orange-500 transition-colors hover:bg-orange-50"
              >
                <I.Refresh /> Re-generate Card
              </button>
              <button
                onClick={onEditCard}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
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
                  ["Occasion:", details.category, "text-orange-500"],
                  ["Points:", `${details.points} Pts`, "text-orange-500"],
                  ["Tone:", details.tone.split(" & ")[0], "text-green-600"],
                  [
                    "Values:",
                    `${details.values.length} selected`,
                    "text-green-600",
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
              <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-semibold text-white">
                <I.Check /> Recognition Sent!
              </div>
            ) : (
              <button
                onClick={() => setSent(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-colors hover:bg-orange-600"
              >
                Send Recognition <I.Plane />
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
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [showModal, setShowModal] = useState(true);
  const [recipient, setRecipient] = useState<RecipientState>({
    name: "",
    email: "",
    dept: "",
  });
  const [details, setDetails] = useState<DetailsState>({
    category: "",
    tone: "",
    values: [],
    points: 100,
  });

  const startRecognition = useCallback(() => {
    setShowModal(false);
    setScreen("recognize");
  }, []);

  // ✅ FIX: goHome resets modal-dismissed flag so it doesn't reappear,
  // but does NOT re-show the modal on return to dashboard
  const goHome = useCallback(() => {
    setScreen("dashboard");
  }, []);

  // ✅ FIX: Step navigation — allow going back but not forward beyond current
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
      <Navbar
        screen={screen}
        onLogoClick={goHome}
        onSendRecognition={startRecognition}
      />

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
        />
      )}
    </div>
  );
}
