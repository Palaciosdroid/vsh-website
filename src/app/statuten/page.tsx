export const metadata = { title: "Statuten" };

export default function StatutenPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Verbandsstatuten</h1>
      <p className="mt-4 text-muted-foreground">
        Die aktuellen Statuten des VSH können hier eingesehen und als PDF
        heruntergeladen werden.
      </p>
      <div className="mt-8 rounded-lg border bg-white p-6 text-center text-muted-foreground">
        Statuten-PDF wird hier angezeigt sobald verfügbar.
      </div>
    </div>
  );
}
