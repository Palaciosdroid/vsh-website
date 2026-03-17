import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CECatalog } from "@/components/dashboard/ce-catalog";

export const metadata = { title: "Weiterbildung – VSH" };

export default async function WeiterbildungPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: entries } = await supabase
    .from("continuing_education")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-vsh-text">Weiterbildung</h1>
        <p className="mt-1 text-muted-foreground">
          Weiterbildungsangebote und anerkannte Kurse im Überblick.
        </p>
      </div>

      <div className="mt-6">
        <CECatalog entries={entries ?? []} />
      </div>
    </div>
  );
}
