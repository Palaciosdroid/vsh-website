"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

const CANTONS = [
  "ZH", "BE", "LU", "UR", "SZ", "OW", "NW", "GL", "ZG", "FR",
  "SO", "BS", "BL", "SH", "AR", "AI", "SG", "GR", "AG", "TG",
  "TI", "VD", "VS", "NE", "GE", "JU",
];

const LANGUAGES = [
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "it", label: "Italiano" },
  { value: "en", label: "English" },
];

interface ProfileFormProps {
  profile: Record<string, unknown> | null;
  specializations: { id: string; name_de: string }[];
  userId: string;
}

export function ProfileForm({ profile, specializations, userId }: ProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
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
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  function updateField(field: string, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleArrayItem(field: "languages" | "specializations", item: string) {
    setForm((prev) => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item],
      };
    });
  }

  function addCertification() {
    if (newCert.trim() && !form.certifications.includes(newCert.trim())) {
      setForm((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCert.trim()],
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

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      // Add cache buster
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      updateField("photo_url", publicUrl);
      setMessage({ type: "success", text: "Foto hochgeladen" });
    } catch (err) {
      console.error("Upload error:", err);
      setMessage({ type: "error", text: "Foto-Upload fehlgeschlagen" });
      setPhotoPreview(null);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      // Geocode address if city is set
      let latitude = profile?.latitude as number | null;
      let longitude = profile?.longitude as number | null;

      const addressChanged =
        form.street !== (profile?.street ?? "") ||
        form.zip !== (profile?.zip ?? "") ||
        form.city !== (profile?.city ?? "") ||
        form.canton !== (profile?.canton ?? "");

      if (form.city && addressChanged) {
        try {
          const geoRes = await fetch("/api/geocode", {
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
          const geoData = await geoRes.json();
          if (geoData.latitude && geoData.longitude) {
            latitude = geoData.latitude;
            longitude = geoData.longitude;
          }
        } catch {
          // Geocoding failed silently - keep existing coordinates
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

      setMessage({ type: "success", text: "Profil gespeichert!" });
      router.refresh();
    } catch (err) {
      console.error("Save error:", err);
      setMessage({ type: "error", text: "Speichern fehlgeschlagen. Bitte versuchen Sie es erneut." });
    } finally {
      setSaving(false);
    }
  }

  const slug = profile?.slug as string | null;

  return (
    <div className="space-y-8">
      {/* Status message */}
      {message && (
        <div
          className={`flex items-center gap-2 rounded-lg border p-4 text-sm ${
            message.type === "success"
              ? "border-vsh-green/30 bg-vsh-green/5 text-vsh-green"
              : "border-destructive/30 bg-destructive/5 text-destructive"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message.text}
        </div>
      )}

      {/* Preview link */}
      {slug && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" asChild>
            <a href={`/therapeuten/${slug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              Öffentliches Profil ansehen
            </a>
          </Button>
        </div>
      )}

      {/* Personal Data */}
      <Card>
        <CardHeader>
          <CardTitle>Persönliche Daten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Photo */}
          <div className="flex items-start gap-6">
            <div className="relative">
              {photoPreview || form.photo_url ? (
                <img
                  src={photoPreview || form.photo_url}
                  alt="Profilbild"
                  className="h-24 w-24 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted border-2 border-border">
                  <User className="h-10 w-10 text-muted-foreground" />
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
                <Upload className="mr-2 h-3.5 w-3.5" />
                Foto hochladen
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <p className="text-xs text-muted-foreground">JPG, PNG oder WebP. Max. 5 MB.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="title">Titel</Label>
              <Select
                id="title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
              >
                <option value="">Kein Titel</option>
                <option value="Dr.">Dr.</option>
                <option value="Dr. med.">Dr. med.</option>
                <option value="Prof.">Prof.</option>
                <option value="Prof. Dr.">Prof. Dr.</option>
                <option value="lic. phil.">lic. phil.</option>
                <option value="dipl.">dipl.</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="first_name">Vorname *</Label>
              <Input
                id="first_name"
                value={form.first_name}
                onChange={(e) => updateField("first_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Nachname *</Label>
              <Input
                id="last_name"
                value={form.last_name}
                onChange={(e) => updateField("last_name", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Über mich / Beschreibung</Label>
            <Textarea
              id="bio"
              value={form.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              rows={5}
              placeholder="Erzählen Sie potenziellen Klienten etwas über sich, Ihre Arbeitsweise und Ihren Ansatz..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Kontaktdaten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+41 ..."
              />
            </div>
          </div>
          <div>
            <Label htmlFor="website">Webseite</Label>
            <Input
              id="website"
              type="url"
              value={form.website}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>Praxis-Adresse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="street">Strasse</Label>
            <Input
              id="street"
              value={form.street}
              onChange={(e) => updateField("street", e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="zip">PLZ</Label>
              <Input
                id="zip"
                value={form.zip}
                onChange={(e) => updateField("zip", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="city">Stadt *</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="canton">Kanton</Label>
              <Select
                id="canton"
                value={form.canton}
                onChange={(e) => updateField("canton", e.target.value)}
              >
                <option value="">Kanton wählen</option>
                {CANTONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Die Adresse wird automatisch geocodiert, damit Ihr Standort auf der Karte angezeigt werden kann.
          </p>
        </CardContent>
      </Card>

      {/* Practice Details */}
      <Card>
        <CardHeader>
          <CardTitle>Praxis-Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Specializations */}
          <div>
            <Label>Spezialisierungen</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {specializations.map((s) => {
                const checked = form.specializations.includes(s.name_de);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleArrayItem("specializations", s.name_de)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      checked
                        ? "border-vsh-blue bg-vsh-blue/10 text-vsh-blue"
                        : "border-border text-muted-foreground hover:border-vsh-blue/50"
                    }`}
                  >
                    {s.name_de}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Languages */}
          <div>
            <Label>Sprachen</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => {
                const checked = form.languages.includes(lang.value);
                return (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => toggleArrayItem("languages", lang.value)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      checked
                        ? "border-vsh-blue bg-vsh-blue/10 text-vsh-blue"
                        : "border-border text-muted-foreground hover:border-vsh-blue/50"
                    }`}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <Label>Zertifizierungen / Ausbildungen</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.certifications.map((cert) => (
                <Badge key={cert} variant="secondary" className="gap-1">
                  {cert}
                  <button type="button" onClick={() => removeCertification(cert)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <Input
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                placeholder="Zertifizierung hinzufügen..."
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
              />
              <Button type="button" variant="outline" size="icon" onClick={addCertification}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Switches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Krankenkassen-Anerkennung</Label>
                <p className="text-xs text-muted-foreground">Werden Sie von Zusatzversicherungen anerkannt?</p>
              </div>
              <Switch
                checked={form.insurance_recognized}
                onCheckedChange={(val) => updateField("insurance_recognized", val)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Online-Sitzungen</Label>
                <p className="text-xs text-muted-foreground">Bieten Sie Online-Therapiesitzungen an?</p>
              </div>
              <Switch
                checked={form.offers_online}
                onCheckedChange={(val) => updateField("offers_online", val)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profil-Einstellungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Profil veröffentlichen</Label>
              <p className="text-xs text-muted-foreground">
                Wenn aktiviert, ist Ihr Profil im Therapeuten-Verzeichnis sichtbar (nach Freischaltung).
              </p>
            </div>
            <Switch
              checked={form.is_published}
              onCheckedChange={(val) => updateField("is_published", val)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-vsh-blue hover:bg-vsh-blue-light text-white"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Speichern...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Profil speichern
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
