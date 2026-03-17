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

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  start_date: string;
  end_date: string | null;
  location_name: string | null;
  location_address: string | null;
  is_online: boolean;
  online_link: string | null;
  max_participants: number | null;
  registration_deadline: string | null;
  cost: number | null;
  is_published: boolean;
  registration_count: number;
  created_at: string;
}

interface Registration {
  id: string;
  user_id: string;
  status: string;
  registered_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
}

const EVENT_TYPES = [
  { value: "gv", label: "GV" },
  { value: "workshop", label: "Workshop" },
  { value: "weiterbildung", label: "Weiterbildung" },
  { value: "stammtisch", label: "Stammtisch" },
  { value: "sonstiges", label: "Sonstiges" },
];

const eventTypeLabel = (type: string) =>
  EVENT_TYPES.find((t) => t.value === type)?.label ?? type;

function toLocalDatetime(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const emptyForm = {
  title: "",
  description: "",
  event_type: "sonstiges",
  start_date: "",
  end_date: "",
  location_name: "",
  location_address: "",
  is_online: false,
  online_link: "",
  max_participants: "",
  registration_deadline: "",
  cost: "",
  is_published: false,
};

export function EventsAdmin({ events }: { events: Event[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedRegistrations, setExpandedRegistrations] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);

  function setField(key: string, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(event: Event) {
    setEditingId(event.id);
    setShowCreate(false);
    setForm({
      title: event.title,
      description: event.description ?? "",
      event_type: event.event_type,
      start_date: toLocalDatetime(event.start_date),
      end_date: toLocalDatetime(event.end_date),
      location_name: event.location_name ?? "",
      location_address: event.location_address ?? "",
      is_online: event.is_online,
      online_link: event.online_link ?? "",
      max_participants: event.max_participants?.toString() ?? "",
      registration_deadline: toLocalDatetime(event.registration_deadline),
      cost: event.cost?.toString() ?? "",
      is_published: event.is_published,
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
      event_type: form.event_type,
      start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
      end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
      location_name: form.location_name || null,
      location_address: form.location_address || null,
      is_online: form.is_online,
      online_link: form.online_link || null,
      max_participants: form.max_participants ? Number(form.max_participants) : null,
      registration_deadline: form.registration_deadline
        ? new Date(form.registration_deadline).toISOString()
        : null,
      cost: form.cost ? Number(form.cost) : null,
      is_published: form.is_published,
    };

    if (editingId) {
      await supabase.from("events").update(payload).eq("id", editingId);
    } else {
      await supabase.from("events").insert(payload);
    }

    setSaving(false);
    cancel();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Event wirklich löschen?")) return;
    await supabase.from("events").delete().eq("id", id);
    router.refresh();
  }

  async function loadRegistrations(eventId: string) {
    if (expandedRegistrations === eventId) {
      setExpandedRegistrations(null);
      return;
    }
    setLoadingRegistrations(true);
    setExpandedRegistrations(eventId);
    const { data } = await supabase
      .from("event_registrations")
      .select("id, user_id, status, registered_at, profiles(first_name, last_name, email)")
      .eq("event_id", eventId)
      .order("registered_at", { ascending: true });
    setRegistrations((data as unknown as Registration[]) ?? []);
    setLoadingRegistrations(false);
  }

  async function sendReminder(eventId: string) {
    setSendingReminder(eventId);
    try {
      await fetch("/api/admin/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
    } catch {
      // silent
    }
    setSendingReminder(null);
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
              placeholder="Event-Titel"
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={4}
              placeholder="Beschreibung des Events"
            />
          </div>

          <div>
            <Label htmlFor="event_type">Typ</Label>
            <Select
              id="event_type"
              value={form.event_type}
              onChange={(e) => setField("event_type", e.target.value)}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="location_name">Ort (Name)</Label>
            <Input
              id="location_name"
              value={form.location_name}
              onChange={(e) => setField("location_name", e.target.value)}
              placeholder="z.B. Hotel Bellevue"
            />
          </div>

          <div>
            <Label htmlFor="start_date">Start</Label>
            <Input
              id="start_date"
              type="datetime-local"
              value={form.start_date}
              onChange={(e) => setField("start_date", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="end_date">Ende</Label>
            <Input
              id="end_date"
              type="datetime-local"
              value={form.end_date}
              onChange={(e) => setField("end_date", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="location_address">Adresse</Label>
            <Input
              id="location_address"
              value={form.location_address}
              onChange={(e) => setField("location_address", e.target.value)}
              placeholder="Strasse, PLZ Ort"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={form.is_online}
              onCheckedChange={(v) => setField("is_online", v)}
            />
            <Label>Online-Event</Label>
          </div>

          {form.is_online && (
            <div>
              <Label htmlFor="online_link">Online-Link</Label>
              <Input
                id="online_link"
                value={form.online_link}
                onChange={(e) => setField("online_link", e.target.value)}
                placeholder="https://..."
              />
            </div>
          )}

          <div>
            <Label htmlFor="max_participants">Max. Teilnehmer</Label>
            <Input
              id="max_participants"
              type="number"
              value={form.max_participants}
              onChange={(e) => setField("max_participants", e.target.value)}
              placeholder="Unbegrenzt"
            />
          </div>

          <div>
            <Label htmlFor="registration_deadline">Anmeldefrist</Label>
            <Input
              id="registration_deadline"
              type="datetime-local"
              value={form.registration_deadline}
              onChange={(e) => setField("registration_deadline", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="cost">Kosten (CHF)</Label>
            <Input
              id="cost"
              type="number"
              value={form.cost}
              onChange={(e) => setField("cost", e.target.value)}
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
          <Button onClick={handleSave} disabled={saving || !form.title || !form.start_date}>
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
          {events.length} Event{events.length !== 1 && "s"}
        </p>
        <Button onClick={startCreate} disabled={showCreate}>
          Neues Event
        </Button>
      </div>

      {showCreate && renderForm()}

      {events.map((event) => (
        <Card key={event.id}>
          <CardContent className="p-4">
            <div
              className="flex cursor-pointer flex-wrap items-center gap-3"
              onClick={() =>
                editingId === event.id ? cancel() : startEdit(event)
              }
            >
              <span className="font-medium">{event.title}</span>
              <Badge variant="secondary">{eventTypeLabel(event.event_type)}</Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(event.start_date).toLocaleDateString("de-CH", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {event.location_name && (
                <span className="text-sm text-muted-foreground">
                  {event.location_name}
                </span>
              )}
              <Badge variant={event.registration_count > 0 ? "success" : "outline"}>
                {event.registration_count} Anmeldung{event.registration_count !== 1 && "en"}
              </Badge>
              <Badge variant={event.is_published ? "success" : "warning"}>
                {event.is_published ? "Veröffentlicht" : "Entwurf"}
              </Badge>
            </div>

            {editingId === event.id && (
              <div className="mt-4 space-y-4">
                {renderForm()}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadRegistrations(event.id)}
                  >
                    Anmeldeliste{" "}
                    {expandedRegistrations === event.id ? "ausblenden" : "anzeigen"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={sendingReminder === event.id}
                    onClick={() => sendReminder(event.id)}
                  >
                    {sendingReminder === event.id
                      ? "Wird gesendet..."
                      : "Erinnerung senden"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                  >
                    Löschen
                  </Button>
                </div>

                {expandedRegistrations === event.id && (
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-3 text-sm font-semibold">
                      Anmeldeliste
                    </h4>
                    {loadingRegistrations ? (
                      <p className="text-sm text-muted-foreground">Laden...</p>
                    ) : registrations.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Keine Anmeldungen vorhanden.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {registrations.map((reg) => (
                          <div
                            key={reg.id}
                            className="flex flex-wrap items-center gap-3 rounded border p-2 text-sm"
                          >
                            <span className="font-medium">
                              {reg.profiles?.first_name ?? ""}{" "}
                              {reg.profiles?.last_name ?? ""}
                            </span>
                            <span className="text-muted-foreground">
                              {reg.profiles?.email ?? "—"}
                            </span>
                            <Badge
                              variant={
                                reg.status === "angemeldet"
                                  ? "success"
                                  : reg.status === "abgemeldet"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {reg.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(reg.registered_at).toLocaleDateString(
                                "de-CH"
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {events.length === 0 && !showCreate && (
        <p className="text-sm text-muted-foreground">Keine Events vorhanden.</p>
      )}
    </div>
  );
}
