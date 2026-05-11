// "use client";

// import {
//   useGetAllUsersQuery,
//   useUpdateUserMutation,
//   useDeleteUserMutation,
//   useUserApprovedMutation,
//   useUserRejectedMutation,
// } from "@/redux/api/users/usersSliceApi";
// import React, { useState, useMemo } from "react";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type Role = "Employee" | "Manager" | "Admin";
// type Status = "Delivered" | "Pending" | "Inactive";

// interface Employee {
//   id: string;
//   name: string;
//   email: string;
//   department: string;
//   pointsBalance: number;
//   role: Role;
//   status: Status;
//   // raw API fields kept for update payload
//   rawRole: string;
//   rawIsActive: string;
//   accountType: string;
//   isDeleted: boolean;
//   isVerified: boolean;
// }

// // ─── API mappers ──────────────────────────────────────────────────────────────
// const ROLE_TO_DISPLAY: Record<string, Role> = {
//   SUPER_ADMIN: "Admin",
//   ADMIN: "Admin",
//   MANAGER: "Manager",
//   USER: "Employee",
// };
// const ROLE_TO_API: Record<Role, string> = {
//   Admin: "ADMIN",
//   Manager: "MANAGER",
//   Employee: "USER",
// };
// const STATUS_TO_DISPLAY: Record<string, Status> = {
//   ACTIVE: "Delivered",
//   INACTIVE: "Inactive",
//   PENDING: "Pending",
// };
// const STATUS_TO_API: Record<Status, string> = {
//   Delivered: "ACTIVE",
//   Pending: "PENDING",
//   Inactive: "INACTIVE",
// };

// function mapApiUser(u: any): Employee {
//   return {
//     id: u._id,
//     name: u.name,
//     email: u.email,
//     department: u.department ?? "—",
//     pointsBalance: u.wallet?.pointsBalance ?? 0,
//     role: ROLE_TO_DISPLAY[u.role] ?? "Employee",
//     status: STATUS_TO_DISPLAY[u.isActive] ?? "Delivered",
//     rawRole: u.role,
//     rawIsActive: u.isActive,
//     accountType: u.accountType ?? "INDIVIDUAL",
//     isDeleted: u.isDeleted ?? false,
//     isVerified: u.isVerified ?? true,
//   };
// }

// const ROLES: Role[] = ["Employee", "Admin"];
// const STATUSES: Status[] = ["Delivered", "Pending", "Inactive"];
// const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function getInitials(name: string) {
//   return name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);
// }
// const AVATAR_COLORS = [
//   "bg-orange-100 text-orange-600",
//   "bg-blue-100 text-blue-600",
//   "bg-green-100 text-green-600",
//   "bg-purple-100 text-purple-600",
//   "bg-pink-100 text-pink-600",
//   "bg-teal-100 text-teal-600",
// ];
// function avatarColor(id: string) {
//   const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
//   return AVATAR_COLORS[hash % AVATAR_COLORS.length];
// }

// // ─── Badges ───────────────────────────────────────────────────────────────────
// function RoleBadge({ role }: { role: Role }) {
//   const styles: Record<Role, string> = {
//     Employee: "bg-gray-100 text-gray-600",
//     Manager: "bg-purple-100 text-purple-600",
//     Admin: "bg-orange-100 text-orange-600",
//   };
//   return (
//     <span
//       className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[role]}`}
//     >
//       {role}
//     </span>
//   );
// }

// function StatusBadge({ status }: { status: Status }) {
//   const styles: Record<Status, string> = {
//     Delivered: "bg-green-50 text-green-600 border border-green-200",
//     Pending: "bg-yellow-50 text-yellow-600 border border-yellow-200",
//     Inactive: "bg-red-50 text-red-500 border border-red-200",
//   };
//   return (
//     <span
//       className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
//     >
//       {status}
//     </span>
//   );
// }

// // ─── Field wrapper ────────────────────────────────────────────────────────────
// function Field({
//   label,
//   error,
//   hint,
//   children,
// }: {
//   label: string;
//   error?: string;
//   hint?: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div>
//       <label className="mb-1.5 block text-sm font-semibold text-gray-700">
//         {label}
//       </label>
//       {children}
//       {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
//       {!error && hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
//     </div>
//   );
// }

// const inputCls = (err?: string) =>
//   `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 ${err ? "border-red-400 bg-red-50/30" : "border-gray-200"}`;

// const selectCls =
//   "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-orange-500 font-medium outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 appearance-none bg-white";

// function SelectWrapper({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="relative">
//       {children}
//       <svg
//         className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M19 9l-7 7-7-7"
//         />
//       </svg>
//     </div>
//   );
// }

// // ─── Delete Confirm Modal ─────────────────────────────────────────────────────
// function DeleteModal({
//   employee,
//   onClose,
//   onConfirm,
//   isLoading,
// }: {
//   employee: Employee;
//   onClose: () => void;
//   onConfirm: () => void;
//   isLoading: boolean;
// }) {
//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
//       <div
//         className="relative mx-auto w-full max-w-md rounded-2xl bg-white shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Icon */}
//         <div className="flex flex-col items-center px-6 pb-2 pt-8 text-center">
//           <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
//             <svg
//               className="h-7 w-7 text-red-500"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
//               />
//             </svg>
//           </div>
//           <h2 className="text-xl font-bold text-gray-900">Remove Employee</h2>
//           <p className="mt-2 text-sm leading-relaxed text-gray-500">
//             Are you sure you want to remove{" "}
//             <span className="font-semibold text-gray-800">{employee.name}</span>
//             ?
//             <br />
//             This action cannot be undone.
//           </p>

//           {/* Employee preview */}
//           <div className="mt-4 flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left">
//             <div
//               className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(employee.id)}`}
//             >
//               {getInitials(employee.name)}
//             </div>
//             <div className="min-w-0">
//               <p className="truncate text-sm font-semibold text-gray-800">
//                 {employee.name}
//               </p>
//               <p className="truncate text-xs text-gray-400">{employee.email}</p>
//             </div>
//             <RoleBadge role={employee.role} />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-6 flex items-center justify-end gap-3 rounded-b-2xl border-t border-gray-100 bg-gray-50/60 px-6 py-4">
//           <button
//             onClick={onClose}
//             disabled={isLoading}
//             className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={isLoading}
//             className="flex items-center gap-2 rounded-xl bg-red-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-colors hover:bg-red-600 disabled:opacity-50"
//           >
//             {isLoading ? (
//               <>
//                 <svg
//                   className="h-4 w-4 animate-spin"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v8z"
//                   />
//                 </svg>
//                 Removing...
//               </>
//             ) : (
//               <>
//                 <svg
//                   className="h-4 w-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                   />
//                 </svg>
//                 Yes, Remove
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Employee Modal (Add / Edit) ──────────────────────────────────────────────
// type FormState = {
//   name: string;
//   email: string;
//   department: string;
//   role: Role;
//   status: Status;
//   pointsBalance: number;
// };

// interface EmployeeModalProps {
//   mode: "add" | "edit";
//   initial?: Employee;
//   departments: string[];
//   onClose: () => void;
//   onSave: (data: FormState) => void;
//   isSaving?: boolean;
// }

// function EmployeeModal({
//   mode,
//   initial,
//   departments,
//   onClose,
//   onSave,
//   isSaving,
// }: EmployeeModalProps) {
//   const [form, setForm] = useState<FormState>({
//     name: initial?.name ?? "",
//     email: initial?.email ?? "",
//     department: initial?.department ?? (departments[0] || ""),
//     role: initial?.role ?? "Employee",
//     status: initial?.status ?? "Delivered",
//     pointsBalance: initial?.pointsBalance ?? 1000,
//   });
//   const [errors, setErrors] = useState<
//     Partial<Record<keyof FormState, string>>
//   >({});

//   function set<K extends keyof FormState>(key: K, val: FormState[K]) {
//     setForm((f) => ({ ...f, [key]: val }));
//     setErrors((e) => ({ ...e, [key]: undefined }));
//   }

//   function validate() {
//     const e: Partial<Record<keyof FormState, string>> = {};
//     if (!form.name.trim()) e.name = "Full name is required";
//     if (!form.email.trim()) e.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
//     if (form.pointsBalance < 0) e.pointsBalance = "Points must be ≥ 0";
//     return e;
//   }

//   function handleSubmit() {
//     const e = validate();
//     if (Object.keys(e).length) {
//       setErrors(e);
//       return;
//     }
//     onSave(form);
//   }

//   const isEdit = mode === "edit";

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
//       <div
//         className="relative mx-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-100 px-6 pb-4 pt-6">
//           <div className="flex items-center gap-3">
//             {isEdit && initial && (
//               <div
//                 className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${avatarColor(initial.id)}`}
//               >
//                 {getInitials(initial.name)}
//               </div>
//             )}
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 {isEdit ? "Edit Employee" : "Add New Employee"}
//               </h2>
//               {isEdit && initial && (
//                 <p className="mt-0.5 text-xs text-gray-400">
//                   ID #{initial.id.slice(-6)}
//                 </p>
//               )}
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
//           >
//             <svg
//               className="h-5 w-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>

//         {/* Body */}
//         <div className="max-h-[65vh] space-y-4 overflow-y-auto px-6 py-5">
//           <Field label="Full Name" error={errors.name}>
//             <input
//               type="text"
//               placeholder="John Doe"
//               value={form.name}
//               onChange={(e) => set("name", e.target.value)}
//               className={inputCls(errors.name)}
//             />
//           </Field>

//           <Field
//             label="Email"
//             error={errors.email}
//             hint={
//               isEdit
//                 ? "Changing email will trigger a verification."
//                 : "Employee will receive a welcome email with login instructions"
//             }
//           >
//             <input
//               type="email"
//               placeholder="xyz@gmail.com"
//               value={form.email}
//               onChange={(e) => set("email", e.target.value)}
//               className={inputCls(errors.email)}
//             />
//           </Field>

//           <div className="grid grid-cols-2 gap-4">
//             {/* Department — dynamic from API */}
//             <Field label="Department">
//               <SelectWrapper>
//                 <select
//                   value={form.department}
//                   onChange={(e) => set("department", e.target.value)}
//                   className={selectCls}
//                 >
//                   {departments.map((d) => (
//                     <option key={d}>{d}</option>
//                   ))}
//                 </select>
//               </SelectWrapper>
//             </Field>
//             <Field label="Role">
//               <SelectWrapper>
//                 <select
//                   value={form.role}
//                   onChange={(e) => set("role", e.target.value as Role)}
//                   className={selectCls}
//                 >
//                   {ROLES.map((r) => (
//                     <option key={r}>{r}</option>
//                   ))}
//                 </select>
//               </SelectWrapper>
//             </Field>
//           </div>

//           {isEdit && (
//             <Field label="Status">
//               <SelectWrapper>
//                 <select
//                   value={form.status}
//                   onChange={(e) => set("status", e.target.value as Status)}
//                   className={selectCls}
//                 >
//                   {STATUSES.map((s) => (
//                     <option key={s}>{s}</option>
//                   ))}
//                 </select>
//               </SelectWrapper>
//             </Field>
//           )}

//           <Field
//             label={isEdit ? "Points Balance" : "Starting Points Balance"}
//             error={errors.pointsBalance}
//             hint={
//               isEdit
//                 ? "Adjust the employee's current points balance."
//                 : "Default quarterly allocation (can be adjusted later)"
//             }
//           >
//             <input
//               type="number"
//               placeholder="1000"
//               value={form.pointsBalance}
//               onChange={(e) => set("pointsBalance", Number(e.target.value))}
//               className={inputCls(errors.pointsBalance)}
//             />
//           </Field>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-gray-100 bg-gray-50/60 px-6 py-4">
//           <button
//             onClick={onClose}
//             disabled={isSaving}
//             className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={isSaving}
//             className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600 disabled:opacity-50"
//           >
//             {isSaving ? (
//               <>
//                 <svg
//                   className="h-4 w-4 animate-spin"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v8z"
//                   />
//                 </svg>
//                 Saving...
//               </>
//             ) : isEdit ? (
//               <>
//                 <svg
//                   className="h-4 w-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//                 Save Changes
//               </>
//             ) : (
//               <>
//                 <svg
//                   className="h-4 w-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 4v16m8-8H4"
//                   />
//                 </svg>
//                 Add Employee
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Sort Icon ────────────────────────────────────────────────────────────────
// function SortIcon({
//   field,
//   sortField,
//   sortDir,
// }: {
//   field: string;
//   sortField: string;
//   sortDir: "asc" | "desc";
// }) {
//   const active = sortField === field;
//   return (
//     <span className="ml-1 inline-flex flex-col opacity-50">
//       <svg
//         className={`-mb-0.5 h-2.5 w-2.5 ${active && sortDir === "asc" ? "text-orange-500 opacity-100" : ""}`}
//         viewBox="0 0 10 6"
//         fill="currentColor"
//       >
//         <path d="M5 0L10 6H0z" />
//       </svg>
//       <svg
//         className={`h-2.5 w-2.5 ${active && sortDir === "desc" ? "text-orange-500 opacity-100" : ""}`}
//         viewBox="0 0 10 6"
//         fill="currentColor"
//       >
//         <path d="M5 6L0 0H10z" />
//       </svg>
//     </span>
//   );
// }

// function SkeletonRow() {
//   return (
//     <tr className="animate-pulse">
//       {Array.from({ length: 7 }).map((_, i) => (
//         <td key={i} className="px-4 py-3.5">
//           <div className="h-4 rounded bg-gray-100" />
//         </td>
//       ))}
//     </tr>
//   );
// }

// // ─── Modal state union ────────────────────────────────────────────────────────
// type ModalState =
//   | { type: "none" }
//   | { type: "add" }
//   | { type: "edit"; employee: Employee }
//   | { type: "delete"; employee: Employee };

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function EmployeeDirectory() {
//   const [modal, setModal] = useState<ModalState>({ type: "none" });
//   const [selectedDept, setSelectedDept] = useState<string>("All");
//   const [showDeptDrop, setShowDeptDrop] = useState(false);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [sortField, setSortField] = useState<keyof Employee>("name");
//   const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

//   const {
//     data: apiResponse,
//     isLoading,
//     isFetching,
//   } = useGetAllUsersQuery({ page, limit: pageSize });
//   const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
//   const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
//   const [approvedUser, { isLoading: isApprovLoading }] =
//     useUserApprovedMutation();
//   const [rejectedUser, { isLoading: isRejectedLoading }] =
//     useUserRejectedMutation();

//   // ── Map API → Employee ────────────────────────────────────────────────────
//   const employees: Employee[] = useMemo(() => {
//     if (!apiResponse?.data) return [];
//     return (apiResponse.data as any[]).map(mapApiUser);
//   }, [apiResponse]);

//   // ── Build department list dynamically from API data ───────────────────────
//   const departments: string[] = useMemo(() => {
//     const set = new Set(employees.map((e) => e.department).filter(Boolean));
//     return Array.from(set).sort();
//   }, [employees]);

//   // ── Department filter applied client-side on current page ─────────────────
//   const filtered = useMemo(() => {
//     if (selectedDept === "All") return employees;
//     return employees.filter((e) => e.department === selectedDept);
//   }, [employees, selectedDept]);

//   // ── Sort ──────────────────────────────────────────────────────────────────
//   const sorted = useMemo(() => {
//     return [...filtered].sort((a, b) => {
//       const va = String(a[sortField]).toLowerCase();
//       const vb = String(b[sortField]).toLowerCase();
//       return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
//     });
//   }, [filtered, sortField, sortDir]);

//   // ── Pagination — server drives total, client drives current page display ──
//   const meta = apiResponse?.meta;
//   const serverTotal: number = meta?.total ?? employees.length;
//   const totalPages = Math.max(1, Math.ceil(serverTotal / pageSize));

//   function handleSort(field: keyof Employee) {
//     if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
//     else {
//       setSortField(field);
//       setSortDir("asc");
//     }
//     setPage(1);
//   }

//   // ── Edit → call updateUser mutation ──────────────────────────────────────
//   async function handleEdit(formData: FormState) {
//     if (modal.type !== "edit") return;
//     const emp = modal.employee;
//     try {
//       await updateUser({
//         id: emp.id,
//         body: {
//           name: formData.name,
//           email: formData.email,
//           department: formData.department,
//           accountType: emp.accountType,
//           role: ROLE_TO_API[formData.role],
//           isActive: STATUS_TO_API[formData.status],
//           isDeleted: emp.isDeleted,
//           isVerified: emp.isVerified,
//         },
//       }).unwrap();
//       setModal({ type: "none" });
//     } catch (err) {
//       console.error("Update failed:", err);
//     }
//   }

//   // ── Delete → call deleteUser mutation ─────────────────────────────────────
//   async function handleDeleteConfirm() {
//     if (modal.type !== "delete") return;
//     try {
//       await deleteUser(modal.employee.id).unwrap();
//       setModal({ type: "none" });
//     } catch (err) {
//       console.error("Delete failed:", err);
//     }
//   }

//   // ── Pagination numbers ────────────────────────────────────────────────────
//   function getPageNumbers() {
//     if (totalPages <= 5)
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     if (page <= 3) return [1, 2, 3, "...", totalPages];
//     if (page >= totalPages - 2)
//       return [1, "...", totalPages - 2, totalPages - 1, totalPages];
//     return [1, "...", page - 1, page, page + 1, "...", totalPages];
//   }

//   const loading = isLoading || isFetching;

//   return (
//     <div
//       className="min-h-screen font-sans"
//       onClick={() => showDeptDrop && setShowDeptDrop(false)}
//     >
//       {/* ── Modals ──────────────────────────────────────────────────────────── */}
//       {modal.type === "add" && (
//         <EmployeeModal
//           mode="add"
//           departments={departments}
//           onClose={() => setModal({ type: "none" })}
//           onSave={() => setModal({ type: "none" })}
//         />
//       )}
//       {modal.type === "edit" && (
//         <EmployeeModal
//           mode="edit"
//           initial={modal.employee}
//           departments={departments}
//           onClose={() => setModal({ type: "none" })}
//           onSave={handleEdit}
//           isSaving={isUpdating}
//         />
//       )}
//       {modal.type === "delete" && (
//         <DeleteModal
//           employee={modal.employee}
//           onClose={() => setModal({ type: "none" })}
//           onConfirm={handleDeleteConfirm}
//           isLoading={isDeleting}
//         />
//       )}

//       <div>
//         {/* ── Header ──────────────────────────────────────────────────────── */}
//         <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//           <div className="flex flex-wrap items-center gap-3">
//             <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
//               Employee Directory
//             </h1>

//             {/* Department filter — options built from API data */}
//             <div className="relative" onClick={(e) => e.stopPropagation()}>
//               <button
//                 onClick={() => setShowDeptDrop(!showDeptDrop)}
//                 className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
//               >
//                 {selectedDept === "All" ? "All Department" : selectedDept}
//                 <svg
//                   className={`h-4 w-4 text-gray-400 transition-transform ${showDeptDrop ? "rotate-180" : ""}`}
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </button>

//               {showDeptDrop && (
//                 <div className="absolute left-0 top-full z-20 mt-1 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
//                   {/* All option */}
//                   <button
//                     onClick={() => {
//                       setSelectedDept("All");
//                       setShowDeptDrop(false);
//                       setPage(1);
//                     }}
//                     className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${selectedDept === "All" ? "bg-orange-50 font-semibold text-orange-600" : "text-gray-700 hover:bg-gray-50"}`}
//                   >
//                     All Department
//                   </button>
//                   {/* Dynamic dept options from API */}
//                   {departments.map((dept) => (
//                     <button
//                       key={dept}
//                       onClick={() => {
//                         setSelectedDept(dept);
//                         setShowDeptDrop(false);
//                         setPage(1);
//                       }}
//                       className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${selectedDept === dept ? "bg-orange-50 font-semibold text-orange-600" : "text-gray-700 hover:bg-gray-50"}`}
//                     >
//                       {dept}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* <button
//             onClick={() => setModal({ type: "add" })}
//             className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600"
//           >
//             <svg
//               className="h-4 w-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 4v16m8-8H4"
//               />
//             </svg>
//             Add Employee
//           </button> */}
//         </div>

//         {/* ── Table ───────────────────────────────────────────────────────── */}
//         <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-100">
//                   {(
//                     [
//                       { label: "Name", field: "name" },
//                       { label: "Email", field: "email" },
//                       { label: "Department", field: "department" },
//                       { label: "Points Balance", field: "pointsBalance" },
//                       { label: "Role", field: "role" },
//                       { label: "Status", field: "status" },
//                     ] as { label: string; field: keyof Employee }[]
//                   ).map(({ label, field }) => (
//                     <th
//                       key={field}
//                       onClick={() => handleSort(field)}
//                       className="cursor-pointer select-none whitespace-nowrap px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-orange-500 transition-colors hover:bg-orange-50/50"
//                     >
//                       <span className="inline-flex items-center gap-1">
//                         {label}
//                         <SortIcon
//                           field={field}
//                           sortField={sortField}
//                           sortDir={sortDir}
//                         />
//                       </span>
//                     </th>
//                   ))}
//                   <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-orange-500">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-50">
//                 {loading ? (
//                   Array.from({ length: pageSize }).map((_, i) => (
//                     <SkeletonRow key={i} />
//                   ))
//                 ) : sorted.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={7}
//                       className="py-16 text-center text-sm text-gray-400"
//                     >
//                       No employees found
//                       {selectedDept !== "All" ? ` in "${selectedDept}"` : ""}.
//                     </td>
//                   </tr>
//                 ) : (
//                   sorted.map((emp) => (
//                     <tr
//                       key={emp.id}
//                       className="transition-colors hover:bg-gray-50/70"
//                     >
//                       <td className="px-4 py-3.5">
//                         <div className="flex items-center gap-3">
//                           <div
//                             className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(emp.id)}`}
//                           >
//                             {getInitials(emp.name)}
//                           </div>
//                           <span className="whitespace-nowrap text-sm font-medium text-gray-800">
//                             {emp.name}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-500">
//                         {emp.email}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-700">
//                         {emp.department}
//                       </td>
//                       <td className="whitespace-nowrap px-4 py-3.5 text-sm font-semibold text-orange-500">
//                         {emp.pointsBalance.toLocaleString()} pts
//                       </td>
//                       <td className="px-4 py-3.5">
//                         <RoleBadge role={emp.role} />
//                       </td>
//                       <td className="px-4 py-3.5">
//                         <StatusBadge status={emp.status} />
//                       </td>
//                       <td className="px-4 py-3.5">
//                         <div className="flex items-center gap-1.5">
//                           <button
//                             onClick={() =>
//                               setModal({ type: "edit", employee: emp })
//                             }
//                             title="Edit employee"
//                             className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-orange-50 hover:text-orange-500"
//                           >
//                             <svg
//                               className="h-4 w-4"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                               />
//                             </svg>
//                           </button>
//                           {/* Opens delete confirm modal */}
//                           <button
//                             onClick={() =>
//                               setModal({ type: "delete", employee: emp })
//                             }
//                             title="Remove employee"
//                             className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
//                           >
//                             <svg
//                               className="h-4 w-4"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle cx="12" cy="12" r="9" strokeWidth={2} />
//                               <path
//                                 strokeLinecap="round"
//                                 strokeWidth={2}
//                                 d="M9 9l6 6M15 9l-6 6"
//                               />
//                             </svg>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* ── Pagination ───────────────────────────────────────────────── */}
//           <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/50 px-4 py-4 sm:flex-row sm:px-6">
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//               <span>Showing</span>
//               <div className="relative">
//                 <select
//                   value={pageSize}
//                   onChange={(e) => {
//                     setPageSize(Number(e.target.value));
//                     setPage(1);
//                   }}
//                   className="appearance-none rounded-lg border border-gray-200 bg-white px-3 py-1 pr-7 text-sm font-medium text-gray-700 outline-none focus:border-orange-400"
//                 >
//                   {PAGE_SIZE_OPTIONS.map((s) => (
//                     <option key={s} value={s}>
//                       {s}
//                     </option>
//                   ))}
//                 </select>
//                 <svg
//                   className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </div>
//               <span>
//                 out of{" "}
//                 <strong className="text-gray-700">
//                   {serverTotal.toLocaleString()}
//                 </strong>
//               </span>
//             </div>

//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={page === 1 || loading}
//                 className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
//               >
//                 <svg
//                   className="h-3.5 w-3.5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 19l-7-7 7-7"
//                   />
//                 </svg>
//                 <span className="hidden sm:inline">Previous</span>
//               </button>

//               {getPageNumbers().map((p, i) =>
//                 p === "..." ? (
//                   <span
//                     key={`e${i}`}
//                     className="select-none px-2 py-1.5 text-sm text-gray-400"
//                   >
//                     …
//                   </span>
//                 ) : (
//                   <button
//                     key={p}
//                     onClick={() => setPage(p as number)}
//                     disabled={loading}
//                     className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${page === p ? "bg-orange-500 text-white shadow-md shadow-orange-500/25" : "border border-gray-200 text-gray-600 hover:bg-gray-100"}`}
//                   >
//                     {p}
//                   </button>
//                 ),
//               )}

//               <button
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={page === totalPages || loading}
//                 className="flex items-center gap-1 rounded-lg border border-orange-500 bg-orange-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
//               >
//                 <span className="hidden sm:inline">Next</span>
//                 <svg
//                   className="h-3.5 w-3.5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import {
//   useGetAllUsersQuery,
//   useUpdateUserMutation,
//   useDeleteUserMutation,
//   useUserApprovedMutation,
//   useUserRejectedMutation,
// } from "@/redux/api/users/usersSliceApi";
// import React, { useState, useMemo } from "react";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type Role = "Employee" | "Manager" | "Admin";
// type Status = "Pending" | "Approved" | "Rejected";

// interface Employee {
//   id: string;
//   name: string;
//   email: string;
//   department: string;
//   pointsBalance: number;
//   role: Role;
//   status: Status;
//   rawRole: string;
//   rawIsActive: string;
//   accountType: string;
//   isDeleted: boolean;
//   isVerified: boolean;
// }

// // ─── API mappers ──────────────────────────────────────────────────────────────
// const ROLE_TO_DISPLAY: Record<string, Role> = {
//   SUPER_ADMIN: "Admin",
//   ADMIN: "Admin",
//   MANAGER: "Manager",
//   USER: "Employee",
// };
// const ROLE_TO_API: Record<Role, string> = {
//   Admin: "ADMIN",
//   Manager: "MANAGER",
//   Employee: "USER",
// };

// const STATUS_TO_DISPLAY = (apiStatus: string): Status => {
//   if (apiStatus === "APPROVED") return "Approved";
//   if (apiStatus === "REJECTED") return "Rejected";
//   return "Pending";
// };

// const STATUS_TO_API: Record<Status, string> = {
//   Approved: "APPROVED",
//   Rejected: "REJECTED",
//   Pending: "PENDING",
// };

// function mapApiUser(u: any): Employee {
//   const rawStatus = u.status ?? "PENDING";
//   return {
//     id: u._id,
//     name: u.name,
//     email: u.email,
//     department: u.department ?? "—",
//     pointsBalance: u.wallet?.pointsBalance ?? 0,
//     role: ROLE_TO_DISPLAY[u.role] ?? "Employee",
//     status: STATUS_TO_DISPLAY(rawStatus),
//     rawRole: u.role,
//     rawIsActive: u.isActive,
//     accountType: u.accountType ?? "INDIVIDUAL",
//     isDeleted: u.isDeleted ?? false,
//     isVerified: u.isVerified ?? true,
//   };
// }

// const ROLES: Role[] = ["Employee", "Admin"];
// const STATUSES: Status[] = ["Pending", "Approved", "Rejected"];
// const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function getInitials(name: string) {
//   return name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);
// }

// const AVATAR_COLORS = [
//   "bg-orange-100 text-orange-600",
//   "bg-blue-100 text-blue-600",
//   "bg-green-100 text-green-600",
//   "bg-purple-100 text-purple-600",
//   "bg-pink-100 text-pink-600",
//   "bg-teal-100 text-teal-600",
// ];

// function avatarColor(id: string) {
//   const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
//   return AVATAR_COLORS[hash % AVATAR_COLORS.length];
// }

// // ─── Badges ───────────────────────────────────────────────────────────────────
// function RoleBadge({ role }: { role: Role }) {
//   const styles: Record<Role, string> = {
//     Employee: "bg-gray-100 text-gray-600",
//     Manager: "bg-purple-100 text-purple-600",
//     Admin: "bg-orange-100 text-orange-600",
//   };
//   return (
//     <span
//       className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[role]}`}
//     >
//       {role}
//     </span>
//   );
// }

// // ─── Status Badge — shows account type for INDIVIDUAL, org status for ORGANIZATION
// function StatusBadge({
//   status,
//   accountType,
//   name, // ← add this
// }: {
//   status: Status;
//   accountType: string;
//   name: string; // ← add this
// }) {
//   // INDIVIDUAL → always show "Individual" type badge
//   if (accountType === "INDIVIDUAL") {
//     return (
//       <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
//         <svg
//           className="h-3 w-3"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//           />
//         </svg>
//         INDIVIDUAL
//       </span>
//     );
//   }

//   // ORGANIZATION → show org name badge instead of status
//   return (
//     <span className="inline-flex max-w-[140px] items-center gap-1.5 truncate rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600">
//       <svg
//         className="h-3 w-3 shrink-0"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
//         />
//       </svg>
//       ORGANIZATION
//     </span>
//   );
// }
// // ─── Approval Column — N/A for INDIVIDUAL, action buttons for ORGANIZATION ────
// function ApproveRejectButtons({
//   employee,
//   onApprove,
//   onReject,
//   isApprovLoading,
//   isRejectedLoading,
//   activeId,
// }: {
//   employee: Employee;
//   onApprove: (id: string) => void;
//   onReject: (id: string) => void;
//   isApprovLoading: boolean;
//   isRejectedLoading: boolean;
//   activeId: string | null;
// }) {
//   // INDIVIDUAL → show N/A badge
//   if (employee.accountType === "INDIVIDUAL") {
//     return (
//       <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
//         <svg
//           className="h-3.5 w-3.5"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2.5}
//             d="M5 13l4 4L19 7"
//           />
//         </svg>
//         Approved
//       </span>
//     );
//   }

//   const isThisLoading =
//     activeId === employee.id && (isApprovLoading || isRejectedLoading);

//   // ORGANIZATION + APPROVED
//   if (employee.status === "Approved") {
//     return (
//       <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
//         <svg
//           className="h-3.5 w-3.5"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2.5}
//             d="M5 13l4 4L19 7"
//           />
//         </svg>
//         Approved
//       </span>
//     );
//   }

//   // ORGANIZATION + REJECTED
//   if (employee.status === "Rejected") {
//     return (
//       <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500">
//         <svg
//           className="h-3.5 w-3.5"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2.5}
//             d="M6 18L18 6M6 6l12 12"
//           />
//         </svg>
//         Rejected
//       </span>
//     );
//   }

//   // ORGANIZATION + PENDING → live action buttons
//   return (
//     <div className="flex items-center gap-1.5">
//       <button
//         onClick={() => onApprove(employee.id)}
//         disabled={isThisLoading}
//         title="Approve organisation"
//         className="flex items-center gap-1 rounded-lg bg-green-500 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-green-500/20 transition-all hover:bg-green-600 disabled:opacity-50"
//       >
//         {isThisLoading && isApprovLoading ? (
//           <svg
//             className="h-3.5 w-3.5 animate-spin"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             />
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8v8z"
//             />
//           </svg>
//         ) : (
//           <svg
//             className="h-3.5 w-3.5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2.5}
//               d="M5 13l4 4L19 7"
//             />
//           </svg>
//         )}
//         Approve
//       </button>

//       <button
//         onClick={() => onReject(employee.id)}
//         disabled={isThisLoading}
//         title="Reject organisation"
//         className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-500 transition-all hover:bg-red-500 hover:text-white disabled:opacity-50"
//       >
//         {isThisLoading && isRejectedLoading ? (
//           <svg
//             className="h-3.5 w-3.5 animate-spin"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             />
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8v8z"
//             />
//           </svg>
//         ) : (
//           <svg
//             className="h-3.5 w-3.5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2.5}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         )}
//         Reject
//       </button>
//     </div>
//   );
// }

// // ─── Field wrapper ────────────────────────────────────────────────────────────
// function Field({
//   label,
//   error,
//   hint,
//   children,
// }: {
//   label: string;
//   error?: string;
//   hint?: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div>
//       <label className="mb-1.5 block text-sm font-semibold text-gray-700">
//         {label}
//       </label>
//       {children}
//       {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
//       {!error && hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
//     </div>
//   );
// }

// const inputCls = (err?: string) =>
//   `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 ${err ? "border-red-400 bg-red-50/30" : "border-gray-200"}`;

// const selectCls =
//   "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-orange-500 font-medium outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 appearance-none bg-white";

// function SelectWrapper({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="relative">
//       {children}
//       <svg
//         className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M19 9l-7 7-7-7"
//         />
//       </svg>
//     </div>
//   );
// }

// // ─── Delete Confirm Modal ─────────────────────────────────────────────────────
// function DeleteModal({
//   employee,
//   onClose,
//   onConfirm,
//   isLoading,
// }: {
//   employee: Employee;
//   onClose: () => void;
//   onConfirm: () => void;
//   isLoading: boolean;
// }) {
//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
//       <div
//         className="relative mx-auto w-full max-w-md rounded-2xl bg-white shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex flex-col items-center px-6 pb-2 pt-8 text-center">
//           <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
//             <svg
//               className="h-7 w-7 text-red-500"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
//               />
//             </svg>
//           </div>
//           <h2 className="text-xl font-bold text-gray-900">Remove Employee</h2>
//           <p className="mt-2 text-sm leading-relaxed text-gray-500">
//             Are you sure you want to remove{" "}
//             <span className="font-semibold text-gray-800">{employee.name}</span>
//             ?<br />
//             This action cannot be undone.
//           </p>
//           <div className="mt-4 flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left">
//             <div
//               className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(employee.id)}`}
//             >
//               {getInitials(employee.name)}
//             </div>
//             <div className="min-w-0">
//               <p className="truncate text-sm font-semibold text-gray-800">
//                 {employee.name}
//               </p>
//               <p className="truncate text-xs text-gray-400">{employee.email}</p>
//             </div>
//             <RoleBadge role={employee.role} />
//           </div>
//         </div>
//         <div className="mt-6 flex items-center justify-end gap-3 rounded-b-2xl border-t border-gray-100 bg-gray-50/60 px-6 py-4">
//           <button
//             onClick={onClose}
//             disabled={isLoading}
//             className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={isLoading}
//             className="flex items-center gap-2 rounded-xl bg-red-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-colors hover:bg-red-600 disabled:opacity-50"
//           >
//             {isLoading ? (
//               <>
//                 <svg
//                   className="h-4 w-4 animate-spin"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v8z"
//                   />
//                 </svg>
//                 Removing...
//               </>
//             ) : (
//               <>
//                 <svg
//                   className="h-4 w-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                   />
//                 </svg>
//                 Yes, Remove
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Employee Modal ───────────────────────────────────────────────────────────
// type FormState = {
//   name: string;
//   email: string;
//   department: string;
//   role: Role;
//   status: Status;
//   pointsBalance: number;
// };

// interface EmployeeModalProps {
//   mode: "add" | "edit";
//   initial?: Employee;
//   departments: string[];
//   onClose: () => void;
//   onSave: (data: FormState) => void;
//   isSaving?: boolean;
// }

// function EmployeeModal({
//   mode,
//   initial,
//   departments,
//   onClose,
//   onSave,
//   isSaving,
// }: EmployeeModalProps) {
//   const [form, setForm] = useState<FormState>({
//     name: initial?.name ?? "",
//     email: initial?.email ?? "",
//     department: initial?.department ?? (departments[0] || ""),
//     role: initial?.role ?? "Employee",
//     status: initial?.status ?? "Pending",
//     pointsBalance: initial?.pointsBalance ?? 1000,
//   });
//   const [errors, setErrors] = useState<
//     Partial<Record<keyof FormState, string>>
//   >({});

//   function set<K extends keyof FormState>(key: K, val: FormState[K]) {
//     setForm((f) => ({ ...f, [key]: val }));
//     setErrors((e) => ({ ...e, [key]: undefined }));
//   }

//   function validate() {
//     const e: Partial<Record<keyof FormState, string>> = {};
//     if (!form.name.trim()) e.name = "Full name is required";
//     if (!form.email.trim()) e.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
//     if (form.pointsBalance < 0) e.pointsBalance = "Points must be ≥ 0";
//     return e;
//   }

//   function handleSubmit() {
//     const e = validate();
//     if (Object.keys(e).length) {
//       setErrors(e);
//       return;
//     }
//     onSave(form);
//   }

//   const isEdit = mode === "edit";

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
//       <div
//         className="relative mx-auto w-full max-w-lg rounded-2xl bg-white shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-gray-100 px-6 pb-4 pt-6">
//           <div className="flex items-center gap-3">
//             {isEdit && initial && (
//               <div
//                 className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${avatarColor(initial.id)}`}
//               >
//                 {getInitials(initial.name)}
//               </div>
//             )}
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">
//                 {isEdit ? "Edit Employee" : "Add New Employee"}
//               </h2>
//               {isEdit && initial && (
//                 <p className="mt-0.5 text-xs text-gray-400">
//                   ID #{initial.id.slice(-6)}
//                 </p>
//               )}
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
//           >
//             <svg
//               className="h-5 w-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>

//         {/* Body */}
//         <div className="max-h-[65vh] space-y-4 overflow-y-auto px-6 py-5">
//           <Field label="Full Name" error={errors.name}>
//             <input
//               type="text"
//               placeholder="John Doe"
//               value={form.name}
//               onChange={(e) => set("name", e.target.value)}
//               className={inputCls(errors.name)}
//             />
//           </Field>

//           <Field
//             label="Email"
//             error={errors.email}
//             hint={
//               isEdit
//                 ? "Changing email will trigger a verification."
//                 : "Employee will receive a welcome email with login instructions"
//             }
//           >
//             <input
//               type="email"
//               placeholder="xyz@gmail.com"
//               value={form.email}
//               onChange={(e) => set("email", e.target.value)}
//               className={inputCls(errors.email)}
//             />
//           </Field>

//           <div className="grid grid-cols-2 gap-4">
//             <Field label="Department">
//               <SelectWrapper>
//                 <select
//                   value={form.department}
//                   onChange={(e) => set("department", e.target.value)}
//                   className={selectCls}
//                 >
//                   {departments.map((d) => (
//                     <option key={d}>{d}</option>
//                   ))}
//                 </select>
//               </SelectWrapper>
//             </Field>
//             <Field label="Role">
//               <SelectWrapper>
//                 <select
//                   value={form.role}
//                   onChange={(e) => set("role", e.target.value as Role)}
//                   className={selectCls}
//                 >
//                   {ROLES.map((r) => (
//                     <option key={r}>{r}</option>
//                   ))}
//                 </select>
//               </SelectWrapper>
//             </Field>
//           </div>

//           {/* Status selector only for ORGANIZATION accounts in edit mode */}
//           {isEdit && initial?.accountType === "ORGANIZATION" && (
//             <Field label="Status">
//               <SelectWrapper>
//                 <select
//                   value={form.status}
//                   onChange={(e) => set("status", e.target.value as Status)}
//                   className={selectCls}
//                 >
//                   {STATUSES.map((s) => (
//                     <option key={s}>{s}</option>
//                   ))}
//                 </select>
//               </SelectWrapper>
//             </Field>
//           )}

//           <Field
//             label={isEdit ? "Points Balance" : "Starting Points Balance"}
//             error={errors.pointsBalance}
//             hint={
//               isEdit
//                 ? "Adjust the employee's current points balance."
//                 : "Default quarterly allocation (can be adjusted later)"
//             }
//           >
//             <input
//               type="number"
//               placeholder="1000"
//               value={form.pointsBalance}
//               onChange={(e) => set("pointsBalance", Number(e.target.value))}
//               className={inputCls(errors.pointsBalance)}
//             />
//           </Field>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-gray-100 bg-gray-50/60 px-6 py-4">
//           <button
//             onClick={onClose}
//             disabled={isSaving}
//             className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={isSaving}
//             className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600 disabled:opacity-50"
//           >
//             {isSaving ? (
//               <>
//                 <svg
//                   className="h-4 w-4 animate-spin"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v8z"
//                   />
//                 </svg>
//                 Saving...
//               </>
//             ) : isEdit ? (
//               <>
//                 <svg
//                   className="h-4 w-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M5 13l4 4L19 7"
//                   />
//                 </svg>
//                 Save Changes
//               </>
//             ) : (
//               <>
//                 <svg
//                   className="h-4 w-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M12 4v16m8-8H4"
//                   />
//                 </svg>
//                 Add Employee
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Sort Icon ────────────────────────────────────────────────────────────────
// function SortIcon({
//   field,
//   sortField,
//   sortDir,
// }: {
//   field: string;
//   sortField: string;
//   sortDir: "asc" | "desc";
// }) {
//   const active = sortField === field;
//   return (
//     <span className="ml-1 inline-flex flex-col opacity-50">
//       <svg
//         className={`-mb-0.5 h-2.5 w-2.5 ${active && sortDir === "asc" ? "text-orange-500 opacity-100" : ""}`}
//         viewBox="0 0 10 6"
//         fill="currentColor"
//       >
//         <path d="M5 0L10 6H0z" />
//       </svg>
//       <svg
//         className={`h-2.5 w-2.5 ${active && sortDir === "desc" ? "text-orange-500 opacity-100" : ""}`}
//         viewBox="0 0 10 6"
//         fill="currentColor"
//       >
//         <path d="M5 6L0 0H10z" />
//       </svg>
//     </span>
//   );
// }

// function SkeletonRow() {
//   return (
//     <tr className="animate-pulse">
//       {Array.from({ length: 8 }).map((_, i) => (
//         <td key={i} className="px-4 py-3.5">
//           <div className="h-4 rounded bg-gray-100" />
//         </td>
//       ))}
//     </tr>
//   );
// }

// // ─── Modal state union ────────────────────────────────────────────────────────
// type ModalState =
//   | { type: "none" }
//   | { type: "add" }
//   | { type: "edit"; employee: Employee }
//   | { type: "delete"; employee: Employee };

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function EmployeeDirectory() {
//   const [modal, setModal] = useState<ModalState>({ type: "none" });
//   const [selectedDept, setSelectedDept] = useState<string>("All");
//   const [showDeptDrop, setShowDeptDrop] = useState(false);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [sortField, setSortField] = useState<keyof Employee>("name");
//   const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
//   const [activeActionId, setActiveActionId] = useState<string | null>(null);

//   const {
//     data: apiResponse,
//     isLoading,
//     isFetching,
//   } = useGetAllUsersQuery({ page, limit: pageSize });

//   const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
//   const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
//   const [approvedUser, { isLoading: isApprovLoading }] =
//     useUserApprovedMutation();
//   const [rejectedUser, { isLoading: isRejectedLoading }] =
//     useUserRejectedMutation();

//   const employees: Employee[] = useMemo(() => {
//     if (!apiResponse?.data) return [];
//     return (apiResponse.data as any[]).map(mapApiUser);
//   }, [apiResponse]);

//   const departments: string[] = useMemo(() => {
//     const set = new Set(employees.map((e) => e.department).filter(Boolean));
//     return Array.from(set).sort();
//   }, [employees]);

//   const filtered = useMemo(() => {
//     if (selectedDept === "All") return employees;
//     return employees.filter((e) => e.department === selectedDept);
//   }, [employees, selectedDept]);

//   const sorted = useMemo(() => {
//     return [...filtered].sort((a, b) => {
//       const va = String(a[sortField]).toLowerCase();
//       const vb = String(b[sortField]).toLowerCase();
//       return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
//     });
//   }, [filtered, sortField, sortDir]);

//   const meta = apiResponse?.meta;
//   const serverTotal: number = meta?.total ?? employees.length;
//   const totalPages = Math.max(1, Math.ceil(serverTotal / pageSize));

//   function handleSort(field: keyof Employee) {
//     if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
//     else {
//       setSortField(field);
//       setSortDir("asc");
//     }
//     setPage(1);
//   }

//   async function handleEdit(formData: FormState) {
//     if (modal.type !== "edit") return;
//     const emp = modal.employee;
//     try {
//       await updateUser({
//         id: emp.id,
//         body: {
//           name: formData.name,
//           email: formData.email,
//           department: formData.department,
//           accountType: emp.accountType,
//           role: ROLE_TO_API[formData.role],
//           isActive: STATUS_TO_API[formData.status],
//           isDeleted: emp.isDeleted,
//           isVerified: emp.isVerified,
//         },
//       }).unwrap();
//       setModal({ type: "none" });
//     } catch (err) {
//       console.error("Update failed:", err);
//     }
//   }

//   async function handleDeleteConfirm() {
//     if (modal.type !== "delete") return;
//     try {
//       await deleteUser(modal.employee.id).unwrap();
//       setModal({ type: "none" });
//     } catch (err) {
//       console.error("Delete failed:", err);
//     }
//   }

//   async function handleApprove(id: string) {
//     setActiveActionId(id);
//     try {
//       await approvedUser(id).unwrap();
//     } catch (err) {
//       console.error("Approve failed:", err);
//     } finally {
//       setActiveActionId(null);
//     }
//   }

//   async function handleReject(id: string) {
//     setActiveActionId(id);
//     try {
//       await rejectedUser(id).unwrap();
//     } catch (err) {
//       console.error("Reject failed:", err);
//     } finally {
//       setActiveActionId(null);
//     }
//   }

//   function getPageNumbers() {
//     if (totalPages <= 5)
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     if (page <= 3) return [1, 2, 3, "...", totalPages];
//     if (page >= totalPages - 2)
//       return [1, "...", totalPages - 2, totalPages - 1, totalPages];
//     return [1, "...", page - 1, page, page + 1, "...", totalPages];
//   }

//   const loading = isLoading || isFetching;

//   return (
//     <div
//       className="min-h-screen font-sans"
//       onClick={() => showDeptDrop && setShowDeptDrop(false)}
//     >
//       {/* ── Modals ── */}
//       {modal.type === "add" && (
//         <EmployeeModal
//           mode="add"
//           departments={departments}
//           onClose={() => setModal({ type: "none" })}
//           onSave={() => setModal({ type: "none" })}
//         />
//       )}
//       {modal.type === "edit" && (
//         <EmployeeModal
//           mode="edit"
//           initial={modal.employee}
//           departments={departments}
//           onClose={() => setModal({ type: "none" })}
//           onSave={handleEdit}
//           isSaving={isUpdating}
//         />
//       )}
//       {modal.type === "delete" && (
//         <DeleteModal
//           employee={modal.employee}
//           onClose={() => setModal({ type: "none" })}
//           onConfirm={handleDeleteConfirm}
//           isLoading={isDeleting}
//         />
//       )}

//       <div>
//         {/* ── Header ── */}
//         <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//           <div className="flex flex-wrap items-center gap-3">
//             <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
//               Employee Directory
//             </h1>

//             <div className="relative" onClick={(e) => e.stopPropagation()}>
//               <button
//                 onClick={() => setShowDeptDrop(!showDeptDrop)}
//                 className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
//               >
//                 {selectedDept === "All" ? "All Department" : selectedDept}
//                 <svg
//                   className={`h-4 w-4 text-gray-400 transition-transform ${showDeptDrop ? "rotate-180" : ""}`}
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </button>

//               {showDeptDrop && (
//                 <div className="absolute left-0 top-full z-20 mt-1 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
//                   <button
//                     onClick={() => {
//                       setSelectedDept("All");
//                       setShowDeptDrop(false);
//                       setPage(1);
//                     }}
//                     className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
//                       selectedDept === "All"
//                         ? "bg-orange-50 font-semibold text-orange-600"
//                         : "text-gray-700 hover:bg-gray-50"
//                     }`}
//                   >
//                     All Department
//                   </button>
//                   {departments.map((dept) => (
//                     <button
//                       key={dept}
//                       onClick={() => {
//                         setSelectedDept(dept);
//                         setShowDeptDrop(false);
//                         setPage(1);
//                       }}
//                       className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
//                         selectedDept === dept
//                           ? "bg-orange-50 font-semibold text-orange-600"
//                           : "text-gray-700 hover:bg-gray-50"
//                       }`}
//                     >
//                       {dept}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ── Table ── */}
//         <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-100">
//                   {(
//                     [
//                       { label: "Name", field: "name" },
//                       { label: "Email", field: "email" },
//                       { label: "Department", field: "department" },
//                       { label: "Points Balance", field: "pointsBalance" },
//                       { label: "Role", field: "role" },
//                       { label: "Status", field: "status" },
//                     ] as { label: string; field: keyof Employee }[]
//                   ).map(({ label, field }) => (
//                     <th
//                       key={field}
//                       onClick={() => handleSort(field)}
//                       className="cursor-pointer select-none whitespace-nowrap px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-orange-500 transition-colors hover:bg-orange-50/50"
//                     >
//                       <span className="inline-flex items-center gap-1">
//                         {label}
//                         <SortIcon
//                           field={field}
//                           sortField={sortField}
//                           sortDir={sortDir}
//                         />
//                       </span>
//                     </th>
//                   ))}
//                   <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-orange-500">
//                     Approval
//                   </th>
//                   <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-orange-500">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-50">
//                 {loading ? (
//                   Array.from({ length: pageSize }).map((_, i) => (
//                     <SkeletonRow key={i} />
//                   ))
//                 ) : sorted.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={8}
//                       className="py-16 text-center text-sm text-gray-400"
//                     >
//                       No employees found
//                       {selectedDept !== "All" ? ` in "${selectedDept}"` : ""}.
//                     </td>
//                   </tr>
//                 ) : (
//                   sorted.map((emp) => (
//                     <tr
//                       key={emp.id}
//                       className="transition-colors hover:bg-gray-50/70"
//                     >
//                       {/* Name */}
//                       <td className="px-4 py-3.5">
//                         <div className="flex items-center gap-3">
//                           <div
//                             className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(emp.id)}`}
//                           >
//                             {getInitials(emp.name)}
//                           </div>
//                           <span className="whitespace-nowrap text-sm font-medium text-gray-800">
//                             {emp.name}
//                           </span>
//                         </div>
//                       </td>

//                       {/* Email */}
//                       <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-500">
//                         {emp.email}
//                       </td>

//                       {/* Department */}
//                       <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-700">
//                         {emp.department}
//                       </td>

//                       {/* Points */}
//                       <td className="whitespace-nowrap px-4 py-3.5 text-sm font-semibold text-orange-500">
//                         {emp.pointsBalance.toLocaleString()} pts
//                       </td>

//                       {/* Role */}
//                       <td className="px-4 py-3.5">
//                         <RoleBadge role={emp.role} />
//                       </td>

//                       {/* Status:
//                             INDIVIDUAL → blue "Individual" badge
//                             ORGANIZATION → Pending/Approved/Rejected badge */}
//                       <td className="px-4 py-3.5">
//                         <StatusBadge
//                           status={emp.status}
//                           accountType={emp.accountType}
//                           name={emp.name} // ← add this
//                         />
//                       </td>

//                       {/* Approval:
//                             INDIVIDUAL → grey "N/A" badge
//                             ORGANIZATION PENDING → Approve + Reject buttons
//                             ORGANIZATION APPROVED → green Approved chip
//                             ORGANIZATION REJECTED → red Rejected chip */}
//                       <td className="px-4 py-3.5">
//                         <ApproveRejectButtons
//                           employee={emp}
//                           onApprove={handleApprove}
//                           onReject={handleReject}
//                           isApprovLoading={isApprovLoading}
//                           isRejectedLoading={isRejectedLoading}
//                           activeId={activeActionId}
//                         />
//                       </td>

//                       {/* Edit / Delete */}
//                       <td className="px-4 py-3.5">
//                         <div className="flex items-center gap-1.5">
//                           <button
//                             onClick={() =>
//                               setModal({ type: "edit", employee: emp })
//                             }
//                             title="Edit employee"
//                             className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-orange-50 hover:text-orange-500"
//                           >
//                             <svg
//                               className="h-4 w-4"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                               />
//                             </svg>
//                           </button>
//                           <button
//                             onClick={() =>
//                               setModal({ type: "delete", employee: emp })
//                             }
//                             title="Remove employee"
//                             className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
//                           >
//                             <svg
//                               className="h-4 w-4"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <circle cx="12" cy="12" r="9" strokeWidth={2} />
//                               <path
//                                 strokeLinecap="round"
//                                 strokeWidth={2}
//                                 d="M9 9l6 6M15 9l-6 6"
//                               />
//                             </svg>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* ── Pagination ── */}
//           <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/50 px-4 py-4 sm:flex-row sm:px-6">
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//               <span>Showing</span>
//               <div className="relative">
//                 <select
//                   value={pageSize}
//                   onChange={(e) => {
//                     setPageSize(Number(e.target.value));
//                     setPage(1);
//                   }}
//                   className="appearance-none rounded-lg border border-gray-200 bg-white px-3 py-1 pr-7 text-sm font-medium text-gray-700 outline-none focus:border-orange-400"
//                 >
//                   {PAGE_SIZE_OPTIONS.map((s) => (
//                     <option key={s} value={s}>
//                       {s}
//                     </option>
//                   ))}
//                 </select>
//                 <svg
//                   className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </div>
//               <span>
//                 out of{" "}
//                 <strong className="text-gray-700">
//                   {serverTotal.toLocaleString()}
//                 </strong>
//               </span>
//             </div>

//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={page === 1 || loading}
//                 className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
//               >
//                 <svg
//                   className="h-3.5 w-3.5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 19l-7-7 7-7"
//                   />
//                 </svg>
//                 <span className="hidden sm:inline">Previous</span>
//               </button>

//               {getPageNumbers().map((p, i) =>
//                 p === "..." ? (
//                   <span
//                     key={`e${i}`}
//                     className="select-none px-2 py-1.5 text-sm text-gray-400"
//                   >
//                     …
//                   </span>
//                 ) : (
//                   <button
//                     key={p}
//                     onClick={() => setPage(p as number)}
//                     disabled={loading}
//                     className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
//                       page === p
//                         ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
//                         : "border border-gray-200 text-gray-600 hover:bg-gray-100"
//                     }`}
//                   >
//                     {p}
//                   </button>
//                 ),
//               )}

//               <button
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={page === totalPages || loading}
//                 className="flex items-center gap-1 rounded-lg border border-orange-500 bg-orange-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
//               >
//                 <span className="hidden sm:inline">Next</span>
//                 <svg
//                   className="h-3.5 w-3.5"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUserApprovedMutation,
  useUserRejectedMutation,
} from "@/redux/api/users/usersSliceApi";
import React, { useState, useMemo } from "react";
import { toast } from "sonner";

// ─── Department Enum ──────────────────────────────────────────────────────────
export enum Department {
  Sales = "Sales",
  Marketing = "Marketing",
  FinanceAndAccounting = "Finance & Accounting",
  Operations = "Operations",
  HumanResources = "Human Resources (HR)",
  InformationTechnology = "Information Technology (IT)",
  CustomerService = "Customer Service",
  ResearchAndDevelopment = "Research & Development (R&D)",
  LegalRiskAndCompliance = "Legal, Risk & Compliance",
  Administration = "Administration",
}

const ALL_DEPARTMENTS = Object.values(Department);

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "Employee" | "Manager" | "Admin";
type Status = "Pending" | "Approved" | "Rejected";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  pointsBalance: number;
  role: Role;
  status: Status;
  rawRole: string;
  rawIsActive: string;
  accountType: string;
  isDeleted: boolean;
  isVerified: boolean;
}

// ─── API mappers ──────────────────────────────────────────────────────────────
const ROLE_TO_DISPLAY: Record<string, Role> = {
  SUPER_ADMIN: "Admin",
  ADMIN: "Admin",
  MANAGER: "Manager",
  USER: "Employee",
};
const ROLE_TO_API: Record<Role, string> = {
  Admin: "ADMIN",
  Manager: "MANAGER",
  Employee: "USER",
};

const STATUS_TO_DISPLAY = (apiStatus: string): Status => {
  if (apiStatus === "APPROVED") return "Approved";
  if (apiStatus === "REJECTED") return "Rejected";
  return "Pending";
};

const STATUS_TO_API: Record<Status, string> = {
  Approved: "APPROVED",
  Rejected: "REJECTED",
  Pending: "PENDING",
};

function mapApiUser(u: any): Employee {
  const rawStatus = u.status ?? "PENDING";
  return {
    id: u._id,
    name: u.name,
    email: u.email,
    department: u.department ?? "—",
    pointsBalance: u.wallet?.pointsBalance ?? 0,
    role: ROLE_TO_DISPLAY[u.role] ?? "Employee",
    status: STATUS_TO_DISPLAY(rawStatus),
    rawRole: u.role,
    rawIsActive: u.isActive,
    accountType: u.accountType ?? "INDIVIDUAL",
    isDeleted: u.isDeleted ?? false,
    isVerified: u.isVerified ?? true,
  };
}

const ROLES: Role[] = ["Employee", "Admin"];
const STATUSES: Status[] = ["Pending", "Approved", "Rejected"];
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

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

function avatarColor(id: string) {
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
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

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({
  status,
  accountType,
  name,
}: {
  status: Status;
  accountType: string;
  name: string;
}) {
  if (accountType === "INDIVIDUAL") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
        <svg
          className="h-3 w-3"
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
        INDIVIDUAL
      </span>
    );
  }

  // ORGANIZATION → show org name + status badge separately
  const statusStyles: Record<Status, string> = {
    Approved: "bg-green-50 text-green-600 border border-green-200",
    Pending: "bg-yellow-50 text-yellow-600 border border-yellow-200",
    Rejected: "bg-red-50 text-red-500 border border-red-200",
  };
  const dots: Record<Status, string> = {
    Approved: "bg-green-500",
    Pending: "bg-yellow-500",
    Rejected: "bg-red-500",
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Org name */}
      <span className="inline-flex max-w-[150px] items-center gap-1.5 truncate rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600">
        <svg
          className="h-3 w-3 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        ORGANIZATION
      </span>
      {/* Status */}
      {/* <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
        {status}
      </span> */}
    </div>
  );
}

// ─── Approve / Reject Buttons ─────────────────────────────────────────────────
function ApproveRejectButtons({
  employee,
  onApprove,
  onReject,
  isApprovLoading,
  isRejectedLoading,
  activeId,
}: {
  employee: Employee;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isApprovLoading: boolean;
  isRejectedLoading: boolean;
  activeId: string | null;
}) {
  // INDIVIDUAL → show N/A badge
  if (employee.accountType === "INDIVIDUAL") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
        Approved
      </span>
    );
  }

  const isThisLoading =
    activeId === employee.id && (isApprovLoading || isRejectedLoading);

  // ORGANIZATION + APPROVED
  if (employee.status === "Approved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-600">
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
        Approved
      </span>
    );
  }

  // ORGANIZATION + REJECTED
  if (employee.status === "Rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500">
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        Rejected
      </span>
    );
  }

  // ORGANIZATION + PENDING → live action buttons
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onApprove(employee.id)}
        disabled={isThisLoading}
        title="Approve organisation"
        className="flex items-center gap-1 rounded-lg bg-green-500 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-green-500/20 transition-all hover:bg-green-600 disabled:opacity-50"
      >
        {isThisLoading && isApprovLoading ? (
          <svg
            className="h-3.5 w-3.5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
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
        ) : (
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        Approve
      </button>

      <button
        onClick={() => onReject(employee.id)}
        disabled={isThisLoading}
        title="Reject organisation"
        className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-500 transition-all hover:bg-red-500 hover:text-white disabled:opacity-50"
      >
        {isThisLoading && isRejectedLoading ? (
          <svg
            className="h-3.5 w-3.5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
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
        ) : (
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
        Reject
      </button>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
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

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({
  employee,
  onClose,
  onConfirm,
  isLoading,
}: {
  employee: Employee;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative mx-auto w-full max-w-md rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center px-6 pb-2 pt-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <svg
              className="h-7 w-7 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Remove Employee</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-gray-800">{employee.name}</span>
            ?<br />
            This action cannot be undone.
          </p>
          <div className="mt-4 flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-left">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(employee.id)}`}
            >
              {getInitials(employee.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-800">
                {employee.name}
              </p>
              <p className="truncate text-xs text-gray-400">{employee.email}</p>
            </div>
            <RoleBadge role={employee.role} />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3 rounded-b-2xl border-t border-gray-100 bg-gray-50/60 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
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
                Removing...
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Yes, Remove
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Employee Modal ───────────────────────────────────────────────────────────
type FormState = {
  name: string;
  email: string;
  department: string;
  role: Role;
  status: Status;
  pointsBalance: number;
};

interface EmployeeModalProps {
  mode: "add" | "edit";
  initial?: Employee;
  onClose: () => void;
  onSave: (data: FormState) => void;
  isSaving?: boolean;
}

function EmployeeModal({
  mode,
  initial,
  onClose,
  onSave,
  isSaving,
}: EmployeeModalProps) {
  // Default department: if initial dept matches an enum value use it, else first enum
  const defaultDept =
    initial?.department &&
    ALL_DEPARTMENTS.includes(initial.department as Department)
      ? initial.department
      : ALL_DEPARTMENTS[0];

  const [form, setForm] = useState<FormState>({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    department: defaultDept,
    role: initial?.role ?? "Employee",
    status: initial?.status ?? "Pending",
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
                <p className="mt-0.5 text-xs text-gray-400">
                  ID #{initial.id.slice(-6)}
                </p>
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
              placeholder="John Doe"
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
            {/* Department — from enum */}
            <Field label="Department">
              <SelectWrapper>
                <select
                  value={form.department}
                  onChange={(e) => set("department", e.target.value)}
                  className={selectCls}
                >
                  {ALL_DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
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

          {/* Status selector only for ORGANIZATION accounts in edit mode */}
          {isEdit && initial?.accountType === "ORGANIZATION" && (
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

          {/* <Field
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
          </Field> */}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-gray-100 bg-gray-50/60 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
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
                Saving...
              </>
            ) : isEdit ? (
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

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 rounded bg-gray-100" />
        </td>
      ))}
    </tr>
  );
}

// ─── Modal state union ────────────────────────────────────────────────────────
type ModalState =
  | { type: "none" }
  | { type: "add" }
  | { type: "edit"; employee: Employee }
  | { type: "delete"; employee: Employee };

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EmployeeDirectory() {
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  // "All" or one of the Department enum values
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [showDeptDrop, setShowDeptDrop] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<keyof Employee>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const {
    data: apiResponse,
    isLoading,
    isFetching,
  } = useGetAllUsersQuery({ page, limit: pageSize });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [approvedUser, { isLoading: isApprovLoading }] =
    useUserApprovedMutation();
  const [rejectedUser, { isLoading: isRejectedLoading }] =
    useUserRejectedMutation();

  const employees: Employee[] = useMemo(() => {
    if (!apiResponse?.data) return [];
    return (apiResponse.data as any[]).map(mapApiUser);
  }, [apiResponse]);

  // ── Department filter: uses ALL_DEPARTMENTS enum values, not API-derived ──
  const filtered = useMemo(() => {
    if (selectedDept === "All") return employees;
    return employees.filter((e) => e.department === selectedDept);
  }, [employees, selectedDept]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const va = String(a[sortField]).toLowerCase();
      const vb = String(b[sortField]).toLowerCase();
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [filtered, sortField, sortDir]);

  const meta = apiResponse?.meta;
  const serverTotal: number = meta?.total ?? employees.length;
  const totalPages = Math.max(1, Math.ceil(serverTotal / pageSize));

  function handleSort(field: keyof Employee) {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  }

  // async function handleEdit(formData: FormState) {
  //   if (modal.type !== "edit") return;
  //   const emp = modal.employee;
  //   try {
  //   const res=  await updateUser({
  //       id: emp.id,
  //       body: {
  //         name: formData.name,
  //         email: formData.email,
  //         department: formData.department,
  //         accountType: emp.accountType,
  //         role: ROLE_TO_API[formData.role],
  //         // isActive: STATUS_TO_API[formData.status],
  //         isDeleted: emp.isDeleted,
  //         isVerified: emp.isVerified,
  //       },
  //     }).unwrap();

  //     if(res.success){
  //       toast
  //     }
  //     setModal({ type: "none" });
  //   } catch (err) {
  //     console.error("Update failed:", err);
  //   }
  // }

  async function handleEdit(formData: FormState) {
    if (modal.type !== "edit") return;

    const emp = modal.employee;

    try {
      const res = await updateUser({
        id: emp.id,
        body: {
          name: formData.name,
          email: formData.email,
          department: formData.department,
          accountType: emp.accountType,
          role: ROLE_TO_API[formData.role],
          // isActive: STATUS_TO_API[formData.status],
          isDeleted: emp.isDeleted,
          isVerified: emp.isVerified,
        },
      }).unwrap();

      if (res?.success) {
        toast.success("Employee updated successfully");
      }

      setModal({ type: "none" });
    } catch (err: any) {
      console.error("Update failed:", err);

      toast.error(err?.data?.message || "Failed to update employee");
    }
  }

  async function handleDeleteConfirm() {
    if (modal.type !== "delete") return;
    try {
      await deleteUser(modal.employee.id).unwrap();
      setModal({ type: "none" });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  async function handleApprove(id: string) {
    setActiveActionId(id);
    try {
      await approvedUser(id).unwrap();
    } catch (err) {
      console.error("Approve failed:", err);
    } finally {
      setActiveActionId(null);
    }
  }

  async function handleReject(id: string) {
    setActiveActionId(id);
    try {
      await rejectedUser(id).unwrap();
    } catch (err) {
      console.error("Reject failed:", err);
    } finally {
      setActiveActionId(null);
    }
  }

  function getPageNumbers() {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, "...", totalPages];
    if (page >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  }

  const loading = isLoading || isFetching;

  return (
    <div
      className="min-h-screen font-sans"
      onClick={() => showDeptDrop && setShowDeptDrop(false)}
    >
      {/* ── Modals ── */}
      {modal.type === "add" && (
        <EmployeeModal
          mode="add"
          onClose={() => setModal({ type: "none" })}
          onSave={() => setModal({ type: "none" })}
        />
      )}
      {modal.type === "edit" && (
        <EmployeeModal
          mode="edit"
          initial={modal.employee}
          onClose={() => setModal({ type: "none" })}
          onSave={handleEdit}
          isSaving={isUpdating}
        />
      )}
      {modal.type === "delete" && (
        <DeleteModal
          employee={modal.employee}
          onClose={() => setModal({ type: "none" })}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
        />
      )}

      <div>
        {/* ── Header ── */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
              Employee Directory
            </h1>

            {/* ── Department filter — driven by enum ── */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowDeptDrop(!showDeptDrop)}
                className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
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
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                  />
                </svg>
                {selectedDept === "All" ? "All Departments" : selectedDept}
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
                <div className="absolute left-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                  <div className="max-h-72 overflow-y-auto">
                    {/* All option */}
                    <button
                      onClick={() => {
                        setSelectedDept("All");
                        setShowDeptDrop(false);
                        setPage(1);
                      }}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                        selectedDept === "All"
                          ? "bg-orange-50 font-semibold text-orange-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {selectedDept === "All" && (
                        <svg
                          className="h-3.5 w-3.5 text-orange-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span className={selectedDept === "All" ? "" : "pl-5"}>
                        All Departments
                      </span>
                    </button>

                    {/* Divider */}
                    <div className="mx-4 border-t border-gray-100" />

                    {/* Enum department options */}
                    {ALL_DEPARTMENTS.map((dept) => (
                      <button
                        key={dept}
                        onClick={() => {
                          setSelectedDept(dept);
                          setShowDeptDrop(false);
                          setPage(1);
                        }}
                        className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                          selectedDept === dept
                            ? "bg-orange-50 font-semibold text-orange-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {selectedDept === dept ? (
                          <svg
                            className="h-3.5 w-3.5 shrink-0 text-orange-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <span className="h-3.5 w-3.5 shrink-0" />
                        )}
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Active filter chip */}
            {selectedDept !== "All" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                {selectedDept}
                <button
                  onClick={() => {
                    setSelectedDept("All");
                    setPage(1);
                  }}
                  className="ml-0.5 rounded-full hover:text-orange-900"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>

        {/* ── Table ── */}
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
                      { label: "Acount Type", field: "status" },
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
                    Approval
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-orange-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : sorted.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-sm text-gray-400"
                    >
                      {selectedDept !== "All" ? (
                        <div className="flex flex-col items-center gap-2">
                          <svg
                            className="h-8 w-8 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>
                            No employees in{" "}
                            <strong className="text-gray-600">
                              {selectedDept}
                            </strong>
                          </span>
                          <button
                            onClick={() => setSelectedDept("All")}
                            className="text-xs text-orange-500 hover:underline"
                          >
                            Clear filter
                          </button>
                        </div>
                      ) : (
                        "No employees found."
                      )}
                    </td>
                  </tr>
                ) : (
                  sorted.map((emp) => (
                    <tr
                      key={emp.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      {/* Name */}
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

                      {/* Email */}
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-500">
                        {emp.email}
                      </td>

                      {/* Department */}
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-700">
                        {emp.department}
                      </td>

                      {/* Points */}
                      <td className="whitespace-nowrap px-4 py-3.5 text-sm font-semibold text-orange-500">
                        {emp.pointsBalance.toLocaleString()} pts
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3.5">
                        <RoleBadge role={emp.role} />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge
                          status={emp.status}
                          accountType={emp.accountType}
                          name={emp.name}
                        />
                      </td>

                      {/* Approval */}
                      <td className="px-4 py-3.5">
                        <ApproveRejectButtons
                          employee={emp}
                          onApprove={handleApprove}
                          onReject={handleReject}
                          isApprovLoading={isApprovLoading}
                          isRejectedLoading={isRejectedLoading}
                          activeId={activeActionId}
                        />
                      </td>

                      {/* Edit / Delete */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
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
                          <button
                            onClick={() =>
                              setModal({ type: "delete", employee: emp })
                            }
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
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
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
                  {serverTotal.toLocaleString()}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
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
                    disabled={loading}
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
                disabled={page === totalPages || loading}
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
