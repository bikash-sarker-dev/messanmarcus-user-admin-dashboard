"use client";

import React, { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "Employee" | "Manager" | "Admin";
type Department =
  | "Engineering"
  | "Developer"
  | "Designer"
  | "HR"
  | "Product"
  | "Marketing";
type Status = "Delivered" | "Pending" | "Inactive";

interface Employee {
  id: number;
  name: string;
  email: string;
  department: Department;
  pointsBalance: number;
  role: Role;
  status: Status;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_EMPLOYEES: Employee[] = [
  {
    id: 1,
    name: "Kristin Watson",
    email: "willie.jennings@example.com",
    department: "Engineering",
    pointsBalance: 2500,
    role: "Employee",
    status: "Delivered",
  },
  {
    id: 2,
    name: "Annette Black",
    email: "debbie.baker@example.com",
    department: "Developer",
    pointsBalance: 2500,
    role: "Employee",
    status: "Delivered",
  },
  {
    id: 3,
    name: "Jacob Jones",
    email: "deanna.curtis@example.com",
    department: "Designer",
    pointsBalance: 2500,
    role: "Employee",
    status: "Delivered",
  },
  {
    id: 4,
    name: "Arlene McCoy",
    email: "jessica.hanson@example.com",
    department: "Engineering",
    pointsBalance: 2500,
    role: "Employee",
    status: "Delivered",
  },
  {
    id: 5,
    name: "Cody Fisher",
    email: "nevaeh.simmons@example.com",
    department: "HR",
    pointsBalance: 2500,
    role: "Manager",
    status: "Delivered",
  },
  {
    id: 6,
    name: "Arlene McCoy",
    email: "tanya.hill@example.com",
    department: "Designer",
    pointsBalance: 2500,
    role: "Employee",
    status: "Delivered",
  },
  {
    id: 7,
    name: "Cody Fisher",
    email: "felicia.reid@example.com",
    department: "Engineering",
    pointsBalance: 2500,
    role: "Employee",
    status: "Delivered",
  },
  {
    id: 8,
    name: "Arlene McCoy",
    email: "georgia.young@example.com",
    department: "Product",
    pointsBalance: 2500,
    role: "Manager",
    status: "Delivered",
  },
  {
    id: 9,
    name: "Arlene McCoy",
    email: "tim.jennings@example.com",
    department: "Developer",
    pointsBalance: 2500,
    role: "Employee",
    status: "Delivered",
  },
  {
    id: 10,
    name: "Cody Fisher",
    email: "dolores.chambers@example.com",
    department: "Engineering",
    pointsBalance: 2500,
    role: "Employee",
    status: "Delivered",
  },
  {
    id: 11,
    name: "Eleanor Pena",
    email: "eleanor.pena@example.com",
    department: "Marketing",
    pointsBalance: 3200,
    role: "Manager",
    status: "Delivered",
  },
  {
    id: 12,
    name: "Robert Fox",
    email: "robert.fox@example.com",
    department: "Engineering",
    pointsBalance: 1800,
    role: "Employee",
    status: "Pending",
  },
  {
    id: 13,
    name: "Jenny Wilson",
    email: "jenny.wilson@example.com",
    department: "Designer",
    pointsBalance: 2100,
    role: "Employee",
    status: "Delivered",
  },
  {
    id: 14,
    name: "Devon Lane",
    email: "devon.lane@example.com",
    department: "HR",
    pointsBalance: 2750,
    role: "Employee",
    status: "Inactive",
  },
  {
    id: 15,
    name: "Wade Warren",
    email: "wade.warren@example.com",
    department: "Product",
    pointsBalance: 3100,
    role: "Manager",
    status: "Delivered",
  },
  {
    id: 16,
    name: "Savannah Nguyen",
    email: "savannah.n@example.com",
    department: "Developer",
    pointsBalance: 2300,
    role: "Employee",
    status: "Delivered",
  },
  {
    id: 17,
    name: "Cameron Williamson",
    email: "cameron.w@example.com",
    department: "Engineering",
    pointsBalance: 2600,
    role: "Employee",
    status: "Delivered",
  },
  {
    id: 18,
    name: "Brooklyn Simmons",
    email: "brooklyn.s@example.com",
    department: "Marketing",
    pointsBalance: 1950,
    role: "Employee",
    status: "Pending",
  },
  {
    id: 19,
    name: "Marvin McKinney",
    email: "marvin.m@example.com",
    department: "Designer",
    pointsBalance: 2450,
    role: "Employee",
    status: "Delivered",
  },
  {
    id: 20,
    name: "Theresa Webb",
    email: "theresa.w@example.com",
    department: "Product",
    pointsBalance: 2800,
    role: "Manager",
    status: "Delivered",
  },
  {
    id: 21,
    name: "Albert Flores",
    email: "albert.f@example.com",
    department: "Engineering",
    pointsBalance: 2200,
    role: "Employee",
    status: "Delivered",
  },
  {
    id: 22,
    name: "Courtney Henry",
    email: "courtney.h@example.com",
    department: "HR",
    pointsBalance: 1700,
    role: "Employee",
    status: "Inactive",
  },
];

const DEPARTMENTS: Department[] = [
  "Engineering",
  "Developer",
  "Designer",
  "HR",
  "Product",
  "Marketing",
];
const ROLES: Role[] = ["Employee", "Manager", "Admin"];
const STATUSES: Status[] = ["Delivered", "Pending", "Inactive"];
const PAGE_SIZE_OPTIONS = [5, 11, 20, 50];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
const AVATAR_COLORS = [
  "bg-orange-100 text-orange-600",
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600",
  "bg-pink-100 text-pink-600",
  "bg-teal-100 text-teal-600",
];
function avatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

// ─── Badges ───────────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: Role }) {
  const styles: Record<Role, string> = {
    Employee: "bg-gray-100 text-gray-600",
    Manager: "bg-purple-100 text-purple-600",
    Admin: "bg-orange-100 text-orange-600",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[role]}`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    Delivered: "bg-green-50 text-green-600 border border-green-200",
    Pending: "bg-yellow-50 text-yellow-600 border border-yellow-200",
    Inactive: "bg-red-50 text-red-500 border border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

// ─── Shared Field wrapper ─────────────────────────────────────────────────────
function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {!error && hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 ${err ? "border-red-400 bg-red-50/30" : "border-gray-200"}`;

const selectCls =
  "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-orange-500 font-medium outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 appearance-none bg-white";

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
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
    </div>
  );
}

// ─── Employee Modal (Add + Edit) ──────────────────────────────────────────────
type FormState = {
  name: string;
  email: string;
  department: Department;
  role: Role;
  status: Status;
  pointsBalance: number;
};

interface EmployeeModalProps {
  mode: "add" | "edit";
  initial?: Employee;
  onClose: () => void;
  onSave: (data: Omit<Employee, "id">) => void;
}

function EmployeeModal({ mode, initial, onClose, onSave }: EmployeeModalProps) {
  const [form, setForm] = useState<FormState>({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    department: initial?.department ?? "Engineering",
    role: initial?.role ?? "Employee",
    status: initial?.status ?? "Delivered",
    pointsBalance: initial?.pointsBalance ?? 1000,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate() {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (form.pointsBalance < 0) e.pointsBalance = "Points must be ≥ 0";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave(form);
    onClose();
  }

  const isEdit = mode === "edit";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="relative mx-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 pb-4 pt-6">
          <div className="flex items-center gap-3">
            {isEdit && initial && (
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${avatarColor(initial.id)}`}
              >
                {getInitials(initial.name)}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEdit ? "Edit Employee" : "Add New Employee"}
              </h2>
              {isEdit && initial && (
                <p className="mt-0.5 text-xs text-gray-400">ID #{initial.id}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[65vh] space-y-4 overflow-y-auto px-6 py-5">
          <Field label="Full Name" error={errors.name}>
            <input
              type="text"
              placeholder="Saifur Rahman"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls(errors.name)}
            />
          </Field>

          <Field
            label="Email"
            error={errors.email}
            hint={
              isEdit
                ? "Changing email will trigger a verification."
                : "Employee will receive a welcome email with login instructions"
            }
          >
            <input
              type="email"
              placeholder="xyz@gmail.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={inputCls(errors.email)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Department">
              <SelectWrapper>
                <select
                  value={form.department}
                  onChange={(e) =>
                    set("department", e.target.value as Department)
                  }
                  className={selectCls}
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </SelectWrapper>
            </Field>
            <Field label="Role">
              <SelectWrapper>
                <select
                  value={form.role}
                  onChange={(e) => set("role", e.target.value as Role)}
                  className={selectCls}
                >
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </SelectWrapper>
            </Field>
          </div>

          {/* Status — only shown in edit mode */}
          {isEdit && (
            <Field label="Status">
              <SelectWrapper>
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value as Status)}
                  className={selectCls}
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </SelectWrapper>
            </Field>
          )}

          <Field
            label={isEdit ? "Points Balance" : "Starting Points Balance"}
            error={errors.pointsBalance}
            hint={
              isEdit
                ? "Adjust the employee's current points balance."
                : "Default quarterly allocation (can be adjusted later)"
            }
          >
            <input
              type="number"
              placeholder="1000"
              value={form.pointsBalance}
              onChange={(e) => set("pointsBalance", Number(e.target.value))}
              className={inputCls(errors.pointsBalance)}
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-gray-100 bg-gray-50/60 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600"
          >
            {isEdit ? (
              <>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Changes
              </>
            ) : (
              <>
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Employee
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────
function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: string;
  sortField: string;
  sortDir: "asc" | "desc";
}) {
  const active = sortField === field;
  return (
    <span className="ml-1 inline-flex flex-col opacity-50">
      <svg
        className={`-mb-0.5 h-2.5 w-2.5 ${active && sortDir === "asc" ? "text-orange-500 opacity-100" : ""}`}
        viewBox="0 0 10 6"
        fill="currentColor"
      >
        <path d="M5 0L10 6H0z" />
      </svg>
      <svg
        className={`h-2.5 w-2.5 ${active && sortDir === "desc" ? "text-orange-500 opacity-100" : ""}`}
        viewBox="0 0 10 6"
        fill="currentColor"
      >
        <path d="M5 6L0 0H10z" />
      </svg>
    </span>
  );
}

// ─── Modal state union ────────────────────────────────────────────────────────
type ModalState =
  | { type: "none" }
  | { type: "add" }
  | { type: "edit"; employee: Employee };

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState<Employee[]>(SEED_EMPLOYEES);
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [selectedDept, setSelectedDept] = useState<"All" | Department>("All");
  const [showDeptDrop, setShowDeptDrop] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(11);
  const [sortField, setSortField] = useState<keyof Employee>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // ── filter + sort ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list =
      selectedDept === "All"
        ? employees
        : employees.filter((e) => e.department === selectedDept);
    return [...list].sort((a, b) => {
      const va = String(a[sortField]).toLowerCase();
      const vb = String(b[sortField]).toLowerCase();
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [employees, selectedDept, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  function handleSort(field: keyof Employee) {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  // ── add ────────────────────────────────────────────────────────────────────
  function handleAdd(data: Omit<Employee, "id">) {
    setEmployees((prev) => [{ ...data, id: Date.now() }, ...prev]);
    setPage(1);
  }

  // ── edit — find employee by id and replace all fields ─────────────────────
  function handleEdit(data: Omit<Employee, "id">) {
    if (modal.type !== "edit") return;
    const targetId = modal.employee.id;
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === targetId ? { ...data, id: targetId } : emp,
      ),
    );
  }

  // ── remove ─────────────────────────────────────────────────────────────────
  function handleRemove(id: number) {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }

  // ── pagination numbers ─────────────────────────────────────────────────────
  function getPageNumbers() {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  }

  return (
    <div
      className="min-h-screen font-sans"
      onClick={() => showDeptDrop && setShowDeptDrop(false)}
    >
      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {modal.type === "add" && (
        <EmployeeModal
          mode="add"
          onClose={() => setModal({ type: "none" })}
          onSave={handleAdd}
        />
      )}
      {modal.type === "edit" && (
        <EmployeeModal
          mode="edit"
          initial={modal.employee}
          onClose={() => setModal({ type: "none" })}
          onSave={handleEdit}
        />
      )}

      <div className="">
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
              Employee Directory
            </h1>

            {/* Department filter dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowDeptDrop(!showDeptDrop)}
                className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                {selectedDept === "All" ? "All Department" : selectedDept}
                <svg
                  className={`h-4 w-4 text-gray-400 transition-transform ${showDeptDrop ? "rotate-180" : ""}`}
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
              {showDeptDrop && (
                <div className="absolute left-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                  {(["All", ...DEPARTMENTS] as const).map((dept) => (
                    <button
                      key={dept}
                      onClick={() => {
                        setSelectedDept(dept as "All" | Department);
                        setShowDeptDrop(false);
                        setPage(1);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${selectedDept === dept ? "bg-orange-50 font-semibold text-orange-600" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      {dept === "All" ? "All Department" : dept}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span className="hidden sm:inline">Bulk Upload (CSV)</span>
              <span className="sm:hidden">CSV</span>
            </button> */}
            <button
              onClick={() => setModal({ type: "add" })}
              className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Employee
            </button>
          </div>
        </div>

        {/* ── Table Card ────────────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {(
                    [
                      { label: "Name", field: "name" },
                      { label: "Email", field: "email" },
                      { label: "Department", field: "department" },
                      { label: "Points Balance", field: "pointsBalance" },
                      { label: "Role", field: "role" },
                      { label: "Status", field: "status" },
                    ] as { label: string; field: keyof Employee }[]
                  ).map(({ label, field }) => (
                    <th
                      key={field}
                      onClick={() => handleSort(field)}
                      className="cursor-pointer select-none whitespace-nowrap px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-orange-500 transition-colors hover:bg-orange-50/50"
                    >
                      <span className="inline-flex items-center gap-1">
                        {label}
                        <SortIcon
                          field={field}
                          sortField={sortField}
                          sortDir={sortDir}
                        />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-orange-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-16 text-center text-sm text-gray-400"
                    >
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((emp) => (
                    <tr
                      key={emp.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(emp.id)}`}
                          >
                            {getInitials(emp.name)}
                          </div>
                          <span className="whitespace-nowrap text-sm font-medium text-gray-800">
                            {emp.name}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-500">
                        {emp.email}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-700">
                        {emp.department}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm font-semibold text-orange-500">
                        {emp.pointsBalance.toLocaleString()} pts
                      </td>
                      <td className="px-4 py-3.5">
                        <RoleBadge role={emp.role} />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={emp.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {/*  Edit — opens modal pre-filled with this employee's data */}
                          <button
                            onClick={() =>
                              setModal({ type: "edit", employee: emp })
                            }
                            title="Edit employee"
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-orange-50 hover:text-orange-500"
                          >
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          {/* 🗑 Remove */}
                          <button
                            onClick={() => handleRemove(emp.id)}
                            title="Remove employee"
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <circle cx="12" cy="12" r="9" strokeWidth={2} />
                              <path
                                strokeLinecap="round"
                                strokeWidth={2}
                                d="M9 9l6 6M15 9l-6 6"
                              />
                            </svg>
                          </button>
                          {/* 👁 View */}
                          {/* <button
                            title="View employee"
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                            </svg>
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Mobile Cards ─────────────────────────────────────────────────── */}
          <div className="divide-y divide-gray-100 sm:hidden">
            {paginated.map((emp) => (
              <div
                key={`m-${emp.id}`}
                className="flex items-center gap-3 px-4 py-3"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(emp.id)}`}
                >
                  {getInitials(emp.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {emp.name}
                  </p>
                  <p className="truncate text-xs text-gray-400">{emp.email}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge status={emp.status} />
                  <span className="text-xs font-semibold text-orange-500">
                    {emp.pointsBalance.toLocaleString()} pts
                  </span>
                </div>
                <button
                  onClick={() => setModal({ type: "edit", employee: emp })}
                  className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-orange-50 hover:text-orange-500"
                >
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* ── Pagination Footer ─────────────────────────────────────────────── */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/50 px-4 py-4 sm:flex-row sm:px-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Showing</span>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="appearance-none rounded-lg border border-gray-200 bg-white px-3 py-1 pr-7 text-sm font-medium text-gray-700 outline-none focus:border-orange-400"
                >
                  {PAGE_SIZE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400"
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
              </div>
              <span>
                out of{" "}
                <strong className="text-gray-700">
                  {filtered.length.toLocaleString()}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">Previous</span>
              </button>

              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span
                    key={`e${i}`}
                    className="select-none px-2 py-1.5 text-sm text-gray-400"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                      page === p
                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 rounded-lg border border-orange-500 bg-orange-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="hidden sm:inline">Next</span>
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
