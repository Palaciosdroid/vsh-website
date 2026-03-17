import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ArrowRight,
  Globe,
  GraduationCap,
  Users,
  Award,
  Shield,
  Calendar,
  FileText,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Mitglied werden",
  description:
    "Werden Sie Mitglied im VSH und profitieren Sie von Sichtbarkeit, Weiterbildung, Qualitätssiegel und einem starken Netzwerk.",
};

const benefits = [
  {
    icon: Globe,
    title: "Online-Therapeutenverzeichnis",
    text: "Professioneller Eintrag mit eigenem Profil, Foto, Spezialisierungen und Standort-Suche für Klienten.",
  },
  {
    icon: Award,
    title: "VSH-Qualitätssiegel",
    text: "Signalisieren Sie Ihren Klienten geprüfte Qualität und Vertrauenswürdigkeit.",
  },
  {
    icon: GraduationCap,
    title: "Weiterbildungsangebote",
    text: "Exklusiver Zugang zu Workshops, Fachvorträgen und anerkannten Weiterbildungskursen.",
  },
  {
    icon: Users,
    title: "Kollegiales Netzwerk",
    text: "Austausch mit Fachkollegen, Stammtische, Supervision und gegenseitige Unterstützung.",
  },
  {
    icon: Shield,
    title: "Interessenvertretung",
    text: "Der Verband vertritt Ihre Interessen gegenüber Politik, Versicherungen und Öffentlichkeit.",
  },
  {
    icon: Calendar,
    title: "Fachveranstaltungen",
    text: "Generalversammlungen, Workshops, Kongresse und gesellige Anlässe.",
  },
];

const requirements = [
  "Abgeschlossene, anerkannte Ausbildung in Hypnosetherapie",
  "Nachweis der aktuellen Praxistätigkeit",
  "Bereitschaft zur regelmässigen Weiterbildung",
  "Einhaltung des VSH-Ethikkodex",
  "Berufshaftpflichtversicherung",
];

const steps = [
  {
    icon: FileText,
    title: "Registrieren & Antrag ausfüllen",
    text: "Erstellen Sie ein Konto und füllen Sie das Aufnahmeformular mit Ihren Angaben und Qualifikationen aus.",
  },
  {
    icon: Shield,
    title: "Prüfung durch den Vorstand",
    text: "Der VSH-Vorstand prüft Ihre Unterlagen und Qualifikationen sorgfältig.",
  },
  {
    icon: Sparkles,
    title: "Willkommen im VSH",
    text: "Nach der Aufnahme wird Ihr Profil freigeschaltet und Sie profitieren von allen Mitglieder-Vorteilen.",
  },
];

export default function MitgliedWerdenPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold-light">
              Mitgliedschaft
            </p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              Mitglied werden im VSH
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/75">
              Werden Sie Teil des Verbands Schweizer Hypnosetherapeuten und
              profitieren Sie von Sichtbarkeit, Qualitätssiegel und einem
              starken Netzwerk.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                className="h-12 rounded-xl bg-vsh-gold hover:bg-vsh-gold-light text-white font-semibold px-8 shadow-lg"
                asChild
              >
                <Link href="/auth/login">
                  Jetzt registrieren <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold">
              Vorteile
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Ihre Vorteile als VSH-Mitglied
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => {
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

      {/* Requirements */}
      <section className="section-cool py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold">
              Aufnahmekriterien
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Voraussetzungen
            </h2>
            <p className="mt-3 text-muted-foreground">
              Für die Aufnahme im VSH benötigen Sie:
            </p>
          </div>
          <div className="mt-10 space-y-3">
            {requirements.map((req) => (
              <div
                key={req}
                className="flex items-start gap-3 rounded-2xl border bg-white p-5"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-vsh-green" />
                <span className="text-foreground">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold">
              In 3 Schritten
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              So werden Sie Mitglied
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-vsh-blue text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="absolute top-7 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] bg-border sm:block" style={{ display: i === steps.length - 1 ? 'none' : undefined }} />
                  <p className="mt-2 text-sm font-medium text-vsh-gold">
                    Schritt {i + 1}
                  </p>
                  <h3 className="mt-1 font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Bereit, Mitglied zu werden?</h2>
          <p className="mt-4 text-white/75">
            Registrieren Sie sich jetzt und reichen Sie Ihren Aufnahmeantrag ein.
            Bei Fragen stehen wir Ihnen gerne zur Verfügung.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-xl bg-vsh-gold hover:bg-vsh-gold-light text-white font-semibold px-8 shadow-lg"
              asChild
            >
              <Link href="/auth/login">
                Jetzt registrieren <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-white/30 text-white hover:bg-white/10"
              asChild
            >
              <Link href="/kontakt">Fragen? Kontakt aufnehmen</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
