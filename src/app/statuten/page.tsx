import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Download, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Statuten",
  description: "Die Statuten des Verbands Schweizer Hypnosetherapeuten (VSH) — unsere Grundlage für Qualität und Professionalität.",
};

export default function StatutenPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold-light">
              Dokumente
            </p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              Verbandsstatuten
            </h1>
            <p className="mt-6 text-lg text-white/75">
              Die Statuten bilden die Grundlage unseres Verbands und definieren
              Zweck, Organisation und Mitgliedschaftsregeln.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Download Card */}
          <div className="rounded-2xl border bg-white p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-vsh-blue/5">
              <FileText className="h-8 w-8 text-vsh-blue" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-foreground">
              VSH Statuten (PDF)
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Die aktuellen Verbandsstatuten können als PDF-Dokument heruntergeladen werden.
            </p>
            <div className="mt-6">
              <Button className="rounded-xl bg-vsh-blue hover:bg-vsh-blue-light" disabled>
                <Download className="mr-2 h-4 w-4" />
                PDF herunterladen (in Kürze verfügbar)
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-12 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-foreground">Zusammenfassung</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Die Statuten regeln die Organisation und Arbeitsweise des VSH. Sie
                definieren unter anderem:
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Zweck des Verbands",
                  text: "Förderung und Professionalisierung der Hypnosetherapie in der Schweiz, Qualitätssicherung und Interessenvertretung.",
                },
                {
                  title: "Mitgliedschaft",
                  text: "Aufnahmekriterien, Rechte und Pflichten der Mitglieder, Mitgliedschaftskategorien und Austrittsregelungen.",
                },
                {
                  title: "Organisation",
                  text: "Organe des Verbands (Generalversammlung, Vorstand), deren Aufgaben und Zuständigkeiten.",
                },
                {
                  title: "Finanzen",
                  text: "Mitgliedsbeiträge, Rechnungswesen und Finanzierung der Verbandsaktivitäten.",
                },
                {
                  title: "Weiterbildungspflicht",
                  text: "Anforderungen an die regelmässige Weiterbildung für den Erhalt der Mitgliedschaft.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border bg-white p-5">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl border bg-vsh-blue/5 p-8 text-center">
            <p className="font-semibold text-foreground">Fragen zu den Statuten?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Kontaktieren Sie uns — wir beantworten Ihre Fragen gerne.
            </p>
            <Button variant="outline" className="mt-4 rounded-xl" asChild>
              <Link href="/kontakt">
                Kontakt aufnehmen <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
