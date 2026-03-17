import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="py-20 text-center lg:py-32">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Vereinigung Schweizer Tierärzte
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Ihr Berufsverband für veterinärmedizinische Exzellenz in der Schweiz.
          Wir fördern Weiterbildung, Vernetzung und die Interessen unserer Mitglieder.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/about">Mehr erfahren</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">Kontakt aufnehmen</Link>
          </Button>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Aktuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Bleiben Sie informiert über die neuesten Nachrichten und Entwicklungen
              im Veterinärbereich.
            </p>
            <Button variant="link" className="mt-4 px-0" asChild>
              <Link href="/news">Zu den News &rarr;</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Veranstaltungen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Entdecken Sie kommende Events, Kongresse und Fachtagungen
              für Veterinärmediziner.
            </p>
            <Button variant="link" className="mt-4 px-0" asChild>
              <Link href="/events">Zu den Events &rarr;</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weiterbildung</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Vertiefen Sie Ihre Kenntnisse mit unseren akkreditierten
              Weiterbildungsangeboten.
            </p>
            <Button variant="link" className="mt-4 px-0" asChild>
              <Link href="/continuing-education">Zur Weiterbildung &rarr;</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
