import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export const metadata = { title: "Dashboard – VSH" };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get unread message count
  const { count: unreadCount } = await supabase
    .from("contact_requests")
    .select("*", { count: "exact", head: true })
    .eq("therapist_id", user.id)
    .eq("is_read", false);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <DashboardSidebar unreadCount={unreadCount ?? 0} />
      <main className="flex-1 overflow-y-auto bg-vsh-bg">
        {children}
      </main>
    </div>
  );
}
