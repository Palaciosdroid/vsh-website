export const metadata = { title: "Über den Verband" };

export default function UeberUnsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Über den VSH</h1>
      <div className="mt-6 space-y-6 text-muted-foreground leading-relaxed">
        <p>
          Der Verband Schweizer Hypnosetherapeuten (VSH) setzt sich für die
          Qualitätssicherung und Professionalisierung der Hypnosetherapie in der
          Schweiz ein.
        </p>
        <h2 className="text-xl font-semibold text-vsh-text">Mission</h2>
        <p>
          Wir fördern die Anerkennung der Hypnosetherapie als wirksame
          Behandlungsmethode und setzen uns für hohe Ausbildungsstandards ein.
        </p>
        <h2 className="text-xl font-semibold text-vsh-text">Geschichte</h2>
        <p>
          Der VSH wurde gegründet, um Hypnosetherapeuten in der Schweiz eine
          gemeinsame Plattform zu bieten — für Vernetzung, Weiterbildung und
          die gemeinsame Interessenvertretung.
        </p>
      </div>
    </div>
  );
}
