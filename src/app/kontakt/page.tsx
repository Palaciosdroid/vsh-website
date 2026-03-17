"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone, CheckCircle, Send } from "lucide-react";

export default function KontaktPage() {
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
      sender_name: formData.get("name") as string,
      sender_email: formData.get("email") as string,
      sender_phone: (formData.get("phone") as string) || null,
      message: formData.get("message") as string,
    });

    if (insertError) {
      setError("Ihre Nachricht konnte leider nicht gesendet werden. Bitte versuchen Sie es erneut.");
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold-light">
              Kontakt
            </p>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              Sprechen Sie mit uns
            </h1>
            <p className="mt-6 text-lg text-white/75">
              Haben Sie Fragen zum Verband, zur Mitgliedschaft oder zur Hypnosetherapie?
              Wir helfen Ihnen gerne weiter.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-5">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-foreground">Kontaktdaten</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Wir freuen uns auf Ihre Nachricht.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vsh-blue/5 text-vsh-blue">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">E-Mail</p>
                    <p className="text-sm text-muted-foreground">info@v-s-h.ch</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vsh-blue/5 text-vsh-blue">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Adresse</p>
                    <p className="text-sm text-muted-foreground">
                      Verband Schweizer Hypnosetherapeuten<br />
                      Schweiz
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vsh-blue/5 text-vsh-blue">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Telefon</p>
                    <p className="text-sm text-muted-foreground">Auf Anfrage</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border bg-vsh-blue/5 p-5">
                <p className="text-sm font-medium text-foreground">Tipp</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Schauen Sie auch in unsere{" "}
                  <Link href="/faq" className="text-vsh-blue underline underline-offset-2">
                    FAQ-Seite
                  </Link>{" "}
                  — vielleicht finden Sie dort bereits die Antwort auf Ihre Frage.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {success ? (
                <Card className="rounded-2xl">
                  <CardContent className="flex flex-col items-center py-16 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-vsh-green/10">
                      <CheckCircle className="h-8 w-8 text-vsh-green" />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold text-foreground">Vielen Dank!</h2>
                    <p className="mt-2 text-muted-foreground">
                      Ihre Nachricht wurde erfolgreich gesendet.<br />
                      Wir melden uns in Kürze bei Ihnen.
                    </p>
                    <Button variant="outline" className="mt-6 rounded-xl" onClick={() => setSuccess(false)}>
                      Weitere Nachricht senden
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-2xl">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-foreground">Nachricht senden</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Füllen Sie das Formular aus und wir melden uns bei Ihnen.
                    </p>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name *</Label>
                          <Input id="name" name="name" required className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-Mail *</Label>
                          <Input id="email" name="email" type="email" required className="rounded-xl" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon (optional)</Label>
                        <Input id="phone" name="phone" type="tel" className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Nachricht *</Label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          placeholder="Wie können wir Ihnen helfen?"
                        />
                      </div>
                      {error && (
                        <p className="rounded-lg bg-destructive/5 p-3 text-sm text-destructive">
                          {error}
                        </p>
                      )}
                      <Button
                        type="submit"
                        className="w-full rounded-xl bg-vsh-blue hover:bg-vsh-blue-light"
                        disabled={loading}
                      >
                        {loading ? (
                          "Wird gesendet..."
                        ) : (
                          <>
                            Nachricht senden
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
