import Link from "next/link";

const footerLinks = {
  verband: [
    { name: "Über uns", href: "/about" },
    { name: "Vorstand", href: "/about#vorstand" },
    { name: "Statuten", href: "/documents" },
    { name: "Kontakt", href: "/contact" },
  ],
  mitglieder: [
    { name: "Mitgliederverzeichnis", href: "/members" },
    { name: "Weiterbildung", href: "/continuing-education" },
    { name: "Dokumente", href: "/documents" },
    { name: "Veranstaltungen", href: "/events" },
  ],
  rechtliches: [
    { name: "Impressum", href: "/impressum" },
    { name: "Datenschutz", href: "/datenschutz" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold">VSH</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Vereinigung Schweizer Tierärzte — Ihr Berufsverband für
              veterinärmedizinische Exzellenz.
            </p>
          </div>

          {/* Verband */}
          <div>
            <h4 className="text-sm font-semibold">Verband</h4>
            <ul className="mt-3 space-y-2">
              {footerLinks.verband.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mitglieder */}
          <div>
            <h4 className="text-sm font-semibold">Mitglieder</h4>
            <ul className="mt-3 space-y-2">
              {footerLinks.mitglieder.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h4 className="text-sm font-semibold">Rechtliches</h4>
            <ul className="mt-3 space-y-2">
              {footerLinks.rechtliches.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} VSH — Vereinigung Schweizer Tierärzte.
          Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
