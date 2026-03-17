import { createClient } from "@/lib/supabase/server";
import { EventsAdmin } from "@/components/admin/events-admin";

export const metadata = { title: "Termine verwalten – VSH Admin" };

export default async function AdminTerminePage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("start_date", { ascending: false });

  // Load registration counts for each event
  const eventsWithCounts = await Promise.all(
    (events ?? []).map(async (event) => {
      const { count } = await supabase
        .from("event_registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id)
        .eq("status", "angemeldet");

      return { ...event, registration_count: count ?? 0 };
    })
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Termine verwalten</h1>
      <p className="mt-2 text-muted-foreground">
        Events erstellen, bearbeiten und Anmeldungen einsehen.
      </p>
      <div className="mt-8">
        <EventsAdmin events={eventsWithCounts} />
      </div>
    </div>
  );
}
