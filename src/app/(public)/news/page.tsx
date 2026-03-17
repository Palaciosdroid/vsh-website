export const metadata = { title: "Aktuelles" };

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Aktuelles</h1>
      <p className="mt-2 text-muted-foreground">
        Neuigkeiten und aktuelle Informationen.
      </p>
      <div className="mt-8 text-muted-foreground">
        Noch keine Beiträge vorhanden.
      </div>
    </div>
  );
}
