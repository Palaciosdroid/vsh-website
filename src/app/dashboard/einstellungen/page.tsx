import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/dashboard/settings-form";

export const metadata = { title: "Einstellungen – VSH" };

export default async function EinstellungenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "notification_contact_email, notification_event_reminder, notification_news"
    )
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Einstellungen</h1>
      <p className="mt-2 text-muted-foreground">
        Verwalten Sie Ihr Passwort, Ihre E-Mail-Adresse und
        Benachrichtigungseinstellungen.
      </p>

      <div className="mt-8">
        <SettingsForm
          email={user.email ?? ""}
          userId={user.id}
          notificationContactEmail={
            profile?.notification_contact_email ?? true
          }
          notificationEventReminder={
            profile?.notification_event_reminder ?? true
          }
          notificationNews={profile?.notification_news ?? true}
        />
      </div>
    </div>
  );
}
