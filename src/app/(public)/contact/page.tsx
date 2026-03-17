"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error: insertError } = await supabase.from("contact_requests").insert({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      subject: (formData.get("subject") as string) || null,
      message: formData.get("message") as string,
    });

    if (insertError) {
      setError("Ihre Nachricht konnte leider nicht gesendet werden. Bitte versuchen Sie es erneut.");
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-lg">
          <CardContent className="py-10 text-center">
            <h2 className="text-2xl font-bold">Vielen Dank!</h2>
            <p className="mt-2 text-muted-foreground">
              Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Kontakt</CardTitle>
            <CardDescription>
              Haben Sie Fragen oder Anregungen? Schreiben Sie uns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail *</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" name="phone" type="tel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Betreff</Label>
                <Input id="subject" name="subject" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Nachricht *</Label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Wird gesendet..." : "Nachricht senden"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
