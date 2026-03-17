import { createClient } from "@/lib/supabase/server";
import { CEAdmin } from "@/components/admin/ce-admin";

export const metadata = { title: "Weiterbildung verwalten – VSH Admin" };

export default async function AdminWeiterbildungPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("continuing_education")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Weiterbildung verwalten</h1>
      <p className="mt-2 text-muted-foreground">
        Weiterbildungsangebote erfassen und pflegen.
      </p>
      <div className="mt-8">
        <CEAdmin courses={courses ?? []} />
      </div>
    </div>
  );
}
