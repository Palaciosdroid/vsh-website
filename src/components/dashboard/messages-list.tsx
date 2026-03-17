"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mail, Phone, ChevronDown, ChevronUp } from "lucide-react";

interface ContactRequest {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface MessagesListProps {
  initialMessages: ContactRequest[];
}

export function MessagesList({ initialMessages }: MessagesListProps) {
  const [messages, setMessages] = useState<ContactRequest[]>(initialMessages);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const supabase = createClient();

  const unreadCount = messages.filter((m) => !m.is_read).length;

  async function markAsRead(id: string) {
    const message = messages.find((m) => m.id === id);
    if (!message || message.is_read) return;

    await supabase
      .from("contact_requests")
      .update({ is_read: true })
      .eq("id", id);

    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
    );
  }

  function handleToggle(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      markAsRead(id);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function MessageCard({ message }: { message: ContactRequest }) {
    const isExpanded = expandedId === message.id;

    return (
      <Card
        className={`cursor-pointer transition-colors ${
          !message.is_read ? "bg-vsh-blue/[0.03] border-vsh-blue/20" : ""
        }`}
        onClick={() => handleToggle(message.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Unread indicator */}
            <div className="mt-2 flex shrink-0">
              {!message.is_read && (
                <span className="h-2.5 w-2.5 rounded-full bg-vsh-blue" />
              )}
              {message.is_read && <span className="h-2.5 w-2.5" />}
            </div>

            <div className="min-w-0 flex-1">
              {/* Header row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm ${
                      !message.is_read ? "font-semibold" : "font-medium"
                    } text-vsh-text`}
                  >
                    {message.sender_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(message.created_at)}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </div>

              {/* Preview (collapsed) */}
              {!isExpanded && (
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {message.message}
                </p>
              )}

              {/* Expanded content */}
              {isExpanded && (
                <div className="mt-3 space-y-3">
                  <p className="whitespace-pre-wrap text-sm text-vsh-text">
                    {message.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {message.sender_email}
                    </span>
                    {message.sender_phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {message.sender_phone}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      asChild
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                      <a
                        href={`mailto:${message.sender_email}?subject=Ihre Kontaktanfrage`}
                      >
                        <Mail className="mr-1.5 h-3.5 w-3.5" />
                        Antworten
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const allMessages = messages;
  const unreadMessages = messages.filter((m) => !m.is_read);

  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Mail className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">
            Keine Nachrichten vorhanden
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Unread badge */}
      {unreadCount > 0 && (
        <Badge variant="secondary" className="bg-vsh-blue/10 text-vsh-blue">
          {unreadCount} ungelesen
        </Badge>
      )}

      <Tabs defaultValue="alle">
        <TabsList>
          <TabsTrigger value="alle">Alle</TabsTrigger>
          <TabsTrigger value="ungelesen">
            Ungelesen
            {unreadCount > 0 && (
              <span className="ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-vsh-blue text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alle" className="mt-4 space-y-3">
          {allMessages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </TabsContent>

        <TabsContent value="ungelesen" className="mt-4 space-y-3">
          {unreadMessages.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Keine ungelesenen Nachrichten
              </CardContent>
            </Card>
          ) : (
            unreadMessages.map((message) => (
              <MessageCard key={message.id} message={message} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
