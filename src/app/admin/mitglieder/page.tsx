import { createClient } from "@/lib/supabase/server";
import { MembersAdmin } from "@/components/admin/members-admin";

export const metadata = { title: "Mitgliederverwaltung – VSH Admin" };

export default async function MitgliederPage() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select(
      "id, slug, first_name, last_name, email, phone, canton, approval_status, is_published, membership_type, role, created_at, deactivated_at"
    )
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">
        Mitgliederverwaltung
      </h1>
      <p className="mt-2 text-muted-foreground">
        Profile freigeben, sperren und verwalten.
      </p>

      <div className="mt-8">
        <MembersAdmin profiles={profiles ?? []} />
      </div>
    </div>
  );
}
