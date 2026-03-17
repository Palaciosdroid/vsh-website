import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/dashboard/profile-form";

export const metadata = { title: "Profil bearbeiten – VSH" };

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const [{ data: profile }, { data: specializations }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("specializations")
      .select("id, name_de")
      .order("sort_order"),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Profil bearbeiten</h1>
      <p className="mt-2 text-muted-foreground">
        Verwalten Sie Ihr öffentliches Therapeuten-Profil.
      </p>

      {profile?.approval_status === "pending" && (
        <div className="mt-4 rounded-lg border border-vsh-gold/30 bg-vsh-gold/5 p-4 text-sm text-vsh-text">
          Ihr Profil wird derzeit geprüft. Solange es nicht freigeschaltet ist,
          ist es nicht öffentlich sichtbar.
        </div>
      )}

      <div className="mt-8">
        <ProfileForm
          profile={profile}
          specializations={specializations ?? []}
          userId={user.id}
        />
      </div>
    </div>
  );
}
