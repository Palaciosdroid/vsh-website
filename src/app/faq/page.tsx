export const metadata = {
  title: "FAQ",
  description: "Häufige Fragen zur Hypnosetherapie und zum Verband Schweizer Hypnosetherapeuten.",
};

export default function FAQPage() {
  const faqs = [
    {
      category: "Zur Hypnosetherapie",
      questions: [
        {
          q: "Kann jeder hypnotisiert werden?",
          a: "Die meisten Menschen können hypnotisiert werden. Die Tiefe der Trance variiert von Person zu Person.",
        },
        {
          q: "Verliere ich die Kontrolle?",
          a: "Nein. Sie sind jederzeit bei Bewusstsein und können die Hypnose selbst beenden.",
        },
        {
          q: "Wie viele Sitzungen brauche ich?",
          a: "Das hängt vom Anliegen ab. Für Raucherentwöhnung reichen oft 1–3 Sitzungen, bei komplexeren Themen können mehr Sitzungen nötig sein.",
        },
      ],
    },
    {
      category: "Zum Verband",
      questions: [
        {
          q: "Wie werde ich VSH-Mitglied?",
          a: "Sie müssen eine anerkannte Ausbildung in Hypnosetherapie nachweisen. Details finden Sie unter «Mitglied werden».",
        },
        {
          q: "Was kostet die Mitgliedschaft?",
          a: "Die Beiträge sind abhängig vom Mitgliedschaftstyp. Details erfahren Sie im Antragsformular.",
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Häufige Fragen (FAQ)</h1>

      <div className="mt-8 space-y-10">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-xl font-semibold text-vsh-blue">{section.category}</h2>
            <div className="mt-4 space-y-4">
              {section.questions.map((faq) => (
                <div key={faq.q} className="rounded-lg border bg-white p-5">
                  <h3 className="font-medium text-vsh-text">{faq.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
