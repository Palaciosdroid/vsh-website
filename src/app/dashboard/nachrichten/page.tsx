import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessagesList } from "@/components/dashboard/messages-list";

export const metadata = { title: "Nachrichten – VSH" };

export default async function NachrichtenPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: contactRequests } = await supabase
    .from("contact_requests")
    .select("*")
    .eq("therapist_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Nachrichten</h1>
      <p className="mt-2 text-muted-foreground">
        Kontaktanfragen von Besuchern Ihres Profils.
      </p>

      <div className="mt-8">
        <MessagesList initialMessages={contactRequests ?? []} />
      </div>
    </div>
  );
}
