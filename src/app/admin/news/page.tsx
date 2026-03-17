import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "News verwalten – VSH" };

export default async function AdminNewsPage() {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from("news")
    .select("id, title, slug, is_published, published_at, created_at, author")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-destructive">Fehler beim Laden der Beiträge: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-vsh-text">News verwalten</h1>
          <p className="mt-2 text-muted-foreground">
            Beiträge erstellen, bearbeiten und veröffentlichen.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/news/neu">Neuer Beitrag</Link>
        </Button>
      </div>

      <div className="mt-8 space-y-4">
        {articles && articles.length > 0 ? (
          articles.map((article) => (
            <Link key={article.id} href={`/admin/news/${article.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <Badge variant={article.is_published ? "success" : "secondary"}>
                    {article.is_published ? "Veröffentlicht" : "Entwurf"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {article.author && <span>Autor: {article.author}</span>}
                    {article.published_at && (
                      <span>
                        Veröffentlicht:{" "}
                        {new Date(article.published_at).toLocaleDateString("de-CH", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    <span>
                      Erstellt:{" "}
                      {new Date(article.created_at).toLocaleDateString("de-CH", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Noch keine Beiträge vorhanden.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
