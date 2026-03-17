"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"magic-link" | "password">("magic-link");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const supabase = createClient();

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Prüfen Sie Ihre E-Mails! Wir haben Ihnen einen Anmeldelink gesendet.");
    }
    setLoading(false);
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push(redirectTo);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Anmelden</CardTitle>
          <CardDescription>
            Melden Sie sich mit Ihrer E-Mail-Adresse an
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mode Toggle */}
          <div className="mb-6 flex rounded-md border">
            <button
              type="button"
              className={`flex-1 rounded-l-md px-4 py-2 text-sm font-medium transition-colors ${
                mode === "magic-link"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              onClick={() => setMode("magic-link")}
            >
              Magic Link
            </button>
            <button
              type="button"
              className={`flex-1 rounded-r-md px-4 py-2 text-sm font-medium transition-colors ${
                mode === "password"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              onClick={() => setMode("password")}
            >
              Passwort
            </button>
          </div>

          <form
            onSubmit={mode === "magic-link" ? handleMagicLink : handlePasswordLogin}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.ch"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {mode === "password" && (
              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            {message && (
              <p className="text-sm text-green-600">{message}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Wird geladen..."
                : mode === "magic-link"
                ? "Magic Link senden"
                : "Anmelden"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
