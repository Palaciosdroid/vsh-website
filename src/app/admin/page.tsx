import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserCheck,
  Eye,
  MessageSquare,
  Calendar,
  Newspaper,
  Clock,
  TrendingUp,
} from "lucide-react";

export const metadata = { title: "Admin Dashboard – VSH" };

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch KPI counts in parallel
  const [
    totalMembersRes,
    pendingApprovalsRes,
    publishedProfilesRes,
    contactRequestsRes,
    eventsRes,
    newsRes,
    recentPendingRes,
    recentContactsRes,
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("approval_status", "pending"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("contact_requests")
      .select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("news").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id, first_name, last_name, email, created_at")
      .eq("approval_status", "pending")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("contact_requests")
      .select("id, name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalMembers = totalMembersRes.count ?? 0;
  const pendingApprovals = pendingApprovalsRes.count ?? 0;
  const publishedProfiles = publishedProfilesRes.count ?? 0;
  const contactRequests = contactRequestsRes.count ?? 0;
  const events = eventsRes.count ?? 0;
  const news = newsRes.count ?? 0;
  const recentPending = recentPendingRes.data ?? [];
  const recentContacts = recentContactsRes.data ?? [];

  const stats = [
    {
      label: "Mitglieder gesamt",
      value: totalMembers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Ausstehende Freigaben",
      value: pendingApprovals,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Veröffentlichte Profile",
      value: publishedProfiles,
      icon: Eye,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Kontaktanfragen",
      value: contactRequests,
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Termine",
      value: events,
      icon: Calendar,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "News-Beiträge",
      value: news,
      icon: Newspaper,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
  ];

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-vsh-green" />
        <div>
          <h1 className="text-3xl font-bold text-vsh-text">Dashboard</h1>
          <p className="text-muted-foreground">
            Übersicht aller wichtigen Kennzahlen
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}`}
                >
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent sections */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Recent Pending Profiles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="h-5 w-5 text-yellow-600" />
              Ausstehende Freigaben
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentPending.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Keine ausstehenden Freigaben.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentPending.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {p.first_name} {p.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.email} &middot; {formatDate(p.created_at)}
                      </p>
                    </div>
                    <Link
                      href="/admin/mitglieder"
                      className="text-sm font-medium text-vsh-green hover:underline"
                    >
                      Freigeben
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {pendingApprovals > 5 && (
              <Link
                href="/admin/mitglieder"
                className="mt-4 block text-center text-sm font-medium text-vsh-green hover:underline"
              >
                Alle {pendingApprovals} ausstehenden Freigaben anzeigen
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Recent Contact Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              Letzte Kontaktanfragen
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentContacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Keine Kontaktanfragen vorhanden.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentContacts.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.email}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {formatDate(c.created_at)}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
