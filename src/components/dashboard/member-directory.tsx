"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Search,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

interface Member {
  id: string;
  slug: string | null;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  canton: string | null;
  specializations: string[] | null;
  languages: string[] | null;
  membership_type: string | null;
  membership_since: string | null;
}

const MEMBERSHIP_TYPE_LABELS: Record<string, string> = {
  ordentlich: "Ordentlich",
  ehrenmitglied: "Ehrenmitglied",
  in_ausbildung: "In Ausbildung",
};

const MEMBERSHIP_TYPE_COLORS: Record<string, string> = {
  ordentlich: "bg-blue-100 text-blue-800 border-blue-200",
  ehrenmitglied: "bg-amber-100 text-amber-800 border-amber-200",
  in_ausbildung: "bg-green-100 text-green-800 border-green-200",
};

const ITEMS_PER_PAGE = 20;

function getMemberDisplayName(member: Member): string {
  const parts: string[] = [];
  if (member.title) parts.push(member.title);
  if (member.first_name) parts.push(member.first_name);
  if (member.last_name) parts.push(member.last_name);
  return parts.join(" ") || "Unbekannt";
}

function MembershipBadge({ type }: { type: string | null }) {
  if (!type) return null;
  return (
    <Badge
      className={`${MEMBERSHIP_TYPE_COLORS[type] ?? "bg-gray-100 text-gray-800 border-gray-200"} text-xs`}
    >
      {MEMBERSHIP_TYPE_LABELS[type] ?? type}
    </Badge>
  );
}

export function MemberDirectory({ members }: { members: Member[] }) {
  const [search, setSearch] = useState("");
  const [cantonFilter, setCantonFilter] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [page, setPage] = useState(1);

  // Extract unique values for filter dropdowns
  const cantons = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      if (m.canton) set.add(m.canton);
    });
    return Array.from(set).sort();
  }, [members]);

  const specializations = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      m.specializations?.forEach((s) => set.add(s));
    });
    return Array.from(set).sort();
  }, [members]);

  const languages = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      m.languages?.forEach((l) => set.add(l));
    });
    return Array.from(set).sort();
  }, [members]);

  // Filter members
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return members.filter((m) => {
      if (q) {
        const name = getMemberDisplayName(m).toLowerCase();
        const city = (m.city ?? "").toLowerCase();
        const canton = (m.canton ?? "").toLowerCase();
        if (!name.includes(q) && !city.includes(q) && !canton.includes(q)) {
          return false;
        }
      }
      if (cantonFilter && m.canton !== cantonFilter) return false;
      if (
        specializationFilter &&
        !(m.specializations ?? []).includes(specializationFilter)
      )
        return false;
      if (languageFilter && !(m.languages ?? []).includes(languageFilter))
        return false;
      return true;
    });
  }, [members, search, cantonFilter, specializationFilter, languageFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const handleCantonFilter = (value: string) => {
    setCantonFilter(value);
    setPage(1);
  };
  const handleSpecializationFilter = (value: string) => {
    setSpecializationFilter(value);
    setPage(1);
  };
  const handleLanguageFilter = (value: string) => {
    setLanguageFilter(value);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Name, Ort oder Kanton suchen..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={cantonFilter}
              onChange={(e) => handleCantonFilter(e.target.value)}
            >
              <option value="">Alle Kantone</option>
              {cantons.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Select
              value={specializationFilter}
              onChange={(e) => handleSpecializationFilter(e.target.value)}
            >
              <option value="">Alle Spezialisierungen</option>
              {specializations.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <Select
              value={languageFilter}
              onChange={(e) => handleLanguageFilter(e.target.value)}
            >
              <option value="">Alle Sprachen</option>
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>
          {filtered.length}{" "}
          {filtered.length === 1 ? "Mitglied" : "Mitglieder"} gefunden
        </span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-vsh-text">
              Keine Mitglieder gefunden
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Versuchen Sie, Ihre Suchkriterien anzupassen.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Desktop Table */}
      {filtered.length > 0 && (
        <div className="hidden md:block">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Ort / Kanton
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Kontakt
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Spezialisierungen
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Mitgliedschaft
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginated.map((member) => (
                    <tr
                      key={member.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-vsh-text">
                          {getMemberDisplayName(member)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {[member.city, member.canton]
                          .filter(Boolean)
                          .join(", ") || "–"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="inline-flex items-center gap-1 text-vsh-blue hover:underline"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              {member.email}
                            </a>
                          )}
                          {member.phone && (
                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                              <Phone className="h-3.5 w-3.5" />
                              {member.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(member.specializations ?? []).map((s) => (
                            <Badge
                              key={s}
                              variant="secondary"
                              className="text-xs font-normal"
                            >
                              {s}
                            </Badge>
                          ))}
                          {(member.specializations ?? []).length === 0 && (
                            <span className="text-muted-foreground">–</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <MembershipBadge type={member.membership_type} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Mobile Cards */}
      {filtered.length > 0 && (
        <div className="space-y-3 md:hidden">
          {paginated.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-vsh-text">
                    {getMemberDisplayName(member)}
                  </h3>
                  <MembershipBadge type={member.membership_type} />
                </div>

                {(member.city || member.canton) && (
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {[member.city, member.canton].filter(Boolean).join(", ")}
                  </div>
                )}

                <div className="mt-2 space-y-1">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-1.5 text-sm text-vsh-blue hover:underline"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      {member.email}
                    </a>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      {member.phone}
                    </div>
                  )}
                </div>

                {(member.specializations ?? []).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {member.specializations!.map((s) => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Seite {currentPage} von {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Zurück
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Weiter
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
