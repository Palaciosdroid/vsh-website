"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { TherapistMap } from "@/components/therapeuten/therapist-map";
import { TherapistCard, type TherapistCardData } from "@/components/therapeuten/therapist-card";
import { FilterSidebar, type FilterState } from "@/components/therapeuten/filter-sidebar";
import {
  Search,
  Map,
  List,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Users,
  Loader2,
} from "lucide-react";

const DEFAULT_FILTERS: FilterState = {
  q: "",
  spezialisierung: "",
  sprache: "",
  kanton: "",
  online: false,
  kasse: false,
  sort: "name",
};

const PAGE_SIZE = 20;

function TherapeutenContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>(() => ({
    q: searchParams.get("q") || "",
    spezialisierung: searchParams.get("spezialisierung") || "",
    sprache: searchParams.get("sprache") || "",
    kanton: searchParams.get("kanton") || "",
    online: searchParams.get("online") === "true",
    kasse: searchParams.get("kasse") === "true",
    sort: searchParams.get("sort") || "name",
  }));

  const [therapists, setTherapists] = useState<TherapistCardData[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [center, setCenter] = useState<{ lat: number; lng: number } | undefined>();
  const [view, setView] = useState<"map" | "list">("map");
  const [filterOpen, setFilterOpen] = useState(false);

  // Load specializations
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("specializations")
      .select("name_de")
      .order("sort_order")
      .then(({ data }) => {
        if (data) {
          setSpecializations(data.map((s) => s.name_de));
        }
      });
  }, []);

  const searchTherapists = useCallback(async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.spezialisierung) params.set("spezialisierung", filters.spezialisierung);
    if (filters.sprache) params.set("sprache", filters.sprache);
    if (filters.kanton) params.set("kanton", filters.kanton);
    if (filters.online) params.set("online", "true");
    if (filters.kasse) params.set("kasse", "true");
    if (filters.sort) params.set("sort", filters.sort);
    params.set("page", page.toString());
    params.set("limit", PAGE_SIZE.toString());

    try {
      const res = await fetch(`/api/therapeuten/search?${params}`);
      const data = await res.json();

      setTherapists(data.therapists || []);
      setTotal(data.total || 0);
      if (data.center) {
        setCenter(data.center);
      }
    } catch {
      setTherapists([]);
    }
    setLoading(false);
  }, [filters, page]);

  // Search on mount and when filters/page change
  useEffect(() => {
    searchTherapists();
  }, [searchTherapists]);

  // Update URL params
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.spezialisierung) params.set("spezialisierung", filters.spezialisierung);
    if (filters.sprache) params.set("sprache", filters.sprache);
    if (filters.kanton) params.set("kanton", filters.kanton);
    if (filters.online) params.set("online", "true");
    if (filters.kasse) params.set("kasse", "true");
    if (filters.sort !== "name") params.set("sort", filters.sort);
    if (page > 1) params.set("page", page.toString());

    const qs = params.toString();
    router.replace(`/therapeuten${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [filters, page, router]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  const handleSearch = () => {
    setPage(1);
    searchTherapists();
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    setCenter(undefined);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Top Bar */}
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-foreground">Therapeuten finden</h1>
            {!loading && (
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {total} {total === 1 ? "Ergebnis" : "Ergebnisse"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile filter button */}
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl lg:hidden"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal className="mr-1 h-4 w-4" />
              Filter
            </Button>

            {/* View toggle */}
            <div className="flex rounded-xl border p-0.5">
              <button
                onClick={() => setView("map")}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === "map"
                    ? "bg-vsh-blue text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Map className="h-3.5 w-3.5" />
                Karte
              </button>
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === "list"
                    ? "bg-vsh-blue text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="h-3.5 w-3.5" />
                Liste
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <div className="hidden w-72 shrink-0 border-r bg-white p-5 lg:block">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            specializations={specializations}
            open={true}
            onClose={() => {}}
          />
        </div>

        {/* Mobile Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          onSearch={() => {
            handleSearch();
            setFilterOpen(false);
          }}
          onReset={handleReset}
          specializations={specializations}
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
        />

        {/* Results */}
        <div className="flex-1">
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-vsh-blue" />
            </div>
          ) : therapists.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center px-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Users className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-foreground">
                Keine Therapeuten gefunden
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Versuchen Sie einen anderen Ort oder passen Sie die Filter an.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-xl"
                onClick={handleReset}
              >
                Filter zurücksetzen
              </Button>
            </div>
          ) : (
            <>
              {/* Map View */}
              {view === "map" && (
                <div className="flex h-[calc(100vh-8rem)] flex-col lg:flex-row">
                  <div className="flex-1">
                    <TherapistMap
                      therapists={therapists.filter(
                        (t) => t.latitude && t.longitude
                      ) as any}
                      center={center}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="h-80 overflow-y-auto border-t p-4 lg:h-auto lg:w-96 lg:border-l lg:border-t-0">
                    <div className="space-y-3">
                      {therapists.map((t) => (
                        <TherapistCard key={t.id} therapist={t} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* List View */}
              {view === "list" && (
                <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
                  <div className="space-y-3">
                    {therapists.map((t) => (
                      <TherapistCard key={t.id} therapist={t} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Seite {page} von {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TherapeutenPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-vsh-blue" />
        </div>
      }
    >
      <TherapeutenContent />
    </Suspense>
  );
}
