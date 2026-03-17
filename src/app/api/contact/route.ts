import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { therapistId, senderName, senderEmail, senderPhone, message, captchaToken } = body;

    if (!therapistId || !senderName || !senderEmail || !message) {
      return NextResponse.json({ error: "Pflichtfelder fehlen." }, { status: 400 });
    }

    // Verify hCaptcha if configured
    if (HCAPTCHA_SECRET && captchaToken) {
      const verifyRes = await fetch("https://api.hcaptcha.com/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `response=${captchaToken}&secret=${HCAPTCHA_SECRET}`,
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        return NextResponse.json({ error: "Captcha-Überprüfung fehlgeschlagen." }, { status: 400 });
      }
    } else if (HCAPTCHA_SECRET && !captchaToken) {
      return NextResponse.json({ error: "Captcha erforderlich." }, { status: 400 });
    }

    const supabase = await createClient();

    // Insert contact request
    const { error: insertError } = await supabase.from("contact_requests").insert({
      therapist_id: therapistId,
      sender_name: senderName,
      sender_email: senderEmail,
      sender_phone: senderPhone || null,
      message,
    });

    if (insertError) {
      return NextResponse.json(
        { error: "Nachricht konnte nicht gesendet werden." },
        { status: 500 }
      );
    }

    // Increment contact_count on profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("contact_count")
      .eq("id", therapistId)
      .single();

    if (profile) {
      await supabase
        .from("profiles")
        .update({ contact_count: (profile.contact_count || 0) + 1 })
        .eq("id", therapistId);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Interner Fehler." }, { status: 500 });
  }
}
