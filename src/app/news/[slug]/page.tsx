import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, User } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("news")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!article) {
    return { title: "Artikel nicht gefunden" };
  }

  return {
    title: article.title,
    description: article.excerpt || undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      type: "article",
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("news")
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      cover_image_url,
      published_at,
      author_id
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!article) {
    notFound();
  }

  // Optionally fetch author
  let author: { first_name: string | null; last_name: string | null } | null = null;
  if (article.author_id) {
    const { data } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", article.author_id)
      .single();
    author = data;
  }

  return (
    <div>
      {/* Hero with cover image */}
      <section className="hero-gradient relative py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 text-white/60 hover:text-white hover:bg-white/10"
              asChild
            >
              <Link href="/news">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Zurück zu News
              </Link>
            </Button>

            {article.published_at && (
              <div className="flex items-center gap-1.5 text-sm text-vsh-gold-light">
                <Calendar className="h-4 w-4" />
                {new Date(article.published_at).toLocaleDateString("de-CH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}

            <h1 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mt-4 text-lg text-white/75">{article.excerpt}</p>
            )}

            {author && (
              <div className="mt-6 flex items-center gap-2 text-sm text-white/60">
                <User className="h-4 w-4" />
                <span>
                  {author.first_name} {author.last_name}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cover Image */}
      {article.cover_image_url && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-8 overflow-hidden rounded-2xl shadow-xl">
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {article.content ? (
            <div className="prose-vsh">
              {/* Render markdown-like content as paragraphs */}
              {article.content.split("\n\n").map((block: string, i: number) => {
                const trimmed = block.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith("# ")) {
                  return <h2 key={i}>{trimmed.replace(/^#+\s/, "")}</h2>;
                }
                if (trimmed.startsWith("## ")) {
                  return <h2 key={i}>{trimmed.replace(/^#+\s/, "")}</h2>;
                }
                if (trimmed.startsWith("### ")) {
                  return <h3 key={i}>{trimmed.replace(/^#+\s/, "")}</h3>;
                }
                if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                  const items = trimmed.split("\n").map((line) => line.replace(/^[-*]\s/, ""));
                  return (
                    <ul key={i}>
                      {items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i}>{trimmed}</p>;
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">Kein Inhalt verfügbar.</p>
          )}

          {/* Back link */}
          <div className="mt-12 border-t pt-8">
            <Button variant="outline" className="rounded-xl" asChild>
              <Link href="/news">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Zurück zu allen News
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: article.title,
            description: article.excerpt || undefined,
            image: article.cover_image_url || undefined,
            datePublished: article.published_at,
            author: author
              ? {
                  "@type": "Person",
                  name: `${author.first_name} ${author.last_name}`,
                }
              : {
                  "@type": "Organization",
                  name: "VSH — Verband Schweizer Hypnosetherapeuten",
                },
            publisher: {
              "@type": "Organization",
              name: "VSH — Verband Schweizer Hypnosetherapeuten",
            },
          }),
        }}
      />
    </div>
  );
}
