import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Target,
  Eye,
  Handshake,
  GraduationCap,
  Shield,
  Users,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Über den Verband",
  description:
    "Der Verband Schweizer Hypnosetherapeuten (VSH) setzt sich für Qualitätssicherung und Professionalisierung der Hypnosetherapie in der Schweiz ein.",
};

const values = [
  {
    icon: Shield,
    title: "Qualitätssicherung",
    text: "Strenge Aufnahmekriterien und regelmässige Überprüfung der Mitgliederqualifikationen.",
  },
  {
    icon: GraduationCap,
    title: "Weiterbildung",
    text: "Kontinuierliche Fortbildungsprogramme für unsere Mitglieder auf höchstem Niveau.",
  },
  {
    icon: Handshake,
    title: "Vernetzung",
    text: "Kollegialer Austausch, Stammtische und Fachveranstaltungen für alle Mitglieder.",
  },
  {
    icon: Eye,
    title: "Sichtbarkeit",
    text: "Öffentliches Therapeuten-Verzeichnis mit professionellem Profil für jedes Mitglied.",
  },
  {
    icon: Target,
    title: "Interessenvertretung",
    text: "Wir vertreten die Interessen der Hypnosetherapeuten gegenüber Politik und Gesellschaft.",
  },
  {
    icon: Users,
    title: "Gemeinschaft",
    text: "Eine starke Gemeinschaft, die sich gegenseitig unterstützt und voneinander lernt.",
  },
];

export default function UeberUnsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold-light">
              Über uns
            </p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              Verband Schweizer Hypnosetherapeuten
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/75">
              Seit unserer Gründung setzen wir uns für die Qualitätssicherung und
              Professionalisierung der Hypnosetherapie in der Schweiz ein.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold">
                Unsere Mission
              </p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">
                Hypnosetherapie professionell vertreten
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Wir fördern die Anerkennung der Hypnosetherapie als wirksame
                Behandlungsmethode und setzen uns für hohe Ausbildungsstandards ein.
                Unser Ziel ist es, Menschen den Zugang zu qualifizierter
                Hypnosetherapie zu erleichtern.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Der VSH wurde gegründet, um Hypnosetherapeuten in der Schweiz eine
                gemeinsame Plattform zu bieten — für Vernetzung, Weiterbildung und
                die gemeinsame Interessenvertretung.
              </p>
            </div>
            <div className="rounded-2xl border bg-gradient-to-br from-vsh-blue/5 to-vsh-green/5 p-8">
              <blockquote className="text-lg font-medium italic text-foreground">
                «Wir glauben daran, dass Hypnosetherapie — fachgerecht angewandt —
                Menschen nachhaltig helfen kann, positive Veränderungen in ihrem
                Leben zu bewirken.»
              </blockquote>
              <p className="mt-4 text-sm text-muted-foreground">— VSH Vorstand</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="section-cool py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold">
              Was uns ausmacht
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Unsere Werte & Leistungen
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="card-hover rounded-2xl border bg-white p-6"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-vsh-blue/5 text-vsh-blue">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold">
              Geschichte
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">Unser Weg</h2>
          </div>
          <div className="mt-12 space-y-8">
            {[
              {
                title: "Gründung des VSH",
                text: "Der Verband Schweizer Hypnosetherapeuten wird ins Leben gerufen, um die Interessen der Hypnosetherapeuten in der Schweiz zu bündeln.",
              },
              {
                title: "Aufbau des Netzwerks",
                text: "Erste Weiterbildungsangebote, Stammtische und Fachveranstaltungen werden organisiert. Das Netzwerk wächst stetig.",
              },
              {
                title: "Digitalisierung",
                text: "Launch des Online-Therapeutenverzeichnisses — Klienten können nun einfach qualifizierte Therapeuten in ihrer Nähe finden.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-vsh-blue text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  {i < 2 && <div className="flex-1 w-px bg-border mt-2" />}
                </div>
                <div className="pb-8">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-warm py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground">
            Werden Sie Teil unserer Gemeinschaft
          </h2>
          <p className="mt-3 text-muted-foreground">
            Treten Sie dem VSH bei und profitieren Sie von einem starken Netzwerk,
            Weiterbildungsmöglichkeiten und mehr.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button className="rounded-xl bg-vsh-blue hover:bg-vsh-blue-light" asChild>
              <Link href="/mitglied-werden">
                Mitglied werden <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="rounded-xl" asChild>
              <Link href="/kontakt">Kontakt aufnehmen</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
