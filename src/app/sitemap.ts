import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://v-s-h.ch";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/therapeuten`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/hypnosetherapie`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ueber-uns`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/mitglied-werden`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/kontakt`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/statuten`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/datenschutz`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/impressum`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic: News articles
  const { data: newsArticles } = await supabase
    .from("news")
    .select("slug, updated_at")
    .eq("is_published", true);

  const newsPages: MetadataRoute.Sitemap = (newsArticles || []).map((article) => ({
    url: `${BASE_URL}/news/${article.slug}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Dynamic: Therapist profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("slug, updated_at")
    .eq("is_published", true)
    .eq("approval_status", "approved");

  const profilePages: MetadataRoute.Sitemap = (profiles || [])
    .filter((p) => p.slug)
    .map((profile) => ({
      url: `${BASE_URL}/therapeuten/${profile.slug}`,
      lastModified: new Date(profile.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...newsPages, ...profilePages];
}
