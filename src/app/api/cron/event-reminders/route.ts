import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { eventReminderEmail } from "@/lib/email-templates";

// Railway cron job endpoint: sends event reminder emails
// Schedule: daily at 08:00 CET
// Protected by CRON_SECRET env var
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const in1Day = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
  const in8Days = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);
  const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  let sent = 0;
  let failed = 0;
  const details: { type: string; event: string; email: string; success: boolean }[] = [];

  // 7-Tage-Erinnerungen
  const { data: events7d } = await supabase
    .from("events")
    .select("id, title, start_date")
    .eq("is_published", true)
    .eq("reminder_sent_7d", false)
    .gte("start_date", in7Days.toISOString())
    .lte("start_date", in8Days.toISOString());

  for (const event of events7d ?? []) {
    const { data: registrations } = await supabase
      .from("event_registrations")
      .select("user_id")
      .eq("event_id", event.id)
      .eq("status", "angemeldet");

    if (registrations?.length) {
      const userIds = registrations.map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("email, first_name, notification_event_reminder")
        .in("id", userIds);

      for (const profile of profiles ?? []) {
        if (profile.notification_event_reminder !== false && profile.email) {
          const html = eventReminderEmail(
            profile.first_name ?? "",
            event.title,
            event.start_date,
            7
          );

          const success = await sendEmail({
            to: profile.email,
            subject: `Erinnerung: ${event.title} in 7 Tagen`,
            html,
          });

          if (success) {
            sent++;
          } else {
            failed++;
          }

          details.push({
            type: "7d",
            event: event.title,
            email: profile.email,
            success,
          });
        }
      }
    }

    // Als gesendet markieren
    await supabase
      .from("events")
      .update({ reminder_sent_7d: true })
      .eq("id", event.id);
  }

  // 1-Tag-Erinnerungen
  const { data: events1d } = await supabase
    .from("events")
    .select("id, title, start_date")
    .eq("is_published", true)
    .eq("reminder_sent_1d", false)
    .gte("start_date", in1Day.toISOString())
    .lte("start_date", in2Days.toISOString());

  for (const event of events1d ?? []) {
    const { data: registrations } = await supabase
      .from("event_registrations")
      .select("user_id")
      .eq("event_id", event.id)
      .eq("status", "angemeldet");

    if (registrations?.length) {
      const userIds = registrations.map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("email, first_name, notification_event_reminder")
        .in("id", userIds);

      for (const profile of profiles ?? []) {
        if (profile.notification_event_reminder !== false && profile.email) {
          const html = eventReminderEmail(
            profile.first_name ?? "",
            event.title,
            event.start_date,
            1
          );

          const success = await sendEmail({
            to: profile.email,
            subject: `Erinnerung: ${event.title} ist morgen`,
            html,
          });

          if (success) {
            sent++;
          } else {
            failed++;
          }

          details.push({
            type: "1d",
            event: event.title,
            email: profile.email,
            success,
          });
        }
      }
    }

    // Als gesendet markieren
    await supabase
      .from("events")
      .update({ reminder_sent_1d: true })
      .eq("id", event.id);
  }

  console.log(
    `[CRON] Anlass-Erinnerungen: ${sent} gesendet, ${failed} fehlgeschlagen`
  );

  return NextResponse.json({
    success: true,
    sent,
    failed,
    total: sent + failed,
    details,
  });
}
