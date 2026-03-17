export const metadata = { title: "Dokumente" };

export default function DocumentsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Dokumente</h1>
      <p className="mt-2 text-muted-foreground">
        Wichtige Dokumente und Downloads.
      </p>
      <div className="mt-8 text-muted-foreground">
        Noch keine Dokumente vorhanden.
      </div>
    </div>
  );
}
