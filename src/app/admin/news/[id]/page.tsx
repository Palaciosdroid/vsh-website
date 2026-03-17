import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewsEditor } from "@/components/admin/news-editor";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("news")
    .select("title")
    .eq("id", id)
    .single();

  return {
    title: article ? `${article.title} bearbeiten – VSH` : "Beitrag bearbeiten – VSH",
  };
}

export default async function AdminNewsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Beitrag bearbeiten</h1>
      <p className="mt-2 text-muted-foreground">
        Bearbeiten Sie den bestehenden Beitrag.
      </p>
      <div className="mt-8">
        <NewsEditor initialData={article} />
      </div>
    </div>
  );
}
