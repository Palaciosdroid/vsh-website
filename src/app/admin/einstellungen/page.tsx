import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Database, Server, Shield } from "lucide-react";

export const metadata = { title: "Einstellungen – VSH Admin" };

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  // Gather system info
  const { count: profileCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: newsCount } = await supabase
    .from("news")
    .select("*", { count: "exact", head: true });

  const { count: eventCount } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true });

  const envVars = [
    { name: "NEXT_PUBLIC_SUPABASE_URL", set: !!process.env.NEXT_PUBLIC_SUPABASE_URL, required: true },
    { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, required: true },
    { name: "NEXT_PUBLIC_MAPBOX_TOKEN", set: !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN, required: false },
    { name: "MAPBOX_SECRET_TOKEN", set: !!process.env.MAPBOX_SECRET_TOKEN, required: false },
    { name: "NEXT_PUBLIC_HCAPTCHA_SITEKEY", set: !!process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY, required: false },
    { name: "HCAPTCHA_SECRET", set: !!process.env.HCAPTCHA_SECRET, required: false },
    { name: "SMTP_HOST", set: !!process.env.SMTP_HOST, required: false },
    { name: "SMTP_USER", set: !!process.env.SMTP_USER, required: false },
    { name: "CRON_SECRET", set: !!process.env.CRON_SECRET, required: false },
    { name: "NEXT_PUBLIC_SITE_URL", set: !!process.env.NEXT_PUBLIC_SITE_URL, required: false },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Einstellungen</h1>
      <p className="mt-2 text-muted-foreground">Systemübersicht und Konfiguration.</p>

      <div className="mt-8 space-y-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Systemstatus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-vsh-blue">{profileCount ?? 0}</p>
                <p className="text-sm text-muted-foreground">Profile</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-vsh-blue">{newsCount ?? 0}</p>
                <p className="text-sm text-muted-foreground">News-Beiträge</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-vsh-blue">{eventCount ?? 0}</p>
                <p className="text-sm text-muted-foreground">Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environment Variables */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Umgebungsvariablen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {envVars.map((v) => (
                <div key={v.name} className="flex items-center justify-between rounded-lg border px-4 py-2">
                  <div className="flex items-center gap-2">
                    <code className="text-sm">{v.name}</code>
                    {v.required && (
                      <Badge variant="outline" className="text-[10px]">Pflicht</Badge>
                    )}
                  </div>
                  <Badge variant={v.set ? "success" : v.required ? "destructive" : "secondary"}>
                    {v.set ? "Konfiguriert" : "Nicht gesetzt"}
                  </Badge>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Umgebungsvariablen werden im Hosting-Dashboard (z.B. Railway) konfiguriert.
            </p>
          </CardContent>
        </Card>

        {/* Database */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Datenbank
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Supabase PostgreSQL mit PostGIS-Extension.</p>
            <p className="mt-2">Migrationen: 00001_initial_schema, 00002_search_functions, 00003_notification_preferences</p>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sicherheit
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Row Level Security (RLS) ist auf allen Tabellen aktiv.</p>
            <p>Admin-Zugriff wird über Middleware und RLS-Policies geprüft.</p>
            <p>hCaptcha-Schutz: {process.env.HCAPTCHA_SECRET ? "Aktiv" : "Nicht konfiguriert"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
