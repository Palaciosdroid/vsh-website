import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { eventReminderEmail } from "@/lib/email-templates";

/**
 * POST /api/admin/send-reminder
 * Manuelles Senden von Erinnerungs-E-Mails an alle registrierten Teilnehmer eines Anlasses.
 * Erfordert Admin-Berechtigung.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Auth prüfen
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Nicht authentifiziert" },
      { status: 401 }
    );
  }

  // Admin-Rolle prüfen
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json(
      { error: "Keine Berechtigung" },
      { status: 403 }
    );
  }

  // Request-Body lesen
  let body: { eventId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Ungültiger Request-Body" },
      { status: 400 }
    );
  }

  const { eventId } = body;

  if (!eventId) {
    return NextResponse.json(
      { error: "eventId ist erforderlich" },
      { status: 400 }
    );
  }

  // Anlass laden
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, title, start_date")
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    return NextResponse.json(
      { error: "Anlass nicht gefunden" },
      { status: 404 }
    );
  }

  // Registrierte Teilnehmer laden
  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("user_id")
    .eq("event_id", event.id)
    .eq("status", "angemeldet");

  if (!registrations?.length) {
    return NextResponse.json({
      success: true,
      sent: 0,
      message: "Keine angemeldeten Teilnehmer gefunden",
    });
  }

  const userIds = registrations.map((r) => r.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("email, first_name, notification_event_reminder")
    .in("id", userIds);

  // Tage bis zum Anlass berechnen
  const now = new Date();
  const eventDate = new Date(event.start_date);
  const daysUntil = Math.max(
    0,
    Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  // E-Mails senden
  let sent = 0;
  let failed = 0;

  for (const profile of profiles ?? []) {
    if (profile.notification_event_reminder === false || !profile.email) {
      continue;
    }

    const html = eventReminderEmail(
      profile.first_name ?? "",
      event.title,
      event.start_date,
      daysUntil
    );

    const success = await sendEmail({
      to: profile.email,
      subject: `Erinnerung: ${event.title}`,
      html,
    });

    if (success) {
      sent++;
    } else {
      failed++;
    }
  }

  return NextResponse.json({
    success: true,
    sent,
    failed,
    total: profiles?.length ?? 0,
    event: event.title,
  });
}
