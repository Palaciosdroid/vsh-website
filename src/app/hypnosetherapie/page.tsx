import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Cigarette,
  ShieldAlert,
  Heart,
  Moon,
  Sparkles,
  Scale,
  GraduationCap,
  Baby,
  Dumbbell,
  CheckCircle,
  ArrowRight,
  HelpCircle,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Was ist Hypnosetherapie?",
  description:
    "Erfahren Sie alles über Hypnosetherapie: Wie sie funktioniert, Anwendungsgebiete, wissenschaftliche Grundlagen, Wirksamkeit und Sicherheit. Ihr umfassender Ratgeber.",
  keywords: [
    "Hypnosetherapie",
    "Hypnose",
    "Was ist Hypnose",
    "Hypnose Wirkung",
    "Hypnosetherapie Schweiz",
    "Hypnose Anwendungsgebiete",
    "klinische Hypnose",
  ],
};

const applications = [
  { icon: Cigarette, name: "Raucherentwöhnung", text: "Eine der häufigsten und erfolgreichsten Anwendungen der Hypnose." },
  { icon: Scale, name: "Gewichtsreduktion", text: "Essgewohnheiten nachhaltig verändern durch Arbeit mit dem Unterbewusstsein." },
  { icon: ShieldAlert, name: "Angst & Phobien", text: "Ängste und Phobien effektiv und schonend auflösen." },
  { icon: Heart, name: "Schmerztherapie", text: "Chronische Schmerzen lindern und die Schmerzwahrnehmung positiv beeinflussen." },
  { icon: Moon, name: "Schlafstörungen", text: "Zu gesundem, erholsamem Schlaf zurückfinden." },
  { icon: Brain, name: "Stressbewältigung", text: "Tiefe Entspannung erfahren und Stressresistenz aufbauen." },
  { icon: GraduationCap, name: "Prüfungsangst", text: "Prüfungssituationen souverän meistern und Blockaden lösen." },
  { icon: Sparkles, name: "Selbstvertrauen", text: "Das Selbstbewusstsein stärken und innere Ressourcen aktivieren." },
  { icon: Baby, name: "Geburtsvorbereitung", text: "Entspannte, selbstbestimmte Geburt durch HypnoBirthing-Techniken." },
  { icon: Dumbbell, name: "Sporthypnose", text: "Mentale Stärke und Leistungsfähigkeit im Sport optimieren." },
];

const faqs = [
  {
    q: "Kann jeder hypnotisiert werden?",
    a: "Die meisten Menschen können hypnotisiert werden. Die Tiefe der Trance variiert individuell. Entscheidend ist die Bereitschaft und das Vertrauen zum Therapeuten.",
  },
  {
    q: "Verliere ich in Hypnose die Kontrolle?",
    a: "Nein. Sie sind jederzeit bei Bewusstsein, können die Hypnose selbst beenden und nehmen nichts an, was Ihren Werten widerspricht. Bühnenhypnose hat mit therapeutischer Hypnose nichts zu tun.",
  },
  {
    q: "Wie viele Sitzungen brauche ich?",
    a: "Das hängt vom Anliegen ab. Für Raucherentwöhnung reichen oft 1–3 Sitzungen. Bei komplexeren Themen wie Angststörungen können 5–10 Sitzungen sinnvoll sein.",
  },
  {
    q: "Ist Hypnosetherapie wissenschaftlich anerkannt?",
    a: "Ja. Zahlreiche Studien belegen die Wirksamkeit der klinischen Hypnose bei verschiedenen Beschwerden. Die Weltgesundheitsorganisation (WHO) hat Hypnose als Behandlungsmethode anerkannt.",
  },
  {
    q: "Übernimmt die Krankenkasse die Kosten?",
    a: "Die Grundversicherung deckt Hypnosetherapie in der Regel nicht. Viele Zusatzversicherungen erstatten jedoch einen Teil der Kosten, wenn der Therapeut über eine entsprechende Anerkennung verfügt.",
  },
];

export default function HypnosetherapiePage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold-light">
              Ratgeber
            </p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              Was ist Hypnosetherapie?
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/75">
              Ein umfassender Leitfaden über die wissenschaftlich anerkannte
              Behandlungsmethode, die den natürlichen Zustand der Trance nutzt.
            </p>
          </div>
        </div>
      </section>

      {/* Intro / What is it */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vsh-blue/5 text-vsh-blue">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Definition</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Hypnosetherapie (auch: Hypnotherapie) ist eine wissenschaftlich anerkannte
                Behandlungsmethode, die den natürlichen Zustand der Trance nutzt, um
                positive Veränderungen im Denken, Fühlen und Verhalten zu bewirken. Sie
                wird erfolgreich bei einer Vielzahl von psychischen und psychosomatischen
                Beschwerden eingesetzt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-cool py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold">
              Funktionsweise
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Wie funktioniert Hypnose?
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Vorgespräch",
                text: "Im ersten Schritt bespricht der Therapeut Ihr Anliegen, klärt Ihre Ziele und beantwortet alle Fragen zur Hypnose.",
              },
              {
                step: "2",
                title: "Hypnose-Induktion",
                text: "Durch gezielte Entspannungstechniken werden Sie in einen Zustand fokussierter Aufmerksamkeit und tiefer Entspannung geführt.",
              },
              {
                step: "3",
                title: "Therapeutische Arbeit",
                text: "Im Trancezustand ist Ihr Unterbewusstsein besonders aufnahmefähig für positive Suggestionen und Veränderungsimpulse.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="card-hover rounded-2xl border bg-white p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-vsh-blue text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Areas */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold">
              Einsatzgebiete
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Anwendungsgebiete der Hypnosetherapie
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Hypnose wird erfolgreich bei einer Vielzahl von Beschwerden eingesetzt
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {applications.map((app) => {
              const Icon = app.icon;
              return (
                <div
                  key={app.name}
                  className="card-hover group rounded-2xl border bg-white p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-vsh-blue/5 text-vsh-blue transition-colors group-hover:bg-vsh-blue group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-foreground">{app.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {app.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Scientific Evidence */}
      <section className="section-warm py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold">
              Wissenschaft
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Wissenschaftliche Grundlagen
            </h2>
          </div>
          <div className="mt-10 space-y-4">
            {[
              "Zahlreiche klinische Studien belegen die Wirksamkeit der Hypnosetherapie, insbesondere bei Schmerzmanagement, Angststörungen und Verhaltensänderungen.",
              "Die Weltgesundheitsorganisation (WHO) hat Hypnose als Behandlungsmethode anerkannt.",
              "Hirnforschung zeigt: In Hypnose verändern sich messbar die Hirnaktivitäten — die Trance ist ein real messbarer, natürlicher Bewusstseinszustand.",
              "Meta-Analysen bestätigen, dass Hypnotherapie in Kombination mit anderen Therapieformen (z.B. CBT) die Wirksamkeit signifikant steigern kann.",
            ].map((text, i) => (
              <div key={i} className="flex gap-3 rounded-2xl border bg-white p-5">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-vsh-green" />
                <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border-2 border-vsh-green/20 bg-vsh-green/5 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vsh-green/10 text-vsh-green">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Ist Hypnose sicher?
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">Ja.</strong> Hypnosetherapie,
                  durchgeführt von einem qualifizierten Therapeuten, ist eine sichere
                  Behandlungsmethode. Sie behalten jederzeit die volle Kontrolle und
                  können die Hypnose selbst beenden. Die therapeutische Hypnose hat
                  nichts mit Bühnenhypnose zu tun.
                </p>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Es gibt keine Nebenwirkungen bei fachgerechter Anwendung. Wichtig
                  ist die Wahl eines gut ausgebildeten, erfahrenen Therapeuten — genau
                  hier hilft das VSH-Qualitätssiegel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-cool py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold">
              Wissenswert
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Häufige Fragen zur Hypnosetherapie
            </h2>
          </div>
          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border bg-white p-6">
                <div className="flex items-start gap-3">
                  <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-vsh-blue" />
                  <div>
                    <h3 className="font-semibold text-foreground">{faq.q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-gradient py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">
            Finden Sie Ihren Hypnosetherapeuten
          </h2>
          <p className="mt-4 text-white/75">
            Alle VSH-Mitglieder sind geprüfte, qualifizierte Therapeuten.
            Finden Sie den passenden Spezialisten in Ihrer Nähe.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button
              size="lg"
              className="rounded-xl bg-vsh-gold hover:bg-vsh-gold-light text-white font-semibold px-8"
              asChild
            >
              <Link href="/therapeuten">
                Therapeut finden <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl border-white/30 text-white hover:bg-white/10"
              asChild
            >
              <Link href="/faq">Mehr Fragen?</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Was ist Hypnosetherapie?",
            description:
              "Umfassender Ratgeber über Hypnosetherapie: Funktionsweise, Anwendungsgebiete, wissenschaftliche Grundlagen und Sicherheit.",
            author: {
              "@type": "Organization",
              name: "VSH — Verband Schweizer Hypnosetherapeuten",
              url: "https://v-s-h.ch",
            },
            publisher: {
              "@type": "Organization",
              name: "VSH — Verband Schweizer Hypnosetherapeuten",
            },
          }),
        }}
      />
    </div>
  );
}
