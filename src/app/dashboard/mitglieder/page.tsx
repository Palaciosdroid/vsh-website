import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MemberDirectory } from "@/components/dashboard/member-directory";

export const metadata = { title: "Mitgliederverzeichnis – VSH" };

export default async function MitgliederPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: members } = await supabase
    .from("profiles")
    .select(
      "id, slug, first_name, last_name, title, photo_url, email, phone, city, canton, specializations, languages, membership_type, membership_since"
    )
    .order("last_name", { ascending: true });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-vsh-text">
          Mitgliederverzeichnis
        </h1>
        <p className="mt-1 text-muted-foreground">
          Alle Mitglieder des VSH auf einen Blick.
        </p>
      </div>

      <div className="mt-6">
        <MemberDirectory members={members ?? []} />
      </div>
    </div>
  );
}
