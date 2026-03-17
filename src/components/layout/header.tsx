"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Über uns", href: "/ueber-uns" },
  { name: "Therapeuten finden", href: "/therapeuten" },
  { name: "Hypnosetherapie", href: "/hypnosetherapie" },
  { name: "News", href: "/news" },
  { name: "FAQ", href: "/faq" },
  { name: "Kontakt", href: "/kontakt" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-vsh-blue">VSH</span>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            Verband Schweizer Hypnosetherapeuten
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-vsh-text transition-colors hover:bg-muted hover:text-vsh-blue"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/login">Anmelden</Link>
          </Button>
          <Button size="sm" className="bg-vsh-green hover:bg-vsh-green/90" asChild>
            <Link href="/mitglied-werden">Mitglied werden</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="rounded-md p-2 text-muted-foreground hover:bg-muted lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menü öffnen"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t lg:hidden">
          <nav className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm font-medium text-vsh-text hover:bg-muted hover:text-vsh-blue"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 border-t pt-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">Anmelden</Link>
              </Button>
              <Button size="sm" className="bg-vsh-green hover:bg-vsh-green/90" asChild>
                <Link href="/mitglied-werden">Mitglied werden</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
