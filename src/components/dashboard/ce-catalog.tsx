"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  Star,
  ExternalLink,
  Clock,
  Banknote,
  GraduationCap,
} from "lucide-react";

interface CEEntry {
  id: string;
  title: string;
  description: string | null;
  provider: string | null;
  provider_url: string | null;
  category: string | null;
  format: string | null;
  duration: string | null;
  cost_info: string | null;
  is_vsh_recognized: boolean;
  is_published: boolean;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  hypnose: "Hypnose",
  coaching: "Coaching",
  psychologie: "Psychologie",
  medizin: "Medizin",
  business: "Business",
  sonstiges: "Sonstiges",
};

const CATEGORY_COLORS: Record<string, string> = {
  hypnose: "bg-purple-100 text-purple-800 border-purple-200",
  coaching: "bg-blue-100 text-blue-800 border-blue-200",
  psychologie: "bg-pink-100 text-pink-800 border-pink-200",
  medizin: "bg-red-100 text-red-800 border-red-200",
  business: "bg-slate-100 text-slate-800 border-slate-200",
  sonstiges: "bg-gray-100 text-gray-800 border-gray-200",
};

const FORMAT_LABELS: Record<string, string> = {
  praesenz: "Präsenz",
  online: "Online",
  hybrid: "Hybrid",
};

const FORMAT_COLORS: Record<string, string> = {
  praesenz: "bg-emerald-100 text-emerald-800 border-emerald-200",
  online: "bg-sky-100 text-sky-800 border-sky-200",
  hybrid: "bg-violet-100 text-violet-800 border-violet-200",
};

export function CECatalog({ entries }: { entries: CEEntry[] }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [formatFilter, setFormatFilter] = useState("");
  const [vshOnly, setVshOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return entries.filter((e) => {
      if (q) {
        const title = (e.title ?? "").toLowerCase();
        const provider = (e.provider ?? "").toLowerCase();
        if (!title.includes(q) && !provider.includes(q)) return false;
      }
      if (categoryFilter && e.category !== categoryFilter) return false;
      if (formatFilter && e.format !== formatFilter) return false;
      if (vshOnly && !e.is_vsh_recognized) return false;
      return true;
    });
  }, [entries, search, categoryFilter, formatFilter, vshOnly]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Titel oder Anbieter suchen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Alle Kategorien</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <Select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
            >
              <option value="">Alle Formate</option>
              {Object.entries(FORMAT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <div className="flex items-center gap-2">
              <Switch checked={vshOnly} onCheckedChange={setVshOnly} />
              <label className="text-sm text-muted-foreground">
                Nur VSH-anerkannt
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <GraduationCap className="h-4 w-4" />
        <span>
          {filtered.length}{" "}
          {filtered.length === 1 ? "Angebot" : "Angebote"} gefunden
        </span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-vsh-text">
              Keine Weiterbildungsangebote vorhanden
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Versuchen Sie, Ihre Filterkriterien anzupassen.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Cards Grid */}
      {filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry) => (
            <Card
              key={entry.id}
              className="flex flex-col transition-shadow hover:shadow-md"
            >
              <CardContent className="flex flex-1 flex-col p-5">
                {/* Header badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {entry.category && (
                    <Badge
                      className={`text-xs ${CATEGORY_COLORS[entry.category] ?? "bg-gray-100 text-gray-800 border-gray-200"}`}
                    >
                      {CATEGORY_LABELS[entry.category] ?? entry.category}
                    </Badge>
                  )}
                  {entry.format && (
                    <Badge
                      className={`text-xs ${FORMAT_COLORS[entry.format] ?? "bg-gray-100 text-gray-800 border-gray-200"}`}
                    >
                      {FORMAT_LABELS[entry.format] ?? entry.format}
                    </Badge>
                  )}
                  {entry.is_vsh_recognized && (
                    <Badge className="border-amber-200 bg-amber-100 text-xs text-amber-800">
                      <Star className="mr-1 h-3 w-3 fill-amber-500 text-amber-500" />
                      VSH-anerkannt
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h3 className="mt-3 text-base font-semibold text-vsh-text">
                  {entry.title}
                </h3>

                {/* Description */}
                {entry.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {entry.description}
                  </p>
                )}

                {/* Meta info */}
                <div className="mt-auto space-y-2 pt-4">
                  {/* Provider */}
                  {entry.provider && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Anbieter: </span>
                      {entry.provider_url ? (
                        <a
                          href={entry.provider_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-vsh-blue hover:underline"
                        >
                          {entry.provider}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-vsh-text">{entry.provider}</span>
                      )}
                    </div>
                  )}

                  {/* Duration */}
                  {entry.duration && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      {entry.duration}
                    </div>
                  )}

                  {/* Cost */}
                  {entry.cost_info && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Banknote className="h-3.5 w-3.5 shrink-0" />
                      {entry.cost_info}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
