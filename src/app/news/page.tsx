export const metadata = { title: "News" };

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Aktuelles</h1>
      <p className="mt-2 text-muted-foreground">
        Neuigkeiten und aktuelle Informationen des Verbands.
      </p>
      <div className="mt-8 rounded-lg border bg-white p-6 text-center text-muted-foreground">
        Noch keine Beiträge vorhanden.
      </div>
    </div>
  );
}
