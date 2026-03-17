"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowRight, HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "Zur Hypnosetherapie",
    questions: [
      {
        q: "Kann jeder hypnotisiert werden?",
        a: "Die meisten Menschen können hypnotisiert werden. Etwa 10–15% der Bevölkerung sind besonders leicht hypnotisierbar, die Mehrheit (ca. 70%) zeigt eine mittlere Hypnotisierbarkeit. Entscheidend sind Ihre Motivation, Offenheit und das Vertrauen zum Therapeuten. Die Tiefe der Trance variiert individuell, ist aber für eine erfolgreiche Therapie nicht entscheidend.",
      },
      {
        q: "Verliere ich in der Hypnose die Kontrolle?",
        a: "Nein, auf keinen Fall. In der therapeutischen Hypnose sind Sie jederzeit bei Bewusstsein und behalten die volle Kontrolle. Sie können die Hypnose jederzeit selbst beenden. Was Sie aus Film und Fernsehen kennen (Bühnenhypnose), hat mit therapeutischer Hypnose nichts zu tun. Sie nehmen in Hypnose nichts an, was Ihren Werten und Überzeugungen widerspricht.",
      },
      {
        q: "Wie viele Sitzungen brauche ich?",
        a: "Das hängt von Ihrem Anliegen ab. Für Raucherentwöhnung reichen oft 1–3 Sitzungen. Bei Angststörungen oder Phobien sind typischerweise 3–6 Sitzungen sinnvoll. Bei komplexeren Themen können 5–10 Sitzungen erforderlich sein. Ihr Therapeut wird Ihnen nach dem Erstgespräch eine individuelle Einschätzung geben.",
      },
      {
        q: "Ist Hypnosetherapie wissenschaftlich anerkannt?",
        a: "Ja. Die Wirksamkeit der klinischen Hypnose ist durch zahlreiche wissenschaftliche Studien belegt. Die Weltgesundheitsorganisation (WHO) hat Hypnose als Behandlungsmethode anerkannt. Moderne Hirnforschung zeigt messbare Veränderungen der Gehirnaktivität während der Hypnose.",
      },
      {
        q: "Ist Hypnose sicher? Gibt es Nebenwirkungen?",
        a: "Hypnosetherapie, durchgeführt von einem qualifizierten Therapeuten, ist eine sehr sichere Behandlungsmethode ohne bekannte Nebenwirkungen. Die Hypnose nutzt einen natürlichen Bewusstseinszustand, den jeder Mensch regelmässig erlebt (z.B. beim Tagträumen oder konzentrierten Lesen). Wichtig ist die Wahl eines gut ausgebildeten Therapeuten.",
      },
      {
        q: "Was passiert, wenn ich aus der Hypnose nicht mehr aufwache?",
        a: "Das ist ein verbreiteter Mythos. Da Hypnose ein natürlicher Bewusstseinszustand ist, «wacht» man immer wieder auf. Im schlimmsten Fall geht die Trance in normalen Schlaf über, aus dem man ganz normal erwacht. Es gibt keinen dokumentierten Fall, in dem jemand in Hypnose «stecken geblieben» ist.",
      },
    ],
  },
  {
    category: "Zum Verband",
    questions: [
      {
        q: "Wie werde ich VSH-Mitglied?",
        a: "Für die Aufnahme im VSH benötigen Sie eine anerkannte Ausbildung in Hypnosetherapie, einen Nachweis Ihrer Praxistätigkeit sowie die Bereitschaft zur regelmässigen Weiterbildung. Registrieren Sie sich auf unserer Website, füllen Sie das Aufnahmeformular aus und reichen Sie Ihre Unterlagen ein. Der Vorstand prüft Ihre Bewerbung und gibt Ihnen zeitnah Rückmeldung.",
      },
      {
        q: "Was kostet die Mitgliedschaft?",
        a: "Die Mitgliedsbeiträge sind abhängig vom Mitgliedschaftstyp (ordentliches Mitglied, Mitglied in Ausbildung). Detaillierte Informationen zu den Beiträgen finden Sie auf der Seite «Mitglied werden» oder kontaktieren Sie uns direkt.",
      },
      {
        q: "Welche Vorteile habe ich als Mitglied?",
        a: "Als VSH-Mitglied profitieren Sie von: einem professionellen Eintrag im Online-Therapeutenverzeichnis, Zugang zu Weiterbildungsangeboten, dem VSH-Qualitätssiegel, kollegialem Austausch, Stammtischen und Fachveranstaltungen, sowie der Interessenvertretung durch den Verband.",
      },
      {
        q: "Übernimmt die Krankenkasse Kosten für Hypnosetherapie?",
        a: "Die Grundversicherung deckt Hypnosetherapie in der Regel nicht. Viele Zusatzversicherungen erstatten jedoch einen Teil der Kosten, wenn der Therapeut über eine entsprechende Anerkennung (z.B. EMR, ASCA) verfügt. Erkundigen Sie sich bei Ihrer Versicherung nach den genauen Bedingungen.",
      },
    ],
  },
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border bg-white transition-shadow hover:shadow-sm">
      <button
        type="button"
        className="flex w-full items-start gap-3 p-5 text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-vsh-blue" />
        <span className="flex-1 font-semibold text-foreground">{question}</span>
        <ChevronDown
          className={`mt-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-5 pb-5 pl-13 text-sm leading-relaxed text-muted-foreground">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold-light">
              Hilfe & Antworten
            </p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              Häufige Fragen (FAQ)
            </h1>
            <p className="mt-6 text-lg text-white/75">
              Antworten auf die wichtigsten Fragen zur Hypnosetherapie und zum
              Verband Schweizer Hypnosetherapeuten.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="mb-4 text-xl font-bold text-foreground">
                  {section.category}
                </h2>
                <div className="space-y-3">
                  {section.questions.map((faq) => (
                    <AccordionItem
                      key={faq.q}
                      question={faq.q}
                      answer={faq.a}
                    />
                  ))}
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
            Ihre Frage war nicht dabei?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Kontaktieren Sie uns — wir helfen Ihnen gerne persönlich weiter.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button className="rounded-xl bg-vsh-blue hover:bg-vsh-blue-light" asChild>
              <Link href="/kontakt">
                Kontakt aufnehmen <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="rounded-xl" asChild>
              <Link href="/hypnosetherapie">Mehr über Hypnose</Link>
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
            "@type": "FAQPage",
            mainEntity: faqs.flatMap((section) =>
              section.questions.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.a,
                },
              }))
            ),
          }),
        }}
      />
    </div>
  );
}
