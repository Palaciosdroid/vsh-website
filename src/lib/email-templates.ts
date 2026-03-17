/**
 * HTML-E-Mail-Vorlagen für VSH Website
 *
 * Alle Vorlagen verwenden Inline-CSS für maximale E-Mail-Client-Kompatibilität.
 * Markenfarben: #1B4F72 (Blau), #B9965A (Gold)
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://v-s-h.ch";

const BRAND_BLUE = "#1B4F72";
const BRAND_GOLD = "#B9965A";

function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VSH</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND_BLUE};padding:28px 32px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:3px;">VSH</h1>
              <p style="margin:6px 0 0;font-size:12px;color:${BRAND_GOLD};letter-spacing:1px;text-transform:uppercase;">Verband Schweizer Hypnosetherapeuten</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f8f8f8;padding:24px 32px;border-top:1px solid #e8e8e8;">
              <p style="margin:0 0 8px;font-size:13px;color:#666;text-align:center;">
                Verband Schweizer Hypnosetherapeuten (VSH)
              </p>
              <p style="margin:0 0 8px;font-size:12px;color:#999;text-align:center;">
                <a href="${SITE_URL}" style="color:${BRAND_BLUE};text-decoration:none;">${SITE_URL.replace("https://", "")}</a>
              </p>
              <p style="margin:0;font-size:11px;color:#aaa;text-align:center;">
                Sie erhalten diese E-Mail als Mitglied des VSH.
                Um Ihre Benachrichtigungseinstellungen zu ändern, besuchen Sie Ihr
                <a href="${SITE_URL}/dashboard/einstellungen" style="color:${BRAND_GOLD};text-decoration:none;">Profil</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(text: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr>
    <td style="background-color:${BRAND_BLUE};border-radius:6px;">
      <a href="${href}" style="display:inline-block;padding:12px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.5px;">${text}</a>
    </td>
  </tr>
</table>`;
}

/**
 * Willkommens-E-Mail nach der Registrierung
 */
export function welcomeEmail(firstName: string): string {
  return emailLayout(`
    <h2 style="margin:0 0 16px;font-size:22px;color:${BRAND_BLUE};">Willkommen beim VSH, ${firstName}!</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
      Vielen Dank für Ihre Registrierung beim Verband Schweizer Hypnosetherapeuten.
      Wir freuen uns, Sie in unserer Gemeinschaft begrüssen zu dürfen.
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
      Als nächsten Schritt können Sie Ihr Therapeutenprofil vervollständigen.
      Nach der Prüfung durch unsere Administration wird Ihr Profil im
      Therapeutenverzeichnis veröffentlicht.
    </p>
    ${button("Profil vervollständigen", `${SITE_URL}/dashboard/profil`)}
    <p style="margin:0;font-size:14px;color:#666;line-height:1.5;">
      Bei Fragen stehen wir Ihnen gerne zur Verfügung.
    </p>
  `);
}

/**
 * Profil wurde genehmigt
 */
export function profileApprovedEmail(
  firstName: string,
  slug: string
): string {
  const profileUrl = `${SITE_URL}/therapeuten/${slug}`;

  return emailLayout(`
    <h2 style="margin:0 0 16px;font-size:22px;color:${BRAND_BLUE};">Ihr Profil wurde freigegeben</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
      Guten Tag ${firstName},
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
      Wir freuen uns, Ihnen mitteilen zu können, dass Ihr Therapeutenprofil geprüft
      und freigegeben wurde. Ihr Profil ist ab sofort im Therapeutenverzeichnis
      des VSH sichtbar.
    </p>
    ${button("Mein Profil ansehen", profileUrl)}
    <p style="margin:0;font-size:14px;color:#666;line-height:1.5;">
      Sie können Ihr Profil jederzeit in Ihrem Dashboard bearbeiten.
      Änderungen werden nach erneuter Prüfung freigeschaltet.
    </p>
  `);
}

/**
 * Profil wurde abgelehnt
 */
export function profileRejectedEmail(firstName: string): string {
  return emailLayout(`
    <h2 style="margin:0 0 16px;font-size:22px;color:${BRAND_BLUE};">Profil-Überprüfung</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
      Guten Tag ${firstName},
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
      Leider konnte Ihr Therapeutenprofil in der aktuellen Form nicht freigegeben werden.
      Bitte überprüfen Sie Ihre Angaben und stellen Sie sicher, dass alle erforderlichen
      Informationen vollständig und korrekt sind.
    </p>
    ${button("Profil bearbeiten", `${SITE_URL}/dashboard/profil`)}
    <p style="margin:0;font-size:14px;color:#666;line-height:1.5;">
      Bei Fragen wenden Sie sich bitte an unsere Administration.
    </p>
  `);
}

/**
 * Neue Kontaktanfrage erhalten
 */
export function newContactRequestEmail(
  firstName: string,
  senderName: string,
  message: string
): string {
  return emailLayout(`
    <h2 style="margin:0 0 16px;font-size:22px;color:${BRAND_BLUE};">Neue Kontaktanfrage</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
      Guten Tag ${firstName},
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
      Sie haben eine neue Kontaktanfrage über Ihr VSH-Therapeutenprofil erhalten.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background-color:#f8f9fa;border-left:4px solid ${BRAND_GOLD};border-radius:0 6px 6px 0;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 8px;font-size:14px;color:#666;">
            <strong style="color:${BRAND_BLUE};">Von:</strong> ${senderName}
          </p>
          <p style="margin:0;font-size:14px;color:#333;line-height:1.5;white-space:pre-wrap;">${message}</p>
        </td>
      </tr>
    </table>
    ${button("Im Dashboard anzeigen", `${SITE_URL}/dashboard/nachrichten`)}
    <p style="margin:0;font-size:14px;color:#666;line-height:1.5;">
      Bitte antworten Sie zeitnah auf die Anfrage.
    </p>
  `);
}

/**
 * Erinnerung an einen bevorstehenden Anlass
 */
export function eventReminderEmail(
  firstName: string,
  eventTitle: string,
  eventDate: string,
  daysUntil: number
): string {
  const formattedDate = formatDate(eventDate);
  const urgencyText =
    daysUntil <= 1 ? "morgen" : `in ${daysUntil} Tagen`;

  return emailLayout(`
    <h2 style="margin:0 0 16px;font-size:22px;color:${BRAND_BLUE};">Erinnerung: ${eventTitle}</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
      Guten Tag ${firstName},
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
      Wir möchten Sie daran erinnern, dass der folgende Anlass <strong>${urgencyText}</strong> stattfindet:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background-color:#f8f9fa;border-left:4px solid ${BRAND_GOLD};border-radius:0 6px 6px 0;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:17px;font-weight:600;color:${BRAND_BLUE};">${eventTitle}</p>
          <p style="margin:0;font-size:14px;color:#666;">📅 ${formattedDate}</p>
        </td>
      </tr>
    </table>
    ${button("Anlass-Details ansehen", `${SITE_URL}/veranstaltungen`)}
    <p style="margin:0;font-size:14px;color:#666;line-height:1.5;">
      Wir freuen uns auf Ihre Teilnahme!
    </p>
  `);
}

/**
 * Bestätigung der Anlass-Anmeldung
 */
export function eventRegistrationEmail(
  firstName: string,
  eventTitle: string,
  eventDate: string,
  status: string
): string {
  const formattedDate = formatDate(eventDate);
  const isWaitlist = status === "warteliste";

  const statusText = isWaitlist
    ? "Sie wurden auf die <strong>Warteliste</strong> gesetzt. Wir benachrichtigen Sie, sobald ein Platz frei wird."
    : "Ihre Anmeldung wurde <strong>bestätigt</strong>. Sie sind für den Anlass registriert.";

  const statusLabel = isWaitlist ? "Warteliste" : "Angemeldet";
  const statusColor = isWaitlist ? "#e67e22" : "#27ae60";

  return emailLayout(`
    <h2 style="margin:0 0 16px;font-size:22px;color:${BRAND_BLUE};">Anmeldung: ${eventTitle}</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
      Guten Tag ${firstName},
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
      ${statusText}
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background-color:#f8f9fa;border-left:4px solid ${BRAND_GOLD};border-radius:0 6px 6px 0;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:17px;font-weight:600;color:${BRAND_BLUE};">${eventTitle}</p>
          <p style="margin:0 0 4px;font-size:14px;color:#666;">📅 ${formattedDate}</p>
          <p style="margin:0;font-size:14px;">
            <span style="display:inline-block;padding:2px 10px;border-radius:12px;background-color:${statusColor};color:#fff;font-size:12px;font-weight:600;">${statusLabel}</span>
          </p>
        </td>
      </tr>
    </table>
    ${button("Meine Anlässe ansehen", `${SITE_URL}/dashboard/veranstaltungen`)}
    <p style="margin:0;font-size:14px;color:#666;line-height:1.5;">
      Sie können Ihre Anmeldung jederzeit in Ihrem Dashboard verwalten.
    </p>
  `);
}

/**
 * Hilfsfunktion: Datum formatieren (deutsch)
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-CH", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}
