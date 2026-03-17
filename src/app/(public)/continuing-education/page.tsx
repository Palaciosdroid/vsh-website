export const metadata = { title: "Weiterbildung" };

export default function ContinuingEducationPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Weiterbildung</h1>
      <p className="mt-2 text-muted-foreground">
        Akkreditierte Weiterbildungsangebote für Veterinärmediziner.
      </p>
      <div className="mt-8 text-muted-foreground">
        Noch keine Weiterbildungsangebote vorhanden.
      </div>
    </div>
  );
}
