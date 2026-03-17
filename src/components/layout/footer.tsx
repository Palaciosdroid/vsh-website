import Link from "next/link";

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
    { name: "FAQ", href: "/faq" },
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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-vsh-blue">VSH</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Verband Schweizer Hypnosetherapeuten — Ihr Berufsverband
              für qualifizierte Hypnosetherapie in der Schweiz.
            </p>
          </div>

          {/* Verband */}
          <div>
            <h4 className="text-sm font-semibold text-vsh-text">Verband</h4>
            <ul className="mt-3 space-y-2">
              {footerLinks.verband.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-vsh-blue"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Angebot */}
          <div>
            <h4 className="text-sm font-semibold text-vsh-text">Angebot</h4>
            <ul className="mt-3 space-y-2">
              {footerLinks.angebot.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-vsh-blue"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h4 className="text-sm font-semibold text-vsh-text">Rechtliches</h4>
            <ul className="mt-3 space-y-2">
              {footerLinks.rechtliches.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-vsh-blue"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} VSH — Verband Schweizer Hypnosetherapeuten.
          Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
