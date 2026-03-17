"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Calendar, MapPin, Globe, Clock, Users, ChevronRight } from "lucide-react";

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

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
  cost: number | null;
  cost_info: string | null;
  registration_deadline: string | null;
  max_participants: number | null;
  is_published: boolean;
}

interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  status: "angemeldet" | "warteliste" | "abgesagt";
  created_at: string;
}

interface EventsListProps {
  events: Event[];
  registrations: Registration[];
  registrationCounts: Record<string, number>;
  userId: string;
}

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

const EVENT_TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  gv: { label: "GV", color: "bg-blue-100 text-blue-800" },
  workshop: { label: "Workshop", color: "bg-amber-100 text-amber-800" },
  weiterbildung: { label: "Weiterbildung", color: "bg-green-100 text-green-800" },
  stammtisch: { label: "Stammtisch", color: "bg-purple-100 text-purple-800" },
  sonstiges: { label: "Sonstiges", color: "bg-gray-100 text-gray-700" },
};

const TAB_OPTIONS = [
  { value: "alle", label: "Alle" },
  { value: "gv", label: "GV" },
  { value: "workshop", label: "Workshop" },
  { value: "weiterbildung", label: "Weiterbildung" },
  { value: "stammtisch", label: "Stammtisch" },
  { value: "sonstiges", label: "Sonstiges" },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("de-CH", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("de-CH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateRange(start: string, end: string | null): string {
  const startDate = formatDate(start);
  const startTime = formatTime(start);

  if (!end) return `${startDate}, ${startTime}`;

  const endDate = formatDate(end);
  const endTime = formatTime(end);

  if (startDate === endDate) {
    return `${startDate}, ${startTime} – ${endTime}`;
  }
  return `${startDate}, ${startTime} – ${endDate}, ${endTime}`;
}

function isInFuture(dateStr: string): boolean {
  return new Date(dateStr) > new Date();
}

function isBeforeDeadline(deadline: string | null): boolean {
  if (!deadline) return true;
  return new Date(deadline) > new Date();
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

export function EventsList({ events, registrations, registrationCounts, userId }: EventsListProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("alle");
  const [futureOnly, setFutureOnly] = useState(true);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);

  // Build a lookup of user registrations by event_id
  const userRegMap = new Map<string, Registration>();
  for (const reg of registrations) {
    userRegMap.set(reg.event_id, reg);
  }

  // Filter events
  const filteredEvents = events.filter((event) => {
    if (activeTab !== "alle" && event.event_type !== activeTab) return false;
    if (futureOnly && !isInFuture(event.start_date)) return false;
    return true;
  });

  // ---- Registration actions ----

  async function handleRegister(event: Event) {
    setLoadingEventId(event.id);

    const registeredCount = registrationCounts[event.id] ?? 0;
    const isFull = event.max_participants != null && registeredCount >= event.max_participants;
    const status = isFull ? "warteliste" : "angemeldet";

    await supabase.from("event_registrations").insert({
      event_id: event.id,
      user_id: userId,
      status,
    });

    setLoadingEventId(null);
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleCancel(event: Event) {
    setLoadingEventId(event.id);

    const reg = userRegMap.get(event.id);
    if (reg) {
      await supabase
        .from("event_registrations")
        .update({ status: "abgesagt" })
        .eq("id", reg.id);
    }

    setLoadingEventId(null);
    startTransition(() => {
      router.refresh();
    });
  }

  // ---- Render helpers ----

  function renderStatusBadge(status: Registration["status"]) {
    switch (status) {
      case "angemeldet":
        return <Badge variant="success">Angemeldet</Badge>;
      case "warteliste":
        return <Badge variant="warning">Warteliste</Badge>;
      case "abgesagt":
        return <Badge variant="destructive">Abgesagt</Badge>;
    }
  }

  function renderEventTypeBadge(type: string) {
    const config = EVENT_TYPE_CONFIG[type] ?? EVENT_TYPE_CONFIG.sonstiges;
    return (
      <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  }

  function renderActionButton(event: Event) {
    const reg = userRegMap.get(event.id);
    const isLoading = loadingEventId === event.id;

    // Already registered (angemeldet or warteliste) → show cancel button
    if (reg && (reg.status === "angemeldet" || reg.status === "warteliste")) {
      return (
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading || isPending}
          onClick={() => handleCancel(event)}
        >
          {isLoading ? "Wird abgemeldet..." : "Abmelden"}
        </Button>
      );
    }

    // Check deadline
    if (!isBeforeDeadline(event.registration_deadline)) {
      return (
        <Button variant="outline" size="sm" disabled>
          Anmeldefrist abgelaufen
        </Button>
      );
    }

    const registeredCount = registrationCounts[event.id] ?? 0;
    const isFull = event.max_participants != null && registeredCount >= event.max_participants;

    return (
      <Button
        size="sm"
        disabled={isLoading || isPending}
        onClick={() => handleRegister(event)}
      >
        {isLoading
          ? "Wird angemeldet..."
          : isFull
            ? "Auf Warteliste setzen"
            : "Anmelden"}
        {!isLoading && <ChevronRight className="ml-1 h-4 w-4" />}
      </Button>
    );
  }

  // ---- Main render ----

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap">
            {TAB_OPTIONS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Switch checked={futureOnly} onCheckedChange={setFutureOnly} />
          Nur zukünftige
        </label>
      </div>

      {/* Events grid */}
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">
              Keine Termine vorhanden
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => {
            const reg = userRegMap.get(event.id);
            const registeredCount = registrationCounts[event.id] ?? 0;

            return (
              <Card key={event.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    {renderEventTypeBadge(event.event_type)}
                  </div>
                  {event.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {event.description}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="flex-1 space-y-3 text-sm">
                  {/* Date & time */}
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{formatDateRange(event.start_date, event.end_date)}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2">
                    {event.is_online ? (
                      <>
                        <Globe className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>Online</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>
                          {event.location_name}
                          {event.location_address && (
                            <span className="block text-muted-foreground">
                              {event.location_address}
                            </span>
                          )}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Spots */}
                  {event.max_participants != null && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>
                        {registeredCount} von {event.max_participants} Plätze belegt
                      </span>
                    </div>
                  )}

                  {/* Cost */}
                  {(event.cost != null || event.cost_info) && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {event.cost != null
                          ? event.cost === 0
                            ? "Kostenlos"
                            : `CHF ${event.cost.toFixed(2)}`
                          : null}
                      </span>
                      {event.cost_info && <span>· {event.cost_info}</span>}
                    </div>
                  )}

                  {/* Registration deadline */}
                  {event.registration_deadline && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>Anmeldefrist: {formatDate(event.registration_deadline)}</span>
                    </div>
                  )}

                  {/* User registration status */}
                  {reg && (
                    <div className="pt-1">
                      {renderStatusBadge(reg.status)}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="border-t pt-4">
                  {renderActionButton(event)}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
