"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Save,
  Upload,
  ExternalLink,
  X,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Settings,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SWISS_CANTONS = [
  { value: "ZH", label: "Zürich" },
  { value: "BE", label: "Bern" },
  { value: "LU", label: "Luzern" },
  { value: "UR", label: "Uri" },
  { value: "SZ", label: "Schwyz" },
  { value: "OW", label: "Obwalden" },
  { value: "NW", label: "Nidwalden" },
  { value: "GL", label: "Glarus" },
  { value: "ZG", label: "Zug" },
  { value: "FR", label: "Freiburg" },
  { value: "SO", label: "Solothurn" },
  { value: "BS", label: "Basel-Stadt" },
  { value: "BL", label: "Basel-Landschaft" },
  { value: "SH", label: "Schaffhausen" },
  { value: "AR", label: "Appenzell Ausserrhoden" },
  { value: "AI", label: "Appenzell Innerrhoden" },
  { value: "SG", label: "St. Gallen" },
  { value: "GR", label: "Graubünden" },
  { value: "AG", label: "Aargau" },
  { value: "TG", label: "Thurgau" },
  { value: "TI", label: "Tessin" },
  { value: "VD", label: "Waadt" },
  { value: "VS", label: "Wallis" },
  { value: "NE", label: "Neuenburg" },
  { value: "GE", label: "Genf" },
  { value: "JU", label: "Jura" },
] as const;

const LANGUAGES = [
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Französisch" },
  { value: "it", label: "Italienisch" },
  { value: "en", label: "Englisch" },
] as const;

const TITLE_OPTIONS = [
  "",
  "Dr.",
  "Dr. med.",
  "Prof.",
  "Prof. Dr.",
  "lic. phil.",
  "dipl.",
  "MSc",
  "MA",
] as const;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Specialization {
  id: string;
  name_de: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Profile = Record<string, any> | null;

interface ProfileFormProps {
  profile: Profile;
  specializations: Specialization[];
  userId: string;
}

type Status = { type: "success" | "error"; message: string } | null;

/* ------------------------------------------------------------------ */
/*  Status banner                                                      */
/* ------------------------------------------------------------------ */

function StatusMessage({ status }: { status: Status }) {
  if (!status) return null;
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border p-4 text-sm ${
        status.type === "success"
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {status.type === "success" ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0" />
      )}
      {status.message}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ProfileForm({
  profile,
  specializations,
  userId,
}: ProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---- Form state ---- */

  const [form, setForm] = useState({
    title: (profile?.title as string) ?? "",
    first_name: (profile?.first_name as string) ?? "",
    last_name: (profile?.last_name as string) ?? "",
    bio: (profile?.bio as string) ?? "",
    photo_url: (profile?.photo_url as string) ?? "",
    email: (profile?.email as string) ?? "",
    phone: (profile?.phone as string) ?? "",
    website: (profile?.website as string) ?? "",
    street: (profile?.street as string) ?? "",
    zip: (profile?.zip as string) ?? "",
    city: (profile?.city as string) ?? "",
    canton: (profile?.canton as string) ?? "",
    country: (profile?.country as string) ?? "CH",
    languages: (profile?.languages as string[]) ?? ["de"],
    specializations: (profile?.specializations as string[]) ?? [],
    certifications: (profile?.certifications as string[]) ?? [],
    insurance_recognized: (profile?.insurance_recognized as boolean) ?? false,
    offers_online: (profile?.offers_online as boolean) ?? false,
    is_published: (profile?.is_published as boolean) ?? false,
  });

  const [newCert, setNewCert] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Store initial address to detect changes
  const initialAddressRef = useRef({
    street: form.street,
    zip: form.zip,
    city: form.city,
    canton: form.canton,
    country: form.country,
  });

  const slug = profile?.slug as string | null;

  // Auto-dismiss status message
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  /* ---- Helpers ---- */

  function updateField(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleArrayItem(
    field: "languages" | "specializations",
    item: string
  ) {
    setForm((prev) => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(item)
          ? arr.filter((v) => v !== item)
          : [...arr, item],
      };
    });
  }

  function addCertification() {
    const trimmed = newCert.trim();
    if (trimmed && !form.certifications.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        certifications: [...prev.certifications, trimmed],
      }));
      setNewCert("");
    }
  }

  function removeCertification(cert: string) {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== cert),
    }));
  }

  /* ---- Photo handling ---- */

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setStatus({
        type: "error",
        message: "Bitte wählen Sie eine Bilddatei aus.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus({
        type: "error",
        message: "Das Bild darf maximal 5 MB gross sein.",
      });
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    uploadPhoto(file);
  }

  async function uploadPhoto(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      // Cache buster to show updated image
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      updateField("photo_url", publicUrl);
      setStatus({ type: "success", message: "Foto erfolgreich hochgeladen." });
    } catch (err) {
      console.error("Upload error:", err);
      setStatus({ type: "error", message: "Foto-Upload fehlgeschlagen." });
      setPhotoPreview(null);
    } finally {
      setUploading(false);
    }
  }

  /* ---- Geocoding ---- */

  function addressChanged(): boolean {
    const initial = initialAddressRef.current;
    return (
      form.street !== initial.street ||
      form.zip !== initial.zip ||
      form.city !== initial.city ||
      form.canton !== initial.canton ||
      form.country !== initial.country
    );
  }

  async function geocodeAddress(): Promise<{
    lat: number;
    lng: number;
  } | null> {
    if (!form.street || !form.zip || !form.city) return null;

    try {
      const res = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          street: form.street,
          zip: form.zip,
          city: form.city,
          canton: form.canton,
          country: form.country,
        }),
      });

      if (!res.ok) return null;

      const data = await res.json();
      if (data.latitude && data.longitude) {
        return { lat: data.latitude, lng: data.longitude };
      }
      return null;
    } catch {
      return null;
    }
  }

  /* ---- Save ---- */

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      // Geocode if address changed
      let latitude = profile?.latitude as number | null;
      let longitude = profile?.longitude as number | null;

      if (form.city && addressChanged()) {
        const coords = await geocodeAddress();
        if (coords) {
          latitude = coords.lat;
          longitude = coords.lng;
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          title: form.title || null,
          first_name: form.first_name || null,
          last_name: form.last_name || null,
          bio: form.bio || null,
          photo_url: form.photo_url || null,
          email: form.email || null,
          phone: form.phone || null,
          website: form.website || null,
          street: form.street || null,
          zip: form.zip || null,
          city: form.city || null,
          canton: form.canton || null,
          country: form.country || "CH",
          languages: form.languages,
          specializations: form.specializations,
          certifications: form.certifications,
          insurance_recognized: form.insurance_recognized,
          offers_online: form.offers_online,
          is_published: form.is_published,
          latitude,
          longitude,
        })
        .eq("id", userId);

      if (error) throw error;

      // Update initial address ref after successful save
      initialAddressRef.current = {
        street: form.street,
        zip: form.zip,
        city: form.city,
        canton: form.canton,
        country: form.country,
      };

      setStatus({
        type: "success",
        message: "Ihr Profil wurde erfolgreich gespeichert.",
      });
      router.refresh();
    } catch (err) {
      console.error("Save error:", err);
      setStatus({
        type: "error",
        message:
          "Beim Speichern ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
      });
    } finally {
      setSaving(false);
    }
  }

  /* ---- Render ---- */

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Status message */}
      <StatusMessage status={status} />

      {/* Preview link */}
      {slug && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/therapeuten/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              Öffentliches Profil ansehen
            </Link>
          </Button>
        </div>
      )}

      {/* ---- Persönliche Daten ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Persönliche Daten
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Photo upload */}
          <div className="space-y-2">
            <Label>Profilfoto</Label>
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-muted bg-muted">
                {photoPreview || form.photo_url ? (
                  <img
                    src={photoPreview || form.photo_url}
                    alt="Profilfoto"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-10 w-10" />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="mr-1 h-4 w-4" />
                  {form.photo_url || photoPreview
                    ? "Foto ändern"
                    : "Foto hochladen"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
                <p className="text-xs text-muted-foreground">
                  JPG, PNG oder WebP, max. 5 MB
                </p>
              </div>
            </div>
          </div>

          {/* Title, First Name, Last Name */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="title">Titel</Label>
              <Select
                id="title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
              >
                <option value="">Kein Titel</option>
                {TITLE_OPTIONS.filter(Boolean).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="first_name">Vorname *</Label>
              <Input
                id="first_name"
                value={form.first_name}
                onChange={(e) => updateField("first_name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nachname *</Label>
              <Input
                id="last_name"
                value={form.last_name}
                onChange={(e) => updateField("last_name", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Über mich / Beschreibung</Label>
            <Textarea
              id="bio"
              value={form.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              rows={5}
              placeholder="Erzählen Sie potenziellen Klienten etwas über sich, Ihre Arbeitsweise und Ihren Ansatz ..."
            />
            <p className="text-xs text-muted-foreground">
              Wird auf Ihrem öffentlichen Profil angezeigt.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ---- Kontaktdaten ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="h-5 w-5" />
            Kontaktdaten
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail-Adresse *</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+41 ..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={form.website}
                onChange={(e) => updateField("website", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---- Adresse ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            Adresse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Strasse</Label>
            <Input
              id="street"
              value={form.street}
              onChange={(e) => updateField("street", e.target.value)}
              placeholder="Musterstrasse 1"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="zip">PLZ</Label>
              <Input
                id="zip"
                value={form.zip}
                onChange={(e) => updateField("zip", e.target.value)}
                placeholder="8000"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="city">Ort</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Zürich"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="canton">Kanton</Label>
              <Select
                id="canton"
                value={form.canton}
                onChange={(e) => updateField("canton", e.target.value)}
              >
                <option value="">Kanton wählen</option>
                {SWISS_CANTONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label} ({c.value})
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Land</Label>
              <Input
                id="country"
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                placeholder="CH"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Die Adresse wird beim Speichern automatisch geocodiert, damit Ihr
            Standort auf der Karte angezeigt werden kann.
          </p>
        </CardContent>
      </Card>

      {/* ---- Praxis-Details ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="h-5 w-5" />
            Praxis-Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Specializations */}
          <div className="space-y-3">
            <Label>Spezialisierungen</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {specializations.map((spec) => {
                const checked = form.specializations.includes(spec.name_de);
                return (
                  <label
                    key={spec.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted ${
                      checked
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        toggleArrayItem("specializations", spec.name_de)
                      }
                      className="h-4 w-4 rounded border-input accent-primary"
                    />
                    {spec.name_de}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-3">
            <Label>Sprachen</Label>
            <div className="flex flex-wrap gap-3">
              {LANGUAGES.map((lang) => {
                const checked = form.languages.includes(lang.value);
                return (
                  <label
                    key={lang.value}
                    className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted ${
                      checked
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayItem("languages", lang.value)}
                      className="h-4 w-4 rounded border-input accent-primary"
                    />
                    {lang.label}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-3">
            <Label>Zertifizierungen / Ausbildungen</Label>
            {form.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-sm"
                  >
                    {cert}
                    <button
                      type="button"
                      onClick={() => removeCertification(cert)}
                      className="ml-1 rounded-full p-0.5 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                placeholder="Zertifizierung hinzufügen ..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCertification();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addCertification}
                disabled={!newCert.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Insurance & Online switches */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="insurance_recognized">
                  Krankenkassen-anerkannt
                </Label>
                <p className="text-sm text-muted-foreground">
                  Wird die Behandlung von Zusatzversicherungen übernommen?
                </p>
              </div>
              <Switch
                id="insurance_recognized"
                checked={form.insurance_recognized}
                onCheckedChange={(val) =>
                  updateField("insurance_recognized", val)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="offers_online">Online-Therapie</Label>
                <p className="text-sm text-muted-foreground">
                  Bieten Sie auch Online-Sitzungen an?
                </p>
              </div>
              <Switch
                id="offers_online"
                checked={form.offers_online}
                onCheckedChange={(val) => updateField("offers_online", val)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---- Profil-Einstellungen ---- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5" />
            Profil-Einstellungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_published">Profil veröffentlichen</Label>
              <p className="text-sm text-muted-foreground">
                Wenn aktiviert, ist Ihr Profil im Therapeuten-Verzeichnis
                sichtbar (nach Freischaltung).
              </p>
            </div>
            <Switch
              id="is_published"
              checked={form.is_published}
              onCheckedChange={(val) => updateField("is_published", val)}
            />
          </div>
        </CardContent>
      </Card>

      {/* ---- Actions ---- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <Button type="submit" disabled={saving || uploading}>
            {saving ? (
              <>
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                Wird gespeichert ...
              </>
            ) : (
              <>
                <Save className="mr-1 h-4 w-4" />
                Profil speichern
              </>
            )}
          </Button>

          {slug && (
            <Button type="button" variant="outline" asChild>
              <Link
                href={`/therapeuten/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-1 h-4 w-4" />
                Vorschau
              </Link>
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Mit * markierte Felder sind Pflichtfelder.
        </p>
      </div>

      {/* Bottom status (visible when scrolled to bottom) */}
      <StatusMessage status={status} />
    </form>
  );
}
