import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-vsh-blue py-20 text-white lg:py-32">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Finden Sie Ihren Hypnosetherapeuten
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Der Verband Schweizer Hypnosetherapeuten (VSH) — Ihr Verzeichnis
            für qualifizierte Hypnosetherapie in der Schweiz.
          </p>

          {/* Search CTA */}
          <div className="mx-auto mt-10 flex max-w-md items-center gap-2">
            <input
              type="text"
              placeholder="PLZ oder Ort eingeben..."
              className="h-12 flex-1 rounded-lg border-0 bg-white px-4 text-vsh-text placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-vsh-gold"
            />
            <Button size="lg" className="h-12 bg-vsh-gold hover:bg-vsh-gold/90 text-white" asChild>
              <Link href="/therapeuten">Suchen</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b bg-white py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 px-4 text-center sm:px-6 lg:px-8">
          <div>
            <p className="text-3xl font-bold text-vsh-blue">50+</p>
            <p className="text-sm text-muted-foreground">Mitglieder</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-vsh-blue">15+</p>
            <p className="text-sm text-muted-foreground">Kantone</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-vsh-blue">16</p>
            <p className="text-sm text-muted-foreground">Spezialisierungen</p>
          </div>
        </div>
      </section>

      {/* Specializations Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-vsh-text">
            Beliebte Spezialisierungen
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              "Raucherentwöhnung",
              "Angst & Phobien",
              "Gewichtsreduktion",
              "Schmerztherapie",
              "Schlafstörungen",
              "Stressbewältigung",
              "Prüfungsangst",
              "Kindhypnose",
            ].map((spec) => (
              <Link
                key={spec}
                href={`/therapeuten?spezialisierung=${encodeURIComponent(spec)}`}
                className="rounded-lg border bg-white p-4 text-center text-sm font-medium text-vsh-text transition-shadow hover:shadow-md"
              >
                {spec}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* News Teaser */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-vsh-text">Aktuelles</h2>
            <Button variant="link" asChild>
              <Link href="/news">Alle News &rarr;</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">Neuigkeiten folgen</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Hier erscheinen bald aktuelle Nachrichten des Verbands.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA: Mitglied werden */}
      <section className="bg-vsh-blue py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Mitglied werden</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Profitieren Sie von der Verbandszugehörigkeit: Sichtbarkeit im
            Therapeuten-Verzeichnis, Weiterbildungsangebote, kollegiales Netzwerk
            und mehr.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button size="lg" className="bg-vsh-gold hover:bg-vsh-gold/90 text-white" asChild>
              <Link href="/mitglied-werden">Jetzt Mitglied werden</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/ueber-uns">Mehr erfahren</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
