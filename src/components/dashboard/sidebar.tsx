"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCircle,
  MessageSquare,
  Calendar,
  Users,
  GraduationCap,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profil", href: "/dashboard/profil", icon: UserCircle },
  { name: "Nachrichten", href: "/dashboard/nachrichten", icon: MessageSquare },
  { name: "Termine", href: "/dashboard/termine", icon: Calendar },
  { name: "Mitglieder", href: "/dashboard/mitglieder", icon: Users },
  { name: "Weiterbildung", href: "/dashboard/weiterbildung", icon: GraduationCap },
  { name: "Dokumente", href: "/dashboard/dokumente", icon: FileText },
  { name: "Einstellungen", href: "/dashboard/einstellungen", icon: Settings },
];

export function DashboardSidebar({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {sidebarLinks.map((link) => {
        const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
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
            {!collapsed && (
              <span className="flex-1">{link.name}</span>
            )}
            {!collapsed && link.name === "Nachrichten" && unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-vsh-blue text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Link>
        );
      })}

      <div className="mt-auto border-t pt-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>Abmelden</span>}
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-vsh-blue text-white shadow-lg lg:hidden"
        aria-label="Menü öffnen"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <span className="text-sm font-bold text-vsh-blue">VSH Mitglieder</span>
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
            <span className="text-sm font-bold text-vsh-blue">Mitglieder</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded p-1 hover:bg-muted"
            aria-label={collapsed ? "Sidebar einblenden" : "Sidebar ausblenden"}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
        {nav}
      </aside>
    </>
  );
}
