import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum des Verbands Schweizer Hypnosetherapeuten (VSH).",
};

export default function ImpressumPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold">Impressum</h1>
            <p className="mt-4 text-white/75">
              Angaben gemäss Schweizer Recht.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="rounded-2xl border bg-white p-8">
              <h2 className="text-xl font-bold text-foreground">
                Verband Schweizer Hypnosetherapeuten (VSH)
              </h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                <div>
                  <p className="text-sm font-medium text-foreground">Adresse</p>
                  <p className="text-sm">Schweiz</p>
                  <p className="mt-1 text-xs text-muted-foreground/60">
                    (Detaillierte Adresse wird ergänzt)
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">E-Mail</p>
                  <p className="text-sm">info@v-s-h.ch</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Website</p>
                  <p className="text-sm">www.v-s-h.ch</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-8">
              <h2 className="text-xl font-bold text-foreground">
                Vertretungsberechtigte Personen
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Informationen zu vertretungsberechtigten Personen werden ergänzt.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-8">
              <h2 className="text-xl font-bold text-foreground">
                Haftungsausschluss
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Der VSH übernimmt keine Haftung für die Richtigkeit, Vollständigkeit
                  und Aktualität der auf dieser Website bereitgestellten Informationen.
                </p>
                <p>
                  Haftungsansprüche, welche sich auf Schäden materieller oder
                  ideeller Art beziehen, die durch die Nutzung oder Nichtnutzung
                  der dargebotenen Informationen verursacht wurden, sind grundsätzlich
                  ausgeschlossen.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-8">
              <h2 className="text-xl font-bold text-foreground">
                Urheberrecht
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Die auf dieser Website veröffentlichten Inhalte und Werke unterliegen
                dem Schweizer Urheberrecht. Jede Verwertung ausserhalb der Grenzen des
                Urheberrechts bedarf der schriftlichen Zustimmung des VSH.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
