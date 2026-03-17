"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SettingsFormProps {
  email: string;
  userId: string;
  notificationContactEmail: boolean;
  notificationEventReminder: boolean;
  notificationNews: boolean;
}

type Status = { type: "success" | "error"; message: string } | null;

/* ------------------------------------------------------------------ */
/*  Inline status banner                                               */
/* ------------------------------------------------------------------ */

function StatusMessage({ status }: { status: Status }) {
  if (!status) return null;
  return (
    <p
      className={`mt-4 rounded-md px-4 py-2 text-sm ${
        status.type === "success"
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-red-50 text-red-700 border border-red-200"
      }`}
    >
      {status.message}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SettingsForm({
  email,
  userId,
  notificationContactEmail,
  notificationEventReminder,
  notificationNews,
}: SettingsFormProps) {
  const supabase = createClient();

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<Status>(null);

  // Email state
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<Status>(null);

  // Notification state
  const [contactEmail, setContactEmail] = useState(notificationContactEmail);
  const [eventReminder, setEventReminder] = useState(
    notificationEventReminder
  );
  const [news, setNews] = useState(notificationNews);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifStatus, setNotifStatus] = useState<Status>(null);

  /* ---- Password ---- */

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 8) {
      setPasswordStatus({
        type: "error",
        message: "Das Passwort muss mindestens 8 Zeichen lang sein.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: "error",
        message: "Die Passwörter stimmen nicht überein.",
      });
      return;
    }

    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setPasswordLoading(false);

    if (error) {
      setPasswordStatus({ type: "error", message: error.message });
    } else {
      setPasswordStatus({
        type: "success",
        message: "Ihr Passwort wurde erfolgreich geändert.",
      });
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  /* ---- Email ---- */

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailStatus(null);

    if (!newEmail || newEmail === email) {
      setEmailStatus({
        type: "error",
        message: "Bitte geben Sie eine neue E-Mail-Adresse ein.",
      });
      return;
    }

    setEmailLoading(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setEmailLoading(false);

    if (error) {
      setEmailStatus({ type: "error", message: error.message });
    } else {
      setEmailStatus({
        type: "success",
        message:
          "Eine Bestätigungs-E-Mail wurde an Ihre neue Adresse gesendet. Bitte bestätigen Sie die Änderung über den enthaltenen Link.",
      });
      setNewEmail("");
    }
  }

  /* ---- Notifications ---- */

  async function handleNotificationsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotifStatus(null);
    setNotifLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        notification_contact_email: contactEmail,
        notification_event_reminder: eventReminder,
        notification_news: news,
      })
      .eq("id", userId);

    setNotifLoading(false);

    if (error) {
      setNotifStatus({ type: "error", message: error.message });
    } else {
      setNotifStatus({
        type: "success",
        message: "Benachrichtigungseinstellungen gespeichert.",
      });
    }
  }

  /* ---- Render ---- */

  return (
    <div className="space-y-8">
      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5" />
            Passwort ändern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Neues Passwort</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Mindestens 8 Zeichen"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Passwort bestätigen</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Passwort wiederholen"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading ? "Wird gespeichert …" : "Passwort ändern"}
            </Button>

            <StatusMessage status={passwordStatus} />
          </form>
        </CardContent>
      </Card>

      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5" />
            E-Mail ändern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-email">Aktuelle E-Mail</Label>
              <Input
                id="current-email"
                type="email"
                value={email}
                disabled
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-email">Neue E-Mail-Adresse</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="neue@adresse.de"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>

            <p className="text-sm text-muted-foreground">
              Nach dem Absenden erhalten Sie eine Bestätigungs-E-Mail an die
              neue Adresse.
            </p>

            <Button type="submit" disabled={emailLoading}>
              {emailLoading ? "Wird gespeichert …" : "E-Mail ändern"}
            </Button>

            <StatusMessage status={emailStatus} />
          </form>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            Benachrichtigungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNotificationsSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notif-contact">
                  Kontaktanfragen per E-Mail
                </Label>
                <p className="text-sm text-muted-foreground">
                  Erhalten Sie eine E-Mail, wenn jemand Sie kontaktiert.
                </p>
              </div>
              <Switch
                id="notif-contact"
                checked={contactEmail}
                onCheckedChange={setContactEmail}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notif-events">Termin-Erinnerungen</Label>
                <p className="text-sm text-muted-foreground">
                  Erhalten Sie Erinnerungen vor anstehenden Terminen.
                </p>
              </div>
              <Switch
                id="notif-events"
                checked={eventReminder}
                onCheckedChange={setEventReminder}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notif-news">News &amp; Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Bleiben Sie über Neuigkeiten und Änderungen informiert.
                </p>
              </div>
              <Switch
                id="notif-news"
                checked={news}
                onCheckedChange={setNews}
              />
            </div>

            <Button type="submit" disabled={notifLoading}>
              {notifLoading
                ? "Wird gespeichert …"
                : "Einstellungen speichern"}
            </Button>

            <StatusMessage status={notifStatus} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
