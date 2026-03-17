import { createClient } from "@/lib/supabase/server";
import { EventsList } from "@/components/dashboard/events-list";

export const metadata = { title: "Termine – VSH" };

export default async function TerminePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Load published events ordered by start_date ascending
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("start_date", { ascending: true });

  // Load user's event registrations
  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("*")
    .eq("user_id", user!.id);

  // Get count of 'angemeldet' registrations per event
  const { data: registrationCounts } = await supabase
    .from("event_registrations")
    .select("event_id")
    .eq("status", "angemeldet");

  // Aggregate counts per event
  const countsMap: Record<string, number> = {};
  if (registrationCounts) {
    for (const reg of registrationCounts) {
      countsMap[reg.event_id] = (countsMap[reg.event_id] || 0) + 1;
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold tracking-tight">Termine</h1>
      <p className="mt-1 text-muted-foreground">
        Veranstaltungen und Events des VSH
      </p>
      <div className="mt-6">
        <EventsList
          events={events ?? []}
          registrations={registrations ?? []}
          registrationCounts={countsMap}
          userId={user!.id}
        />
      </div>
    </div>
  );
}
