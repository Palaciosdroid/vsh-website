import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Mitglied werden" };

export default function MitgliedWerdenPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Mitglied werden</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Werden Sie Teil des Verbands Schweizer Hypnosetherapeuten und profitieren
        Sie von zahlreichen Vorteilen.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Voraussetzungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Anerkannte Ausbildung in Hypnosetherapie</p>
            <p>Nachweis der Praxistätigkeit</p>
            <p>Bereitschaft zur regelmässigen Weiterbildung</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ihre Vorteile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Eintrag im Therapeuten-Verzeichnis</p>
            <p>Zugang zu Weiterbildungsangeboten</p>
            <p>Kollegiales Netzwerk</p>
            <p>VSH-Qualitätssiegel</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 text-center">
        <Button size="lg" className="bg-vsh-green hover:bg-vsh-green/90" asChild>
          <Link href="/auth/login">Jetzt registrieren</Link>
        </Button>
      </div>
    </div>
  );
}
