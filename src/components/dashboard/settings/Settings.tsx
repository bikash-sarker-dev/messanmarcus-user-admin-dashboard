"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "general" | "points" | "category" | "branding";

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
  highlightColor: string;
}

interface CategoryImage {
  id: string;
  url: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  images: CategoryImage[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_IMAGES = 5;

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Peer-to-Peer Recognition", images: [] },
  { id: "2", name: "Everyday Appreciation", images: [] },
  { id: "3", name: "Thank You Note", images: [] },
  { id: "4", name: "Employee Accomplishments", images: [] },
  { id: "5", name: "Emerging Leader Recognition", images: [] },
  { id: "6", name: "Manager Excellence", images: [] },
  { id: "7", name: "Employee Milestones", images: [] },
  { id: "8", name: "Employee Welcome", images: [] },
  { id: "9", name: "Special Occasions", images: [] },
];

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
function IconCategory({ active }: { active: boolean }) {
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
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
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
function IconSave() {
  return (
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

// ─── Shared Field Components ──────────────────────────────────────────────────
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

// ─── Global Toast ─────────────────────────────────────────────────────────────
function Toast({
  message,
  type = "success",
  onDone,
}: {
  message: string;
  type?: "success" | "error";
  onDone: () => void;
}) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-gray-900 px-5 py-3 text-white shadow-2xl"
      style={{ animation: "slideUp 0.3s ease" }}
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
      >
        {type === "success" ? (
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
        ) : (
          <svg
            className="h-3.5 w-3.5 text-white"
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
      </span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
          <svg
            className="h-5 w-5 text-red-500"
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
        </div>
        <h3 className="mb-1.5 text-base font-bold text-gray-900">
          Confirm Delete
        </h3>
        <p className="mb-6 text-sm text-gray-500">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Image Lightbox ───────────────────────────────────────────────────────────
function Lightbox({
  img,
  onClose,
  onDelete,
}: {
  img: CategoryImage;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mx-4 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.url}
          alt={img.name}
          className="max-h-[70vh] w-full rounded-2xl object-contain"
        />
        <div className="mt-3 flex items-center justify-between px-1">
          <span className="truncate text-sm text-white/70">{img.name}</span>
          <div className="flex gap-2">
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 rounded-xl bg-red-500/90 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-500"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Image
            </button>
            <button
              onClick={onClose}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Image Thumbnail ──────────────────────────────────────────────────────────
function ImageThumb({
  img,
  onDelete,
  onClick,
}: {
  img: CategoryImage;
  onDelete: (e: React.MouseEvent) => void;
  onClick: () => void;
}) {
  return (
    <div
      className="group relative h-[52px] w-[52px] shrink-0 cursor-pointer overflow-visible rounded-xl border border-gray-100 shadow-sm transition-all hover:scale-105 hover:shadow-md"
      style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
      onClick={onClick}
    >
      <img
        src={img.url}
        alt={img.name}
        className="h-full w-full rounded-xl object-cover"
      />
      <div className="absolute inset-0 rounded-xl bg-black/0 transition-all duration-150 group-hover:bg-black/20" />
      <button
        onClick={onDelete}
        className="absolute -right-1.5 -top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-md transition-opacity duration-150 hover:bg-red-600 group-hover:opacity-100"
        title="Delete image"
      >
        <svg
          className="h-2.5 w-2.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

// ─── Upload Slot ──────────────────────────────────────────────────────────────
function UploadSlot({ onUpload }: { onUpload: (file: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  }
  return (
    <button
      type="button"
      onClick={() => ref.current?.click()}
      className="group flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-orange-400 hover:bg-orange-50"
      title="Upload image"
    >
      <svg
        className="h-5 w-5 text-gray-300 transition-colors group-hover:text-orange-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 4v16m8-8H4"
        />
      </svg>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </button>
  );
}

// ─── Category Row ─────────────────────────────────────────────────────────────
function CategoryRow({
  category,
  onDeleteCategory,
  onAddImage,
  onDeleteImage,
  onImageClick,
}: {
  category: Category;
  onDeleteCategory: () => void;
  onAddImage: (file: File) => void;
  onDeleteImage: (imgId: string) => void;
  onImageClick: (img: CategoryImage) => void;
}) {
  const canUpload = category.images.length < MAX_IMAGES;
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-3.5 shadow-sm transition-shadow hover:shadow-md">
      <button
        onClick={onDeleteCategory}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
        title="Delete category"
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
            strokeWidth={2.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-gray-800">
        {category.name}
      </span>
      <div className="flex shrink-0 items-center gap-2">
        {category.images.map((img) => (
          <ImageThumb
            key={img.id}
            img={img}
            onDelete={(e) => {
              e.stopPropagation();
              onDeleteImage(img.id);
            }}
            onClick={() => onImageClick(img)}
          />
        ))}
        {canUpload && <UploadSlot onUpload={onAddImage} />}
        {!canUpload && (
          <span className="ml-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-600">
            {MAX_IMAGES}/{MAX_IMAGES}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Category Tab ─────────────────────────────────────────────────────────────
function CategoryTab({ onSaved }: { onSaved: (msg: string) => void }) {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState<{
    type: "category" | "image";
    catId: string;
    imgId?: string;
    label: string;
  } | null>(null);
  const [lightbox, setLightbox] = useState<{
    img: CategoryImage;
    catId: string;
  } | null>(null);
  const newNameRef = useRef<HTMLInputElement>(null);

  function commitAdd() {
    const name = newName.trim();
    if (!name) return;
    setCategories((prev) => [
      ...prev,
      { id: Date.now().toString(), name, images: [] },
    ]);
    setNewName("");
    setAdding(false);
    onSaved("Category added");
  }

  function requestDeleteCategory(cat: Category) {
    setConfirm({
      type: "category",
      catId: cat.id,
      label: `Delete "${cat.name}"? All images will be removed.`,
    });
  }

  function requestDeleteImage(catId: string, imgId: string, imgName: string) {
    setConfirm({
      type: "image",
      catId,
      imgId,
      label: `Delete image "${imgName}"?`,
    });
  }

  function handleConfirm() {
    if (!confirm) return;
    if (confirm.type === "category") {
      setCategories((prev) => prev.filter((c) => c.id !== confirm.catId));
      onSaved("Category deleted");
    } else if (confirm.type === "image" && confirm.imgId) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === confirm.catId
            ? { ...c, images: c.images.filter((i) => i.id !== confirm.imgId) }
            : c,
        ),
      );
      if (lightbox && lightbox.img.id === confirm.imgId) setLightbox(null);
      onSaved("Image deleted");
    }
    setConfirm(null);
  }

  function addImage(catId: string, file: File) {
    const url = URL.createObjectURL(file);
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId && c.images.length < MAX_IMAGES
          ? {
              ...c,
              images: [
                ...c.images,
                { id: Date.now().toString(), url, name: file.name },
              ],
            }
          : c,
      ),
    );
    onSaved("Image added");
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    onSaved("Category values updated successfully!");
  }

  return (
    <>
      {confirm && (
        <ConfirmDialog
          message={confirm.label}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
      {lightbox && (
        <Lightbox
          img={lightbox.img}
          onClose={() => setLightbox(null)}
          onDelete={() => {
            const { img, catId } = lightbox;
            setLightbox(null);
            requestDeleteImage(catId, img.id, img.name);
          }}
        />
      )}

      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Category Values</h2>
            <p className="mt-0.5 text-xs text-gray-400">
              {categories.length} categories · up to {MAX_IMAGES} images each
            </p>
          </div>
          <button
            onClick={() => {
              setAdding(true);
              setTimeout(() => newNameRef.current?.focus(), 50);
            }}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-95"
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
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Category
          </button>
        </div>

        {/* Column headers */}
        <div className="flex items-center gap-4 px-5 pb-1">
          <div className="w-7 shrink-0" />
          <span className="min-w-0 flex-1 text-xs font-bold uppercase tracking-wider text-gray-400">
            Category Name
          </span>
          <span className="shrink-0 pr-1 text-xs font-bold uppercase tracking-wider text-gray-400">
            Images
          </span>
        </div>

        {/* New category inline input */}
        {adding && (
          <div
            className="flex items-center gap-3 rounded-2xl border-2 border-orange-400 bg-orange-50/40 px-5 py-3.5"
            style={{ animation: "slideUp 0.2s ease" }}
          >
            <span className="h-7 w-7 shrink-0" />
            <input
              ref={newNameRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitAdd();
                if (e.key === "Escape") {
                  setAdding(false);
                  setNewName("");
                }
              }}
              placeholder="Enter category name…"
              className="flex-1 bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-300"
            />
            <div className="flex shrink-0 gap-2">
              <button
                onClick={commitAdd}
                className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-orange-600"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setAdding(false);
                  setNewName("");
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-500 transition-colors hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Rows */}
        <div className="space-y-2.5">
          {categories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                <svg
                  className="h-6 w-6 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-400">
                No categories yet
              </p>
              <p className="mt-1 text-xs text-gray-300">
                Click "+ Add Category" to get started
              </p>
            </div>
          )}
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              style={{ animation: `slideUp 0.2s ease ${idx * 0.03}s both` }}
            >
              <CategoryRow
                category={cat}
                onDeleteCategory={() => requestDeleteCategory(cat)}
                onAddImage={(file) => addImage(cat.id, file)}
                onDeleteImage={(imgId) => {
                  const img = cat.images.find((i) => i.id === imgId);
                  if (img) requestDeleteImage(cat.id, imgId, img.name);
                }}
                onImageClick={(img) => setLightbox({ img, catId: cat.id })}
              />
            </div>
          ))}
        </div>

        {/* Save */}
        {categories.length > 0 && (
          <div className="flex justify-end pt-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-60"
            >
              <IconSave />
              {saving ? "Saving…" : "Update Changes"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── General Tab ──────────────────────────────────────────────────────────────
function GeneralTab({ onSaved }: { onSaved: (msg: string) => void }) {
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
  async function onSubmit(_data: GeneralForm) {
    await new Promise((r) => setTimeout(r, 600));
    onSaved("General settings saved successfully!");
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
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
                required: "Required",
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
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
          <div>
            <FieldLabel>Old Password</FieldLabel>
            <div className="relative">
              <input
                {...register("oldPassword")}
                type={showOld ? "text" : "password"}
                placeholder="••••••••••"
                className={`${inputNormal} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <IconEye show={showOld} />
              </button>
            </div>
          </div>
          <div>
            <FieldLabel>Enter New Password</FieldLabel>
            <div className="relative">
              <input
                {...register("newPassword", {
                  minLength: { value: 8, message: "Min 8 characters" },
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
          <div>
            <FieldLabel>Confirm New Password</FieldLabel>
            <div className="relative">
              <input
                {...register("confirmPassword", {
                  validate: (v) =>
                    !newPassword ||
                    v === newPassword ||
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
      <div className="mt-10 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600 disabled:opacity-60"
        >
          <IconSave />
          {isSubmitting ? "Saving…" : "Update Changes"}
        </button>
      </div>
    </form>
  );
}

// ─── Points Tab ───────────────────────────────────────────────────────────────
function PointsTab({ onSaved }: { onSaved: (msg: string) => void }) {
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
  async function onSubmit(_data: PointsForm) {
    await new Promise((r) => setTimeout(r, 600));
    onSaved("Points allocation updated!");
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="max-w-xl space-y-8">
        <h2 className="text-lg font-bold text-gray-900">Points Allocation</h2>
        <div>
          <FieldLabel>Quarterly Allocation per Employee</FieldLabel>
          <div className="relative">
            <input
              {...register("quarterlyAllocation", {
                required: "Required",
                min: { value: 1, message: "Min 1" },
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
            Each employee receives this amount at the start of every quarter
          </FieldHint>
        </div>
        <div>
          <FieldLabel>Maximum Points per Recognition</FieldLabel>
          <div className="relative">
            <input
              {...register("maxPointsPerRecognition", {
                required: "Required",
                min: { value: 1, message: "Min 1" },
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
            Max points that can be awarded in a single recognition
          </FieldHint>
        </div>
        <div>
          <FieldLabel>Quarter Reset Date</FieldLabel>
          <input
            {...register("quarterResetDate", { required: "Required" })}
            type="date"
            className={errors.quarterResetDate ? inputError : inputNormal}
          />
          <FieldError message={errors.quarterResetDate?.message} />
          <FieldHint>Next quarter starts on this date</FieldHint>
        </div>
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600 disabled:opacity-60"
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
function BrandingTab({ onSaved }: { onSaved: (msg: string) => void }) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<BrandingForm>({
    defaultValues: { primaryColor: "#f97316", highlightColor: "#f1a455" },
  });
  const primaryColor = watch("primaryColor");
  const highlightColor = watch("highlightColor");

  function handleLogoFile(file: File) {
    setLogoPreview(URL.createObjectURL(file));
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleLogoFile(file);
  }
  async function onSubmit(_data: BrandingForm) {
    await new Promise((r) => setTimeout(r, 600));
    onSaved("Branding preferences saved!");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Controls */}
        <div className="space-y-8">
          <h2 className="text-lg font-bold text-gray-900">Branding</h2>

          <div>
            <FieldLabel>Company Logo</FieldLabel>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => logoInputRef.current?.click()}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${isDragging ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/50"}`}
            >
              {logoPreview ? (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-20 max-w-full object-contain"
                  />
                  <p className="text-xs text-gray-400">Click to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                    <svg
                      className="h-6 w-6 text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Drag and drop your files
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      JPEG, PNG formats, up to 1MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      logoInputRef.current?.click();
                    }}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 transition-colors hover:border-orange-400 hover:text-orange-500"
                  >
                    Select file
                  </button>
                </div>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleLogoFile(f);
                }}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Primary Color</FieldLabel>
            <div className="flex items-center gap-3">
              <input
                {...register("primaryColor")}
                type="color"
                className="h-12 w-24 cursor-pointer rounded-xl border border-gray-200 p-1 outline-none"
              />
              <input
                {...register("primaryColor")}
                type="text"
                className={inputNormal}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Highlight Point Color</FieldLabel>
            <div className="flex items-center gap-3">
              <input
                {...register("highlightColor")}
                type="color"
                className="h-12 w-24 cursor-pointer rounded-xl border border-gray-200 p-1 outline-none"
              />
              <input
                {...register("highlightColor")}
                type="text"
                className={inputNormal}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-colors hover:bg-orange-600 disabled:opacity-60"
            >
              <IconSave />
              {isSubmitting ? "Saving…" : "Update Changes"}
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <h2 className="mb-6 text-lg font-bold text-gray-900">Live Preview</h2>
          <div
            className="overflow-hidden rounded-2xl shadow-lg"
            style={{ background: primaryColor }}
          >
            <div className="px-6 pb-4 pt-6">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="h-8 max-w-[120px] object-contain brightness-0 invert"
                />
              ) : (
                <span className="text-2xl font-black tracking-tight text-white">
                  Greetely
                </span>
              )}
            </div>
            <div className="mx-4 mb-4 rounded-xl bg-white/10 p-5">
              <p className="mb-1 text-xs text-white/70">To:</p>
              <h3 className="text-xl font-bold text-white">Sarah Ahmed</h3>
              <p className="mb-4 text-xs text-white/60">
                Engineering Department
              </p>
              <div className="rounded-lg bg-white/15 p-4">
                <p className="text-sm leading-relaxed text-white">
                  Sarah, your exceptional work on the Q4 project truly
                  exemplifies our core value of Excellence. Your dedication and
                  attention to detail made a significant impact on the team's
                  success. Thank you!
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold text-white"
                  style={{ background: highlightColor + "55" }}
                >
                  Teamwork
                </span>
                <span className="text-sm font-bold text-white">100 Pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

// ─── Main Settings Component ──────────────────────────────────────────────────
export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [toast, setToast] = useState<string | null>(null);

  const tabs: {
    id: Tab;
    label: string;
    short: string;
    icon: (a: boolean) => React.ReactNode;
  }[] = [
    {
      id: "general",
      label: "General",
      short: "General",
      icon: (a) => <IconUser active={a} />,
    },
    {
      id: "points",
      label: "Points Allocation",
      short: "Points",
      icon: (a) => <IconPoints active={a} />,
    },
    {
      id: "category",
      label: "Category",
      short: "Category",
      icon: (a) => <IconCategory active={a} />,
    },
    {
      id: "branding",
      label: "Branding",
      short: "Brand",
      icon: (a) => <IconBranding active={a} />,
    },
  ];

  return (
    <>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div className="">
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}

        <div className="">
          <h1 className="mb-6 text-2xl font-bold text-gray-900 lg:text-3xl">
            Settings
          </h1>

          {/* Tab Bar */}
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
                  }`}
                >
                  {tab.icon(isActive)}
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.short}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            {activeTab === "general" && (
              <GeneralTab onSaved={(m) => setToast(m)} />
            )}
            {activeTab === "points" && (
              <PointsTab onSaved={(m) => setToast(m)} />
            )}
            {activeTab === "category" && (
              <CategoryTab onSaved={(m) => setToast(m)} />
            )}
            {activeTab === "branding" && (
              <BrandingTab onSaved={(m) => setToast(m)} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
