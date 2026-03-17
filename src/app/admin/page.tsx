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
    { title: "Mitglieder", description: "Mitglieder verwalten", href: "/admin/members" },
    { title: "News", description: "Neuigkeiten erstellen und bearbeiten", href: "/admin/news" },
    { title: "Events", description: "Veranstaltungen verwalten", href: "/admin/events" },
    { title: "Weiterbildung", description: "Kurse verwalten", href: "/admin/continuing-education" },
    { title: "Seiten", description: "CMS-Seiten bearbeiten", href: "/admin/pages" },
    { title: "Dokumente", description: "Dateien hochladen und verwalten", href: "/admin/documents" },
    { title: "Kontaktanfragen", description: "Eingegangene Anfragen bearbeiten", href: "/admin/contacts" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Administration</h1>
      <p className="mt-2 text-muted-foreground">
        Verwaltungsbereich für VSH-Administratoren.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="transition-shadow hover:shadow-md">
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
