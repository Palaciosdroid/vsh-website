import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const dashboardLinks = [
    { title: "Profil bearbeiten", description: "Ihr öffentliches Therapeuten-Profil verwalten", href: "/dashboard/profil" },
    { title: "Nachrichten", description: "Kontaktanfragen von Besuchern", href: "/dashboard/nachrichten" },
    { title: "Termine", description: "Verbandstermine und Anmeldungen", href: "/dashboard/termine" },
    { title: "Mitglieder", description: "Internes Mitgliederverzeichnis", href: "/dashboard/mitglieder" },
    { title: "Weiterbildung", description: "Anerkannte Weiterbildungsangebote", href: "/dashboard/weiterbildung" },
    { title: "Dokumente", description: "Interne Verbandsdokumente", href: "/dashboard/dokumente" },
    { title: "Einstellungen", description: "Passwort, E-Mail, Benachrichtigungen", href: "/dashboard/einstellungen" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Willkommen zurück{profile?.first_name ? `, ${profile.first_name}` : ""}!
      </p>

      {/* Profile completeness hint */}
      {profile?.approval_status === "pending" && (
        <div className="mt-4 rounded-lg border border-vsh-gold/30 bg-vsh-gold/5 p-4 text-sm text-vsh-text">
          Ihr Profil wird derzeit geprüft. Solange es nicht freigeschaltet ist,
          ist es nicht öffentlich sichtbar.
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Profil-Statistiken</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Profilaufrufe: {profile?.view_count ?? 0}</p>
            <p>Kontaktanfragen: {profile?.contact_count ?? 0}</p>
            <p>Status: {profile?.approval_status ?? "pending"}</p>
          </CardContent>
        </Card>

        {dashboardLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">{link.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
