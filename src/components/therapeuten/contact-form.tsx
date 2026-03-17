"use client";

import { useState, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Send } from "lucide-react";

const HCAPTCHA_SITEKEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY;

interface ContactFormProps {
  therapistId: string;
  therapistName: string;
}

export function ContactForm({ therapistId, therapistName }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          therapistId,
          senderName: formData.get("name") as string,
          senderEmail: formData.get("email") as string,
          senderPhone: (formData.get("phone") as string) || null,
          message: formData.get("message") as string,
          captchaToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Nachricht konnte nicht gesendet werden.");
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Netzwerkfehler. Bitte versuchen Sie es erneut.");
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-vsh-green/10">
          <CheckCircle className="h-7 w-7 text-vsh-green" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-foreground">Nachricht gesendet!</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Ihre Nachricht an {therapistName} wurde erfolgreich übermittelt.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 rounded-xl"
          onClick={() => {
            setSuccess(false);
            setCaptchaToken(null);
          }}
        >
          Weitere Nachricht senden
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name *</Label>
          <Input id="contact-name" name="name" required className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">E-Mail *</Label>
          <Input id="contact-email" name="email" type="email" required className="rounded-xl" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-phone">Telefon (optional)</Label>
        <Input id="contact-phone" name="phone" type="tel" className="rounded-xl" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Nachricht *</Label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder={`Nachricht an ${therapistName}...`}
        />
      </div>

      {HCAPTCHA_SITEKEY && (
        <div>
          <HCaptcha
            ref={captchaRef}
            sitekey={HCAPTCHA_SITEKEY}
            onVerify={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken(null)}
          />
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-destructive/5 p-3 text-sm text-destructive">{error}</p>
      )}

      <Button
        type="submit"
        className="w-full rounded-xl bg-vsh-blue hover:bg-vsh-blue-light"
        disabled={loading || (!!HCAPTCHA_SITEKEY && !captchaToken)}
      >
        {loading ? (
          "Wird gesendet..."
        ) : (
          <>
            Nachricht senden <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
