"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  Calendar,
  GraduationCap,
  FileText,
  Settings,
  ArrowLeft,
  ChevronLeft,
  Menu,
  Shield,
} from "lucide-react";
import { useState } from "react";

const sidebarLinks = [
  { name: "Übersicht", href: "/admin", icon: LayoutDashboard },
  { name: "Mitglieder", href: "/admin/mitglieder", icon: Users },
  { name: "News", href: "/admin/news", icon: Newspaper },
  { name: "Termine", href: "/admin/termine", icon: Calendar },
  { name: "Weiterbildung", href: "/admin/weiterbildung", icon: GraduationCap },
  { name: "Seiten", href: "/admin/seiten", icon: FileText },
  { name: "Einstellungen", href: "/admin/einstellungen", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {sidebarLinks.map((link) => {
        const isActive = link.href === "/admin"
          ? pathname === "/admin"
          : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-vsh-blue/10 text-vsh-blue"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span className="flex-1">{link.name}</span>}
          </Link>
        );
      })}

      <div className="mt-auto border-t pt-3">
        <Link
          href="/dashboard"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>Zurück zum Dashboard</span>}
        </Link>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-vsh-blue text-white shadow-lg lg:hidden"
        aria-label="Admin-Menü"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-vsh-blue" />
                <span className="text-sm font-bold text-vsh-blue">VSH Admin</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="rounded p-1 hover:bg-muted">
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col border-r bg-white transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-vsh-blue" />
              <span className="text-sm font-bold text-vsh-blue">Admin</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded p-1 hover:bg-muted"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
        {nav}
      </aside>
    </>
  );
}
