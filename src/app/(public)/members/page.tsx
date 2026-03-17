export const metadata = { title: "Mitglieder" };

export default function MembersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Mitgliederverzeichnis</h1>
      <p className="mt-2 text-muted-foreground">
        Öffentliche Profile unserer Mitglieder.
      </p>
      <div className="mt-8 text-muted-foreground">
        Noch keine öffentlichen Profile vorhanden.
      </div>
    </div>
  );
}
