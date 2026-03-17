export const metadata = { title: "Über uns" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Über uns</h1>
      <div className="mt-6 prose prose-neutral max-w-none">
        <p className="text-muted-foreground">
          Die Vereinigung Schweizer Tierärzte (VSH) ist der führende Berufsverband
          für Veterinärmediziner in der Schweiz. Wir setzen uns für die Interessen
          unserer Mitglieder ein und fördern die veterinärmedizinische Exzellenz
          durch Weiterbildung, Vernetzung und Interessenvertretung.
        </p>
      </div>
    </div>
  );
}
