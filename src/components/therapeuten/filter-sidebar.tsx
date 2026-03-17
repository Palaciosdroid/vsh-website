"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, SlidersHorizontal } from "lucide-react";

export interface FilterState {
  q: string;
  spezialisierung: string;
  sprache: string;
  kanton: string;
  online: boolean;
  kasse: boolean;
  sort: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onSearch: () => void;
  onReset: () => void;
  specializations: string[];
  open: boolean;
  onClose: () => void;
}

const kantone = [
  "AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL", "GR",
  "JU", "LU", "NE", "NW", "OW", "SG", "SH", "SO", "SZ", "TG",
  "TI", "UR", "VD", "VS", "ZG", "ZH",
];

const sprachen = [
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "it", label: "Italiano" },
  { value: "en", label: "English" },
];

export function FilterSidebar({
  filters,
  onChange,
  onSearch,
  onReset,
  specializations,
  open,
  onClose,
}: FilterSidebarProps) {
  const update = (key: keyof FilterState, value: string | boolean) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.spezialisierung ||
    filters.sprache ||
    filters.kanton ||
    filters.online ||
    filters.kasse;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-80 transform overflow-y-auto bg-white p-6 shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:w-auto lg:transform-none lg:shadow-none lg:p-0
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Mobile close */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <h2 className="flex items-center gap-2 font-semibold">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search-q" className="text-sm font-medium">Ort / PLZ</Label>
            <div className="flex gap-2">
              <Input
                id="search-q"
                placeholder="z.B. Zürich oder 8001"
                value={filters.q}
                onChange={(e) => update("q", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Specialization */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Spezialisierung</Label>
            <select
              value={filters.spezialisierung}
              onChange={(e) => update("spezialisierung", e.target.value)}
              className="w-full rounded-xl border border-input bg-white px-3 py-2 text-sm"
            >
              <option value="">Alle</option>
              {specializations.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sprache</Label>
            <select
              value={filters.sprache}
              onChange={(e) => update("sprache", e.target.value)}
              className="w-full rounded-xl border border-input bg-white px-3 py-2 text-sm"
            >
              <option value="">Alle</option>
              {sprachen.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Canton */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Kanton</Label>
            <select
              value={filters.kanton}
              onChange={(e) => update("kanton", e.target.value)}
              className="w-full rounded-xl border border-input bg-white px-3 py-2 text-sm"
            >
              <option value="">Alle</option>
              {kantone.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.online}
                onChange={(e) => update("online", e.target.checked)}
                className="h-4 w-4 rounded border-input text-vsh-blue focus:ring-vsh-blue"
              />
              Online-Therapie möglich
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.kasse}
                onChange={(e) => update("kasse", e.target.checked)}
                className="h-4 w-4 rounded border-input text-vsh-blue focus:ring-vsh-blue"
              />
              Krankenkassen-anerkannt
            </label>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sortierung</Label>
            <select
              value={filters.sort}
              onChange={(e) => update("sort", e.target.value)}
              className="w-full rounded-xl border border-input bg-white px-3 py-2 text-sm"
            >
              <option value="name">Name (A–Z)</option>
              <option value="distance">Entfernung</option>
              <option value="newest">Neueste zuerst</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={onSearch}
              className="flex-1 rounded-xl bg-vsh-blue hover:bg-vsh-blue-light"
            >
              Suchen
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onReset}
                className="rounded-xl"
              >
                Zurücksetzen
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
