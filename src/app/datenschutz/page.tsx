import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung des Verbands Schweizer Hypnosetherapeuten (VSH).",
};

export default function DatenschutzPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold">Datenschutzerklärung</h1>
            <p className="mt-4 text-white/75">
              Informationen zum Schutz Ihrer personenbezogenen Daten.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="prose-vsh mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2>1. Verantwortliche Stelle</h2>
          <p>
            Verantwortlich für die Datenbearbeitung auf dieser Website ist:
          </p>
          <p>
            <strong className="text-foreground">Verband Schweizer Hypnosetherapeuten (VSH)</strong><br />
            Schweiz<br />
            E-Mail: info@v-s-h.ch
          </p>

          <h2>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
          <p>
            Wir erheben personenbezogene Daten nur, wenn Sie uns diese freiwillig
            mitteilen, beispielsweise bei der Registrierung, beim Ausfüllen von
            Kontaktformularen oder bei der Anmeldung zu Veranstaltungen.
          </p>

          <h2>3. Nutzung personenbezogener Daten</h2>
          <p>
            Ihre personenbezogenen Daten werden ausschliesslich für die Zwecke
            verwendet, für die Sie sie uns zur Verfügung gestellt haben:
          </p>
          <ul>
            <li>Verwaltung Ihrer Mitgliedschaft und Ihres Therapeutenprofils</li>
            <li>Beantwortung Ihrer Kontaktanfragen</li>
            <li>Versand von Verbandsinformationen und Veranstaltungshinweisen</li>
            <li>Darstellung Ihres Profils im Therapeutenverzeichnis (nur bei Einwilligung)</li>
          </ul>

          <h2>4. Cookies</h2>
          <p>
            Diese Website verwendet technisch notwendige Cookies, die für den
            Betrieb der Website erforderlich sind (z.B. Session-Cookies für die
            Anmeldung). Es werden keine Marketing- oder Tracking-Cookies eingesetzt.
          </p>

          <h2>5. Datenweitergabe an Dritte</h2>
          <p>
            Ihre Daten werden ohne Ihre ausdrückliche Einwilligung nicht an Dritte
            weitergegeben, es sei denn, wir sind gesetzlich dazu verpflichtet.
          </p>

          <h2>6. Datensicherheit</h2>
          <p>
            Wir setzen technische und organisatorische Sicherheitsmassnahmen ein,
            um Ihre Daten vor Manipulation, Verlust, Zerstörung oder unbefugtem
            Zugriff zu schützen. Unsere Daten werden in sicheren, zertifizierten
            Rechenzentren gespeichert.
          </p>

          <h2>7. Ihre Rechte</h2>
          <p>
            Sie haben jederzeit das Recht auf:
          </p>
          <ul>
            <li>Auskunft über Ihre bei uns gespeicherten Daten</li>
            <li>Berichtigung unrichtiger Daten</li>
            <li>Löschung Ihrer Daten</li>
            <li>Einschränkung der Verarbeitung</li>
            <li>Datenportabilität</li>
            <li>Widerruf einer erteilten Einwilligung</li>
          </ul>

          <h2>8. Hosting</h2>
          <p>
            Diese Website wird bei einem professionellen Hosting-Anbieter betrieben.
            Die Datenbank wird von Supabase gehostet, mit Servern in der EU.
          </p>

          <h2>9. Änderungen dieser Datenschutzerklärung</h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen,
            um sie aktuellen rechtlichen Anforderungen entsprechen zu lassen oder
            Änderungen unserer Leistungen umzusetzen.
          </p>

          <h2>10. Kontakt</h2>
          <p>
            Bei Fragen zum Datenschutz wenden Sie sich bitte an:<br />
            E-Mail: info@v-s-h.ch
          </p>

          <p className="mt-8 text-xs text-muted-foreground/60">
            Stand: März 2026. Diese Datenschutzerklärung sollte rechtlich geprüft werden.
          </p>
        </div>
      </section>
    </div>
  );
}
