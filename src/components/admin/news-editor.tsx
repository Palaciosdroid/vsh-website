"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  author: string | null;
}

interface NewsEditorProps {
  initialData: NewsArticle | null;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderMarkdown(markdown: string): string {
  let html = markdown
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headings (must come before other processing)
  html = html.replace(/^### (.+)$/gm, "<h3 class='text-lg font-semibold mt-4 mb-2'>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2 class='text-xl font-semibold mt-5 mb-2'>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1 class='text-2xl font-bold mt-6 mb-3'>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline">$1</a>');

  // Unordered list items
  html = html.replace(/^- (.+)$/gm, "<li class='ml-4 list-disc'>$1</li>");

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, "<ul class='my-2'>$1</ul>");

  // Paragraphs: wrap lines that aren't already HTML tags
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<h") || trimmed.startsWith("<ul") || trimmed.startsWith("<li")) {
        return trimmed;
      }
      return `<p class="mb-3">${trimmed}</p>`;
    })
    .join("\n");

  return html;
}

function toDatetimeLocalValue(isoString: string | null): string {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    // Format as YYYY-MM-DDTHH:mm for datetime-local input
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  } catch {
    return "";
  }
}

export function NewsEditor({ initialData }: NewsEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEditMode = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url ?? "");
  const [isPublished, setIsPublished] = useState(initialData?.is_published ?? false);
  const [publishedAt, setPublishedAt] = useState(toDatetimeLocalValue(initialData?.published_at ?? null));
  const [author, setAuthor] = useState(initialData?.author ?? "");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Auto-generate slug from title unless manually edited
  useEffect(() => {
    if (!slugManuallyEdited) {
      setSlug(generateSlug(title));
    }
  }, [title, slugManuallyEdited]);

  const handleSlugChange = useCallback((value: string) => {
    setSlugManuallyEdited(true);
    setSlug(value);
  }, []);

  const handleSave = async () => {
    setError(null);
    setSaving(true);

    try {
      const articleData = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || null,
        content: content.trim() || null,
        cover_image_url: coverImageUrl.trim() || null,
        is_published: isPublished,
        published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
        author: author.trim() || null,
      };

      if (!articleData.title) {
        setError("Titel ist erforderlich.");
        setSaving(false);
        return;
      }

      if (!articleData.slug) {
        setError("Slug ist erforderlich.");
        setSaving(false);
        return;
      }

      if (isEditMode) {
        const { error: updateError } = await supabase
          .from("news")
          .update(articleData)
          .eq("id", initialData.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("news")
          .insert(articleData);

        if (insertError) throw insertError;
      }

      router.push("/admin/news");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unbekannter Fehler beim Speichern.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData) return;

    const confirmed = window.confirm(
      "Sind Sie sicher, dass Sie diesen Beitrag unwiderruflich löschen möchten?"
    );
    if (!confirmed) return;

    setDeleting(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("news")
        .delete()
        .eq("id", initialData.id);

      if (deleteError) throw deleteError;

      router.push("/admin/news");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unbekannter Fehler beim Löschen.";
      setError(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Titel</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel des Beitrags"
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="url-freundlicher-slug"
          />
          <p className="text-xs text-muted-foreground">
            Wird automatisch aus dem Titel generiert. Kann manuell angepasst werden.
          </p>
        </div>

        {/* Author */}
        <div className="space-y-2">
          <Label htmlFor="author">Autor</Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Name des Autors"
          />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor="excerpt">Auszug</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Kurze Zusammenfassung des Beitrags"
            rows={3}
          />
        </div>

        {/* Content with Markdown Preview */}
        <div className="space-y-2">
          <Label>Inhalt (Markdown)</Label>
          <Tabs defaultValue="editor">
            <TabsList>
              <TabsTrigger value="editor">Bearbeiten</TabsTrigger>
              <TabsTrigger value="preview">Vorschau</TabsTrigger>
            </TabsList>
            <TabsContent value="editor">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Beitragsinhalt in Markdown..."
                rows={15}
                className="font-mono text-sm"
              />
            </TabsContent>
            <TabsContent value="preview">
              <div
                className="min-h-[360px] rounded-md border border-input bg-background px-4 py-3 text-sm"
                dangerouslySetInnerHTML={{
                  __html: content.trim()
                    ? renderMarkdown(content)
                    : '<p class="text-muted-foreground">Keine Inhalte zum Anzeigen.</p>',
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Cover Image URL */}
        <div className="space-y-2">
          <Label htmlFor="cover_image_url">Titelbild-URL</Label>
          <Input
            id="cover_image_url"
            type="url"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://beispiel.ch/bild.jpg"
          />
        </div>

        {/* Published Switch */}
        <div className="flex items-center gap-3">
          <Switch
            id="is_published"
            checked={isPublished}
            onCheckedChange={setIsPublished}
          />
          <Label htmlFor="is_published">Veröffentlicht</Label>
        </div>

        {/* Published At */}
        <div className="space-y-2">
          <Label htmlFor="published_at">Veröffentlichungsdatum</Label>
          <Input
            id="published_at"
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Optional. Kann für zeitgesteuerte Veröffentlichung genutzt werden.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <Button onClick={handleSave} disabled={saving || deleting}>
            {saving ? "Speichern..." : isEditMode ? "Änderungen speichern" : "Beitrag erstellen"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/admin/news")} disabled={saving || deleting}>
            Abbrechen
          </Button>
          {isEditMode && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving || deleting}
              className="ml-auto"
            >
              {deleting ? "Löschen..." : "Beitrag löschen"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
