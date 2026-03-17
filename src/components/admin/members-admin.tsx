"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface Profile {
  id: string;
  slug: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  canton: string | null;
  approval_status: string | null;
  is_published: boolean | null;
  membership_type: string | null;
  role: string | null;
  created_at: string;
  deactivated_at: string | null;
}

const PAGE_SIZE = 20;

const statusLabels: Record<string, string> = {
  pending: "Ausstehend",
  approved: "Freigegeben",
  rejected: "Abgelehnt",
};

const statusVariant: Record<string, "warning" | "success" | "destructive"> = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
};

export function MembersAdmin({ profiles }: { profiles: Profile[] }) {
  const router = useRouter();
  const supabase = createClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("alle");
  const [membershipFilter, setMembershipFilter] = useState("alle");
  const [publishedFilter, setPublishedFilter] = useState("alle");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState<string | null>(null);

  // Collect unique membership types for filter
  const membershipTypes = useMemo(() => {
    const types = new Set<string>();
    profiles.forEach((p) => {
      if (p.membership_type) types.add(p.membership_type);
    });
    return Array.from(types).sort();
  }, [profiles]);

  // Filter and search
  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const name = `${p.first_name ?? ""} ${p.last_name ?? ""}`.toLowerCase();
        const email = (p.email ?? "").toLowerCase();
        if (!name.includes(q) && !email.includes(q)) return false;
      }
      // Status
      if (statusFilter !== "alle" && p.approval_status !== statusFilter)
        return false;
      // Membership
      if (
        membershipFilter !== "alle" &&
        p.membership_type !== membershipFilter
      )
        return false;
      // Published
      if (publishedFilter === "ja" && !p.is_published) return false;
      if (publishedFilter === "nein" && p.is_published) return false;

      return true;
    });
  }, [profiles, search, statusFilter, membershipFilter, publishedFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const paged = filtered.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  async function handleApprove(id: string) {
    if (!window.confirm("Profil wirklich freigeben?")) return;
    setLoading(id);
    await supabase
      .from("profiles")
      .update({
        approval_status: "approved",
        approved_at: new Date().toISOString(),
        is_published: true,
      })
      .eq("id", id);
    setLoading(null);
    router.refresh();
  }

  async function handleReject(id: string) {
    if (!window.confirm("Profil wirklich ablehnen?")) return;
    setLoading(id);
    await supabase
      .from("profiles")
      .update({ approval_status: "rejected" })
      .eq("id", id);
    setLoading(null);
    router.refresh();
  }

  async function handleBlock(id: string) {
    if (!window.confirm("Mitglied wirklich sperren?")) return;
    setLoading(id);
    await supabase
      .from("profiles")
      .update({
        deactivated_at: new Date().toISOString(),
        deactivation_reason: "admin_action",
      })
      .eq("id", id);
    setLoading(null);
    router.refresh();
  }

  async function handleUnblock(id: string) {
    setLoading(id);
    await supabase
      .from("profiles")
      .update({ deactivated_at: null })
      .eq("id", id);
    setLoading(null);
    router.refresh();
  }

  async function handleToggleRole(id: string, currentRole: string | null) {
    const newRole = currentRole === "admin" ? "member" : "admin";
    const label =
      newRole === "admin"
        ? "Mitglied zum Admin befördern?"
        : "Admin-Rechte entziehen?";
    if (!window.confirm(label)) return;
    setLoading(id);
    await supabase.from("profiles").update({ role: newRole }).eq("id", id);
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Suche
            </label>
            <Input
              placeholder="Name oder E-Mail..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Status
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="alle">Alle</option>
              <option value="pending">Ausstehend</option>
              <option value="approved">Freigegeben</option>
              <option value="rejected">Abgelehnt</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Mitgliedschaft
            </label>
            <Select
              value={membershipFilter}
              onChange={(e) => {
                setMembershipFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="alle">Alle</option>
              {membershipTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Veröffentlicht
            </label>
            <Select
              value={publishedFilter}
              onChange={(e) => {
                setPublishedFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="alle">Alle</option>
              <option value="ja">Ja</option>
              <option value="nein">Nein</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Result count */}
      <p className="text-sm text-muted-foreground">
        {filtered.length} Mitglied{filtered.length !== 1 ? "er" : ""} gefunden
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">E-Mail</th>
              <th className="px-4 py-3 text-left font-medium">Kanton</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Mitgliedschaft</th>
              <th className="px-4 py-3 text-left font-medium">Rolle</th>
              <th className="px-4 py-3 text-left font-medium">Erstellt am</th>
              <th className="px-4 py-3 text-left font-medium">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Keine Mitglieder gefunden.
                </td>
              </tr>
            ) : (
              paged.map((p) => {
                const isBlocked = !!p.deactivated_at;
                const isLoading = loading === p.id;

                return (
                  <tr
                    key={p.id}
                    className={`${isBlocked ? "bg-red-50/50 opacity-70" : ""} ${isLoading ? "opacity-50" : ""}`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium">
                      {p.first_name} {p.last_name}
                      {isBlocked && (
                        <Badge variant="destructive" className="ml-2">
                          Gesperrt
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">{p.email}</td>
                    <td className="px-4 py-3">{p.canton ?? "–"}</td>
                    <td className="px-4 py-3">
                      {p.approval_status && (
                        <Badge
                          variant={
                            statusVariant[p.approval_status] ?? "secondary"
                          }
                        >
                          {statusLabels[p.approval_status] ??
                            p.approval_status}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">{p.membership_type ?? "–"}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          p.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {p.role === "admin" ? "Admin" : "Mitglied"}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.approval_status === "pending" && (
                          <Button
                            size="sm"
                            variant="default"
                            disabled={isLoading}
                            onClick={() => handleApprove(p.id)}
                          >
                            Freigeben
                          </Button>
                        )}
                        {p.approval_status === "pending" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={isLoading}
                            onClick={() => handleReject(p.id)}
                          >
                            Ablehnen
                          </Button>
                        )}
                        {!isBlocked ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => handleBlock(p.id)}
                          >
                            Sperren
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => handleUnblock(p.id)}
                          >
                            Entsperren
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isLoading}
                          onClick={() => handleToggleRole(p.id, p.role)}
                        >
                          {p.role === "admin" ? "Admin entziehen" : "Zum Admin"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Seite {currentPage + 1} von {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Zurück
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages - 1}
              onClick={() =>
                setPage((p) => Math.min(totalPages - 1, p + 1))
              }
            >
              Weiter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
