import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
    }

    const { eventId, action } = await request.json();

    if (!eventId) {
      return NextResponse.json({ error: "Event-ID fehlt" }, { status: 400 });
    }

    if (action === "cancel") {
      const { error } = await supabase
        .from("event_registrations")
        .update({ status: "abgesagt" })
        .eq("event_id", eventId)
        .eq("user_id", user.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ status: "abgesagt" });
    }

    // Check event details
    const { data: event } = await supabase
      .from("events")
      .select("id, max_participants, registration_deadline, is_published")
      .eq("id", eventId)
      .single();

    if (!event || !event.is_published) {
      return NextResponse.json({ error: "Event nicht gefunden" }, { status: 404 });
    }

    // Check deadline
    if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) {
      return NextResponse.json({ error: "Anmeldefrist abgelaufen" }, { status: 400 });
    }

    // Determine status (angemeldet or warteliste)
    let status: "angemeldet" | "warteliste" = "angemeldet";

    if (event.max_participants) {
      const { count } = await supabase
        .from("event_registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId)
        .eq("status", "angemeldet");

      if ((count ?? 0) >= event.max_participants) {
        status = "warteliste";
      }
    }

    // Check for existing registration
    const { data: existing } = await supabase
      .from("event_registrations")
      .select("id, status")
      .eq("event_id", eventId)
      .eq("user_id", user.id)
      .single();

    if (existing) {
      // Re-register if previously cancelled
      if (existing.status === "abgesagt") {
        const { error } = await supabase
          .from("event_registrations")
          .update({ status, registered_at: new Date().toISOString() })
          .eq("id", existing.id);

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ status });
      }

      return NextResponse.json({ error: "Bereits angemeldet", status: existing.status }, { status: 409 });
    }

    const { error } = await supabase
      .from("event_registrations")
      .insert({ event_id: eventId, user_id: user.id, status });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status });
  } catch {
    return NextResponse.json({ error: "Anmeldung fehlgeschlagen" }, { status: 500 });
  }
}
