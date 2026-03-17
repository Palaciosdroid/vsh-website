import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";

export const metadata: Metadata = {
  title: "News",
  description: "Aktuelle Nachrichten und Neuigkeiten des Verbands Schweizer Hypnosetherapeuten (VSH).",
};

export default async function NewsPage() {
  const supabase = await createClient();

  const { data: news } = await supabase
    .from("news")
    .select("id, title, slug, excerpt, cover_image_url, published_at, author_id")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold-light">
              Blog & Neuigkeiten
            </p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Aktuelles</h1>
            <p className="mt-6 text-lg text-white/75">
              Neuigkeiten, Fachartikel und aktuelle Informationen rund um den VSH
              und die Hypnosetherapie.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {news && news.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`}>
                  <Card className="card-hover group h-full overflow-hidden rounded-2xl">
                    {article.cover_image_url ? (
                      <div className="aspect-[16/9] overflow-hidden bg-muted">
                        <img
                          src={article.cover_image_url}
                          alt={article.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-vsh-blue/5 to-vsh-green/5">
                        <Newspaper className="h-12 w-12 text-vsh-blue/20" />
                      </div>
                    )}
                    <CardContent className="p-5">
                      {article.published_at && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-vsh-gold">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(article.published_at).toLocaleDateString("de-CH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      )}
                      <h2 className="mt-2 font-semibold text-foreground line-clamp-2 group-hover:text-vsh-blue transition-colors">
                        {article.title}
                      </h2>
                      {article.excerpt && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-1 text-sm font-medium text-vsh-blue opacity-0 transition-opacity group-hover:opacity-100">
                        Weiterlesen <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-lg text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
                <Newspaper className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h2 className="mt-6 text-xl font-bold text-foreground">
                Noch keine Beiträge
              </h2>
              <p className="mt-2 text-muted-foreground">
                Hier erscheinen bald aktuelle Nachrichten und Fachartikel des
                Verbands Schweizer Hypnosetherapeuten.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
