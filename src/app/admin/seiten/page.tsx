import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Seiten verwalten – VSH Admin" };

export default async function AdminSeitenPage() {
  const supabase = await createClient();

  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .order("title", { ascending: true });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-vsh-text">Seiten verwalten</h1>
      <p className="mt-2 text-muted-foreground">
        Statische Inhalte bearbeiten.
      </p>

      <div className="mt-8 space-y-3">
        {(pages ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground">Keine Seiten vorhanden.</p>
        )}
        {(pages ?? []).map((page) => (
          <Link key={page.id} href={`/admin/seiten/${page.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{page.title}</p>
                  <p className="text-sm text-muted-foreground">/{page.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">
                    {page.updated_at
                      ? new Date(page.updated_at).toLocaleDateString("de-CH")
                      : "—"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
