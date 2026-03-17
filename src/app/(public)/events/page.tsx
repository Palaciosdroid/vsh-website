export const metadata = { title: "Veranstaltungen" };

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Veranstaltungen</h1>
      <p className="mt-2 text-muted-foreground">
        Kommende Events und Fachtagungen.
      </p>
      <div className="mt-8 text-muted-foreground">
        Noch keine Veranstaltungen geplant.
      </div>
    </div>
  );
}
