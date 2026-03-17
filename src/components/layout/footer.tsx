import Link from "next/link";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";

const footerLinks = {
  verband: [
    { name: "Über uns", href: "/ueber-uns" },
    { name: "Statuten", href: "/statuten" },
    { name: "Mitglied werden", href: "/mitglied-werden" },
    { name: "Kontakt", href: "/kontakt" },
  ],
  angebot: [
    { name: "Therapeuten finden", href: "/therapeuten" },
    { name: "Was ist Hypnosetherapie?", href: "/hypnosetherapie" },
    { name: "Häufige Fragen", href: "/faq" },
    { name: "News", href: "/news" },
  ],
  rechtliches: [
    { name: "Datenschutz", href: "/datenschutz" },
    { name: "Impressum", href: "/impressum" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-vsh-blue text-sm font-bold text-white">
                V
              </span>
              <span className="text-base font-bold tracking-tight text-vsh-blue">VSH</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Verband Schweizer Hypnosetherapeuten — Ihr Berufsverband
              für qualifizierte Hypnosetherapie in der Schweiz.
            </p>
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-vsh-blue/60" />
                <span>Schweiz</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-vsh-blue/60" />
                <span>info@v-s-h.ch</span>
              </div>
            </div>
          </div>

          {/* Verband */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Verband</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.verband.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-vsh-blue"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Angebot */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Angebot</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.angebot.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-vsh-blue"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Rechtliches</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.rechtliches.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-vsh-blue"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} VSH — Verband Schweizer Hypnosetherapeuten
          </p>
          <p className="text-xs text-muted-foreground/60">
            Qualität. Vertrauen. Professionalität.
          </p>
        </div>
      </div>
    </footer>
  );
}
