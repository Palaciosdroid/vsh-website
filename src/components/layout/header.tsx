"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b bg-white/90 backdrop-blur-xl shadow-sm"
          : "border-b border-transparent bg-white/70 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-vsh-blue text-sm font-bold text-white transition-transform group-hover:scale-105">
            V
          </span>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-vsh-blue">VSH</span>
            <span className="hidden text-[10px] leading-tight text-muted-foreground sm:block">
              Verband Schweizer Hypnosetherapeuten
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-vsh-blue"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
                {isActive && (
                  <span className="absolute inset-x-2 -bottom-[1.05rem] h-0.5 rounded-full bg-vsh-blue" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
            <Link href="/auth/login">Anmelden</Link>
          </Button>
          <Button
            size="sm"
            className="bg-vsh-blue hover:bg-vsh-blue-light text-white rounded-lg shadow-sm"
            asChild
          >
            <Link href="/mitglied-werden">
              Mitglied werden
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menü öffnen"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto max-w-7xl space-y-1 border-t px-4 py-4 sm:px-6">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-vsh-blue/5 text-vsh-blue"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.name}
                <ChevronRight className="h-4 w-4 opacity-40" />
              </Link>
            );
          })}
          <div className="flex flex-col gap-2 border-t pt-4">
            <Button variant="outline" size="sm" className="justify-center" asChild>
              <Link href="/auth/login">Anmelden</Link>
            </Button>
            <Button
              size="sm"
              className="justify-center bg-vsh-blue hover:bg-vsh-blue-light text-white"
              asChild
            >
              <Link href="/mitglied-werden">Mitglied werden</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
