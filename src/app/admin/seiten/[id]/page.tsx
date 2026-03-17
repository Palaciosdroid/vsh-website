import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PagesEditor } from "@/components/admin/pages-editor";

export const metadata = { title: "Seite bearbeiten – VSH Admin" };

export default async function AdminPageEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("id", id)
    .single();

  if (!page) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <PagesEditor page={page} />
    </div>
  );
}
