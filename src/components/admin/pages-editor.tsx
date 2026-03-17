"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;
  updated_at: string | null;
}

function renderMarkdown(markdown: string): string {
  let html = markdown
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headings
  html = html.replace(
    /^### (.+)$/gm,
    "<h3 class='text-lg font-semibold mt-4 mb-2'>$1</h3>"
  );
  html = html.replace(
    /^## (.+)$/gm,
    "<h2 class='text-xl font-semibold mt-5 mb-2'>$1</h2>"
  );
  html = html.replace(
    /^# (.+)$/gm,
    "<h1 class='text-2xl font-bold mt-6 mb-3'>$1</h1>"
  );

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-primary underline">$1</a>'
  );

  // Unordered list items
  html = html.replace(/^- (.+)$/gm, "<li class='ml-4 list-disc'>$1</li>");

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(
    /((?:<li[^>]*>.*<\/li>\n?)+)/g,
    "<ul class='my-2'>$1</ul>"
  );

  // Paragraphs
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<li")
      ) {
        return trimmed;
      }
      return `<p class="mb-3">${trimmed}</p>`;
    })
    .join("\n");

  return html;
}

export function PagesEditor({ page }: { page: Page }) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content ?? "");
  const [metaTitle, setMetaTitle] = useState(page.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(
    page.meta_description ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  async function handleSave() {
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from("pages")
        .update({
          title: title.trim(),
          content: content.trim() || null,
          meta_title: metaTitle.trim() || null,
          meta_description: metaDescription.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", page.id);

      if (updateError) throw updateError;

      setSuccess(true);
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unbekannter Fehler beim Speichern.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vsh-text">Seite bearbeiten</h1>
        <p className="mt-1 text-sm text-muted-foreground">/{page.slug}</p>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-md border border-vsh-green/50 bg-vsh-green/10 px-4 py-3 text-sm text-vsh-green">
              Seite erfolgreich gespeichert.
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Seitentitel"
            />
          </div>

          {/* Slug (readonly) */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" value={page.slug} readOnly className="bg-muted" />
            <p className="text-xs text-muted-foreground">
              Der Slug kann nicht geändert werden.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Inhalt (Markdown)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? "Bearbeiten" : "Vorschau"}
              </Button>
            </div>
            {showPreview ? (
              <div
                className="min-h-[400px] rounded-md border border-input bg-background px-4 py-3 text-sm"
                dangerouslySetInnerHTML={{
                  __html: content.trim()
                    ? renderMarkdown(content)
                    : '<p class="text-muted-foreground">Keine Inhalte zum Anzeigen.</p>',
                }}
              />
            ) : (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Seiteninhalt in Markdown..."
                rows={20}
                className="font-mono text-sm"
              />
            )}
          </div>

          {/* Meta Title */}
          <div className="space-y-2">
            <Label htmlFor="meta_title">Meta-Titel</Label>
            <Input
              id="meta_title"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="SEO-Titel (optional)"
            />
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta-Beschreibung</Label>
            <Textarea
              id="meta_description"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="SEO-Beschreibung (optional)"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving || !title.trim()}
            >
              {saving ? "Speichern..." : "Seite speichern"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/seiten")}
              disabled={saving}
            >
              Zurück zur Übersicht
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
