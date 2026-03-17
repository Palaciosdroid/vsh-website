"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: string;
  title: string;
  description: string | null;
  provider: string | null;
  provider_url: string | null;
  category: string;
  format: string;
  duration: string | null;
  cost_info: string | null;
  is_vsh_recognized: boolean;
  recognition_details: string | null;
  contact_email: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

const CATEGORIES = [
  { value: "hypnose", label: "Hypnose" },
  { value: "coaching", label: "Coaching" },
  { value: "psychologie", label: "Psychologie" },
  { value: "medizin", label: "Medizin" },
  { value: "business", label: "Business" },
  { value: "sonstiges", label: "Sonstiges" },
];

const FORMATS = [
  { value: "praesenz", label: "Präsenz" },
  { value: "online", label: "Online" },
  { value: "hybrid", label: "Hybrid" },
];

const categoryLabel = (val: string) =>
  CATEGORIES.find((c) => c.value === val)?.label ?? val;

const formatLabel = (val: string) =>
  FORMATS.find((f) => f.value === val)?.label ?? val;

const emptyForm = {
  title: "",
  description: "",
  provider: "",
  provider_url: "",
  category: "sonstiges",
  format: "praesenz",
  duration: "",
  cost_info: "",
  is_vsh_recognized: false,
  recognition_details: "",
  contact_email: "",
  is_published: false,
  sort_order: "0",
};

export function CEAdmin({ courses }: { courses: Course[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function setField(key: string, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(course: Course) {
    setEditingId(course.id);
    setShowCreate(false);
    setForm({
      title: course.title,
      description: course.description ?? "",
      provider: course.provider ?? "",
      provider_url: course.provider_url ?? "",
      category: course.category,
      format: course.format,
      duration: course.duration ?? "",
      cost_info: course.cost_info ?? "",
      is_vsh_recognized: course.is_vsh_recognized,
      recognition_details: course.recognition_details ?? "",
      contact_email: course.contact_email ?? "",
      is_published: course.is_published,
      sort_order: course.sort_order?.toString() ?? "0",
    });
  }

  function startCreate() {
    setShowCreate(true);
    setEditingId(null);
    setForm(emptyForm);
  }

  function cancel() {
    setShowCreate(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description || null,
      provider: form.provider || null,
      provider_url: form.provider_url || null,
      category: form.category,
      format: form.format,
      duration: form.duration || null,
      cost_info: form.cost_info || null,
      is_vsh_recognized: form.is_vsh_recognized,
      recognition_details: form.recognition_details || null,
      contact_email: form.contact_email || null,
      is_published: form.is_published,
      sort_order: form.sort_order ? Number(form.sort_order) : 0,
    };

    if (editingId) {
      await supabase.from("continuing_education").update(payload).eq("id", editingId);
    } else {
      await supabase.from("continuing_education").insert(payload);
    }

    setSaving(false);
    cancel();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Weiterbildung wirklich löschen?")) return;
    await supabase.from("continuing_education").delete().eq("id", id);
    router.refresh();
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    const idx = courses.findIndex((c) => c.id === id);
    if (idx < 0) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= courses.length) return;

    const current = courses[idx];
    const swap = courses[swapIdx];

    await Promise.all([
      supabase
        .from("continuing_education")
        .update({ sort_order: swap.sort_order })
        .eq("id", current.id),
      supabase
        .from("continuing_education")
        .update({ sort_order: current.sort_order })
        .eq("id", swap.id),
    ]);

    router.refresh();
  }

  function renderForm() {
    return (
      <div className="space-y-4 rounded-lg border bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="Titel der Weiterbildung"
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={4}
              placeholder="Beschreibung der Weiterbildung"
            />
          </div>

          <div>
            <Label htmlFor="provider">Anbieter</Label>
            <Input
              id="provider"
              value={form.provider}
              onChange={(e) => setField("provider", e.target.value)}
              placeholder="Name des Anbieters"
            />
          </div>

          <div>
            <Label htmlFor="provider_url">Anbieter-URL</Label>
            <Input
              id="provider_url"
              value={form.provider_url}
              onChange={(e) => setField("provider_url", e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="category">Kategorie</Label>
            <Select
              id="category"
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="format">Format</Label>
            <Select
              id="format"
              value={form.format}
              onChange={(e) => setField("format", e.target.value)}
            >
              {FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="duration">Dauer</Label>
            <Input
              id="duration"
              value={form.duration}
              onChange={(e) => setField("duration", e.target.value)}
              placeholder="z.B. 2 Tage, 40 Stunden"
            />
          </div>

          <div>
            <Label htmlFor="cost_info">Kosten</Label>
            <Input
              id="cost_info"
              value={form.cost_info}
              onChange={(e) => setField("cost_info", e.target.value)}
              placeholder="z.B. CHF 1'200.–"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={form.is_vsh_recognized}
              onCheckedChange={(v) => setField("is_vsh_recognized", v)}
            />
            <Label>VSH-anerkannt</Label>
          </div>

          {form.is_vsh_recognized && (
            <div>
              <Label htmlFor="recognition_details">Anerkennungsdetails</Label>
              <Input
                id="recognition_details"
                value={form.recognition_details}
                onChange={(e) => setField("recognition_details", e.target.value)}
                placeholder="Details zur Anerkennung"
              />
            </div>
          )}

          <div>
            <Label htmlFor="contact_email">Kontakt-E-Mail</Label>
            <Input
              id="contact_email"
              type="email"
              value={form.contact_email}
              onChange={(e) => setField("contact_email", e.target.value)}
              placeholder="info@anbieter.ch"
            />
          </div>

          <div>
            <Label htmlFor="sort_order">Sortierung</Label>
            <Input
              id="sort_order"
              type="number"
              value={form.sort_order}
              onChange={(e) => setField("sort_order", e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={form.is_published}
              onCheckedChange={(v) => setField("is_published", v)}
            />
            <Label>Veröffentlicht</Label>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleSave} disabled={saving || !form.title}>
            {saving ? "Speichern..." : editingId ? "Aktualisieren" : "Erstellen"}
          </Button>
          <Button variant="ghost" onClick={cancel}>
            Abbrechen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {courses.length} Weiterbildung{courses.length !== 1 && "en"}
        </p>
        <Button onClick={startCreate} disabled={showCreate}>
          Neue Weiterbildung
        </Button>
      </div>

      {showCreate && renderForm()}

      {courses.map((course, idx) => (
        <Card key={course.id}>
          <CardContent className="p-4">
            <div
              className="flex cursor-pointer flex-wrap items-center gap-3"
              onClick={() =>
                editingId === course.id ? cancel() : startEdit(course)
              }
            >
              <span className="font-medium">{course.title}</span>
              {course.provider && (
                <span className="text-sm text-muted-foreground">
                  {course.provider}
                </span>
              )}
              <Badge variant="secondary">{categoryLabel(course.category)}</Badge>
              <Badge variant="outline">{formatLabel(course.format)}</Badge>
              {course.is_vsh_recognized && (
                <Badge variant="success">VSH-anerkannt</Badge>
              )}
              <Badge variant={course.is_published ? "success" : "warning"}>
                {course.is_published ? "Veröffentlicht" : "Entwurf"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Sortierung: {course.sort_order}
              </span>
            </div>

            {editingId === course.id && (
              <div className="mt-4 space-y-4">
                {renderForm()}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={idx === 0}
                    onClick={() => handleReorder(course.id, "up")}
                  >
                    Nach oben
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={idx === courses.length - 1}
                    onClick={() => handleReorder(course.id, "down")}
                  >
                    Nach unten
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(course.id)}
                  >
                    Löschen
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {courses.length === 0 && !showCreate && (
        <p className="text-sm text-muted-foreground">
          Keine Weiterbildungen vorhanden.
        </p>
      )}
    </div>
  );
}
