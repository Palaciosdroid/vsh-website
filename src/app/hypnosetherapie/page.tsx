export const metadata = {
  title: "Was ist Hypnosetherapie?",
  description: "Erfahren Sie alles über Hypnosetherapie: Wie sie funktioniert, Anwendungsgebiete, Wirksamkeit und Sicherheit.",
};

export default function HypnosetherapiePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Was ist Hypnosetherapie?</h1>

      <div className="mt-6 space-y-6 text-muted-foreground leading-relaxed">
        <p>
          Hypnosetherapie ist eine wissenschaftlich anerkannte Behandlungsmethode,
          die den natürlichen Zustand der Trance nutzt, um positive Veränderungen
          im Denken, Fühlen und Verhalten zu bewirken.
        </p>

        <h2 className="text-xl font-semibold text-vsh-text">Wie funktioniert Hypnose?</h2>
        <p>
          In der Hypnose wird ein Zustand fokussierter Aufmerksamkeit und tiefer
          Entspannung erreicht. In diesem Zustand ist das Unterbewusstsein besonders
          aufnahmefähig für positive Suggestionen und Veränderungsimpulse.
        </p>

        <h2 className="text-xl font-semibold text-vsh-text">Anwendungsgebiete</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Raucherentwöhnung</li>
          <li>Gewichtsreduktion</li>
          <li>Angst und Phobien</li>
          <li>Schmerztherapie</li>
          <li>Schlafstörungen</li>
          <li>Stressbewältigung</li>
          <li>Prüfungsangst</li>
          <li>Geburtsvorbereitung</li>
          <li>und viele weitere...</li>
        </ul>

        <h2 className="text-xl font-semibold text-vsh-text">Ist Hypnose sicher?</h2>
        <p>
          Ja. Hypnosetherapie, durchgeführt von einem qualifizierten Therapeuten,
          ist eine sichere Behandlungsmethode. Sie behalten jederzeit die Kontrolle
          und können die Hypnose selbst beenden.
        </p>
      </div>
    </div>
  );
}
