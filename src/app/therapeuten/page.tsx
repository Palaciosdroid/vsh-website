export const metadata = {
  title: "Therapeuten finden",
  description: "Finden Sie qualifizierte Hypnosetherapeuten in Ihrer Nähe. Kartensuche, Filter nach Spezialisierung, Sprache und mehr.",
};

export default function TherapeutenPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Therapeuten finden</h1>
      <p className="mt-2 text-muted-foreground">
        Finden Sie qualifizierte Hypnosetherapeuten in Ihrer Nähe.
      </p>

      {/* Placeholder for map + list view (Phase 3) */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="flex h-96 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
          Karte wird in Phase 3 implementiert (Mapbox GL JS)
        </div>
        <div className="flex h-96 items-center justify-center rounded-lg border bg-white text-muted-foreground">
          Therapeuten-Liste wird in Phase 3 implementiert
        </div>
      </div>
    </div>
  );
}
