import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  MessageSquare,
  Calendar,
  UserCircle,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

export const metadata = { title: "Dashboard – VSH" };

const PROFILE_FIELDS = [
  { key: "first_name", label: "Vorname" },
  { key: "last_name", label: "Nachname" },
  { key: "bio", label: "Biografie" },
  { key: "photo_url", label: "Profilfoto" },
  { key: "phone", label: "Telefonnummer" },
  { key: "website", label: "Website" },
  { key: "street", label: "Strasse" },
  { key: "zip", label: "PLZ" },
  { key: "city", label: "Ort" },
  { key: "canton", label: "Kanton" },
  { key: "specializations", label: "Spezialisierungen" },
  { key: "languages", label: "Sprachen" },
  { key: "certifications", label: "Zertifizierungen" },
] as const;

function computeProfileCompleteness(profile: Record<string, unknown>) {
  const missing: string[] = [];
  let filled = 0;

  for (const field of PROFILE_FIELDS) {
    const value = profile[field.key];
    const isFilled =
      Array.isArray(value) ? value.length > 0 : Boolean(value);
    if (isFilled) {
      filled++;
    } else {
      missing.push(field.label);
    }
  }

  const percentage = Math.round((filled / PROFILE_FIELDS.length) * 100);
  return { percentage, missing };
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "–";
  return new Date(dateString).toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Heute";
  if (diffDays === 1) return "Gestern";
  if (diffDays < 7) return `Vor ${diffDays} Tagen`;
  return formatDate(dateString);
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const [{ data: profile }, { data: recentContacts }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("contact_requests")
      .select("id, sender_name, sender_email, message, created_at, is_read")
      .eq("therapist_id", user.id)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  if (!profile) {
    redirect("/auth/login");
  }

  const { percentage, missing } = computeProfileCompleteness(
    profile as unknown as Record<string, unknown>
  );

  const approvalStatus = profile.approval_status as string | null;
  const isPending = approvalStatus === "pending";
  const isRejected = approvalStatus === "rejected";
  const isApproved = approvalStatus === "approved";

  const stats = [
    {
      label: "Profilaufrufe",
      value: profile.view_count ?? 0,
      icon: Eye,
      color: "text-vsh-blue",
    },
    {
      label: "Kontaktanfragen",
      value: profile.contact_count ?? 0,
      icon: MessageSquare,
      color: "text-vsh-green",
    },
    {
      label: "Mitglied seit",
      value: formatDate(profile.created_at),
      icon: Calendar,
      color: "text-vsh-blue",
    },
    {
      label: "Status",
      value: isApproved
        ? "Freigegeben"
        : isPending
          ? "In Prüfung"
          : isRejected
            ? "Abgelehnt"
            : "Unbekannt",
      icon: isApproved ? CheckCircle2 : isPending ? Clock : AlertCircle,
      color: isApproved
        ? "text-vsh-green"
        : isPending
          ? "text-vsh-gold"
          : "text-destructive",
    },
  ];

  const quickActions = [
    {
      label: "Profil bearbeiten",
      href: "/dashboard/profil",
      icon: UserCircle,
      description: "Ihr öffentliches Therapeuten-Profil verwalten",
    },
    {
      label: "Nachrichten",
      href: "/dashboard/nachrichten",
      icon: MessageSquare,
      description: "Kontaktanfragen von Besuchern einsehen",
    },
    {
      label: "Termine",
      href: "/dashboard/termine",
      icon: Calendar,
      description: "Verbandstermine und Anmeldungen",
    },
    {
      label: "Öffentliches Profil",
      href: profile.slug ? `/therapeuten/${profile.slug}` : "#",
      icon: ExternalLink,
      description: "So sehen Besucher Ihr Profil",
      external: true,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-vsh-text">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Willkommen zurück
          {profile.first_name ? `, ${profile.first_name}` : ""}!
        </p>
      </div>

      {/* Pending / Rejected Notice */}
      {(isPending || isRejected) && (
        <div
          className={`mt-6 flex items-start gap-3 rounded-lg border p-4 ${
            isPending
              ? "border-vsh-gold/30 bg-vsh-gold/5"
              : "border-destructive/30 bg-destructive/5"
          }`}
        >
          {isPending ? (
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-vsh-gold" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          )}
          <div className="text-sm">
            {isPending ? (
              <>
                <p className="font-medium text-vsh-text">
                  Profil wird geprüft
                </p>
                <p className="mt-1 text-muted-foreground">
                  Ihr Profil wird derzeit vom Verband geprüft. Solange es nicht
                  freigeschaltet ist, ist es nicht öffentlich sichtbar. Sie
                  können Ihr Profil in der Zwischenzeit weiter vervollständigen.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-destructive">
                  Profil abgelehnt
                </p>
                <p className="mt-1 text-muted-foreground">
                  Ihr Profil wurde leider abgelehnt. Bitte überprüfen Sie Ihre
                  Angaben und reichen Sie es erneut ein, oder kontaktieren Sie
                  den Verband für weitere Informationen.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Profile Completeness */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Profil-Vollständigkeit
            </CardTitle>
            <span className="text-sm font-medium text-vsh-blue">
              {percentage}%
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={percentage} />
          {missing.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Fehlende Angaben:
              </p>
              <div className="flex flex-wrap gap-2">
                {missing.map((field) => (
                  <Badge
                    key={field}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {field}
                  </Badge>
                ))}
              </div>
              <Button asChild variant="outline" size="sm" className="mt-1">
                <Link href="/dashboard/profil">
                  Profil vervollständigen
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-vsh-green">
              <CheckCircle2 className="h-4 w-4" />
              Ihr Profil ist vollständig – vielen Dank!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-lg bg-muted p-2.5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-semibold text-vsh-text">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-vsh-blue/10 p-2 text-vsh-blue">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-vsh-text">
                    {action.label}
                  </span>
                  {action.external && (
                    <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Contact Requests */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold">
            Neue Kontaktanfragen
          </CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/nachrichten">
              Alle anzeigen
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentContacts && recentContacts.length > 0 ? (
            <div className="divide-y">
              {recentContacts.map((contact) => (
                <div key={contact.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="rounded-full bg-vsh-blue/10 p-2 text-vsh-blue">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-vsh-text">
                        {contact.sender_name || contact.sender_email}
                      </p>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatRelativeDate(contact.created_at)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {contact.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Keine neuen Kontaktanfragen vorhanden.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
