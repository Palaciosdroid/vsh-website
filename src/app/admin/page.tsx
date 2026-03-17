import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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

  const adminSections = [
    { title: "Mitgliederverwaltung", description: "Profile freigeben, sperren, Status ändern", href: "/admin/mitglieder" },
    { title: "News verwalten", description: "Beiträge erstellen, bearbeiten, veröffentlichen", href: "/admin/news" },
    { title: "Termine verwalten", description: "Events erstellen, Anmeldungen einsehen", href: "/admin/termine" },
    { title: "Weiterbildung verwalten", description: "Kurse/Anbieter erfassen und pflegen", href: "/admin/weiterbildung" },
    { title: "Seiten verwalten", description: "Statische Inhalte bearbeiten (CMS)", href: "/admin/seiten" },
    { title: "Einstellungen", description: "Globale Einstellungen, SEO-Defaults", href: "/admin/einstellungen" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Administration</h1>
      <p className="mt-2 text-muted-foreground">
        Verwaltungsbereich für VSH-Administratoren.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
