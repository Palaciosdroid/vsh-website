/**
 * E-Mail-Versand-Utility für VSH Website
 *
 * Verwendet SMTP-Umgebungsvariablen für den Produktionsbetrieb.
 * Im Entwicklungsmodus werden E-Mails in die Konsole geloggt.
 *
 * Benötigte Umgebungsvariablen:
 * - SMTP_HOST: SMTP-Server-Adresse
 * - SMTP_PORT: SMTP-Port (Standard: 587)
 * - SMTP_USER: SMTP-Benutzername
 * - SMTP_PASS: SMTP-Passwort
 * - SMTP_FROM: Absender-Adresse (Standard: noreply@v-s-h.ch)
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sendet eine E-Mail über den konfigurierten SMTP-Server.
 * Wenn kein SMTP konfiguriert ist, wird die E-Mail in die Konsole geloggt.
 *
 * @returns true wenn erfolgreich (oder geloggt), false bei Fehler
 */
export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailParams): Promise<boolean> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT || "587";
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || "noreply@v-s-h.ch";

  // Entwicklungsmodus: E-Mail in Konsole loggen
  if (!smtpHost) {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("[EMAIL DEV] E-Mail wird nicht gesendet (kein SMTP konfiguriert)");
    console.log(`  An:      ${to}`);
    console.log(`  Betreff: ${subject}`);
    console.log(`  Von:     ${smtpFrom}`);
    console.log("  Inhalt:  (HTML-Vorlage, siehe unten)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(html);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    return true;
  }

  try {
    // Produktion: E-Mail via Supabase Edge Function oder externen Dienst senden
    // TODO: Nodemailer-Integration oder externen E-Mail-Dienst anbinden
    //
    // Mögliche Optionen:
    // 1. nodemailer (npm install nodemailer) - SMTP direkt
    // 2. Resend (npm install resend) - API-basiert
    // 3. Supabase Edge Function - serverless
    //
    // Vorläufig: HTTP-Request an konfigurierten SMTP-Relay-Endpunkt
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      // Via Supabase Edge Function "send-email" senden
      const response = await fetch(
        `${supabaseUrl}/functions/v1/send-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            to,
            subject,
            html,
            from: smtpFrom,
            smtp: {
              host: smtpHost,
              port: Number(smtpPort),
              user: smtpUser,
              pass: smtpPass,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `[EMAIL] Fehler beim Senden an ${to}: ${response.status} ${errorText}`
        );
        return false;
      }

      console.log(`[EMAIL] E-Mail erfolgreich gesendet an ${to}: ${subject}`);
      return true;
    }

    // Fallback: Loggen wenn keine Supabase-Konfiguration vorhanden
    console.warn(
      `[EMAIL] SMTP konfiguriert, aber kein Versanddienst verfügbar. E-Mail an ${to} nicht gesendet: ${subject}`
    );
    return false;
  } catch (error) {
    console.error(`[EMAIL] Unerwarteter Fehler beim Senden an ${to}:`, error);
    return false;
  }
}

/**
 * Sendet mehrere E-Mails parallel mit begrenzter Parallelität.
 *
 * @returns Anzahl erfolgreich gesendeter E-Mails
 */
export async function sendEmails(
  emails: SendEmailParams[],
  concurrency = 5
): Promise<number> {
  let sent = 0;

  for (let i = 0; i < emails.length; i += concurrency) {
    const batch = emails.slice(i, i + concurrency);
    const results = await Promise.allSettled(
      batch.map((email) => sendEmail(email))
    );

    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        sent++;
      }
    }
  }

  return sent;
}
