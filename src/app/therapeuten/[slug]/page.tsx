import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TherapistMap } from "@/components/therapeuten/therapist-map";
import { ContactForm } from "@/components/therapeuten/contact-form";
import { ViewTracker } from "@/components/therapeuten/view-tracker";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  Award,
  Languages,
  Calendar,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, title, city, canton, bio, specializations")
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("approval_status", "approved")
    .is("deactivated_at", null)
    .single();

  if (!profile) {
    return { title: "Therapeut nicht gefunden" };
  }

  const name = `${profile.title ? profile.title + " " : ""}${profile.first_name} ${profile.last_name}`;
  const location = [profile.city, profile.canton].filter(Boolean).join(", ");

  return {
    title: `${name} — Hypnosetherapeut${location ? ` in ${location}` : ""}`,
    description: profile.bio?.slice(0, 160) || `${name} — qualifizierter Hypnosetherapeut beim VSH.`,
    openGraph: {
      title: `${name} — Hypnosetherapeut`,
      description: profile.bio?.slice(0, 160) || undefined,
      type: "profile",
    },
  };
}

export default async function TherapeutProfilPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("approval_status", "approved")
    .is("deactivated_at", null)
    .single();

  if (!profile) {
    notFound();
  }

  const name = `${profile.first_name} ${profile.last_name}`;
  const fullName = `${profile.title ? profile.title + " " : ""}${name}`;
  const location = [profile.city, profile.canton].filter(Boolean).join(", ");

  return (
    <div>
      <ViewTracker profileId={profile.id} />

      {/* Top bar */}
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
            <Link href="/therapeuten">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Zurück zur Suche
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <div className="flex gap-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-vsh-blue/5 text-3xl font-bold text-vsh-blue overflow-hidden sm:h-28 sm:w-28">
                {profile.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    {profile.first_name?.[0]}
                    {profile.last_name?.[0]}
                  </>
                )}
              </div>
              <div>
                {profile.title && (
                  <p className="text-sm text-muted-foreground">{profile.title}</p>
                )}
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                  {name}
                </h1>
                {location && (
                  <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {profile.street && <span>{profile.street}, </span>}
                    {[profile.zip, profile.city].filter(Boolean).join(" ")}
                    {profile.canton && `, ${profile.canton}`}
                  </p>
                )}

                {/* Badges */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-vsh-blue/5 px-3 py-1 text-xs font-medium text-vsh-blue">
                    <Award className="h-3.5 w-3.5" />
                    VSH-Mitglied
                  </span>
                  {profile.insurance_recognized && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-vsh-green/5 px-3 py-1 text-xs font-medium text-vsh-green">
                      <Shield className="h-3.5 w-3.5" />
                      Krankenkassen-anerkannt
                    </span>
                  )}
                  {profile.offers_online && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-vsh-gold/10 px-3 py-1 text-xs font-medium text-vsh-gold">
                      <Globe className="h-3.5 w-3.5" />
                      Online-Therapie
                    </span>
                  )}
                  {profile.is_verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-vsh-green/5 px-3 py-1 text-xs font-medium text-vsh-green">
                      Verifiziert
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <section>
                <h2 className="text-lg font-semibold text-foreground">Über mich</h2>
                <div className="mt-3 text-muted-foreground leading-relaxed whitespace-pre-line">
                  {profile.bio}
                </div>
              </section>
            )}

            {/* Specializations */}
            {profile.specializations && profile.specializations.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-foreground">Spezialisierungen</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.specializations.map((spec: string) => (
                    <Link
                      key={spec}
                      href={`/therapeuten?spezialisierung=${encodeURIComponent(spec)}`}
                      className="rounded-full border bg-white px-3 py-1.5 text-sm text-foreground transition-colors hover:border-vsh-blue hover:text-vsh-blue"
                    >
                      {spec}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {profile.certifications && profile.certifications.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-foreground">Zertifizierungen</h2>
                <div className="mt-3 space-y-2">
                  {profile.certifications.map((cert: string) => (
                    <div
                      key={cert}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Award className="h-4 w-4 text-vsh-gold" />
                      {cert}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery */}
            {profile.gallery_urls && profile.gallery_urls.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-foreground">Praxis</h2>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {profile.gallery_urls.map((url: string, i: number) => (
                    <div
                      key={i}
                      className="aspect-[4/3] overflow-hidden rounded-xl bg-muted"
                    >
                      <img
                        src={url}
                        alt={`Praxis ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Mini Map */}
            {profile.latitude && profile.longitude && (
              <section>
                <h2 className="text-lg font-semibold text-foreground">Standort</h2>
                <div className="mt-3">
                  <TherapistMap
                    therapists={[
                      {
                        id: profile.id,
                        slug: profile.slug,
                        first_name: profile.first_name,
                        last_name: profile.last_name,
                        city: profile.city,
                        canton: profile.canton,
                        latitude: profile.latitude,
                        longitude: profile.longitude,
                      },
                    ]}
                    center={{ lat: profile.latitude, lng: profile.longitude }}
                    zoom={14}
                    mini
                    className="h-64 w-full"
                  />
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info Card */}
            <Card className="rounded-2xl">
              <CardContent className="p-5 space-y-4">
                <h2 className="font-semibold text-foreground">Kontaktdaten</h2>

                {profile.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-vsh-blue" />
                    <a href={`tel:${profile.phone}`} className="text-foreground hover:text-vsh-blue">
                      {profile.phone}
                    </a>
                  </div>
                )}

                {profile.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-vsh-blue" />
                    <a href={`mailto:${profile.email}`} className="text-foreground hover:text-vsh-blue truncate">
                      {profile.email}
                    </a>
                  </div>
                )}

                {profile.website && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-4 w-4 text-vsh-blue" />
                    <a
                      href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-foreground hover:text-vsh-blue truncate"
                    >
                      {profile.website.replace(/^https?:\/\//, "")}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                )}

                {profile.languages && profile.languages.length > 0 && (
                  <div className="flex items-center gap-3 text-sm">
                    <Languages className="h-4 w-4 text-vsh-blue" />
                    <span className="text-muted-foreground">
                      {profile.languages
                        .map((l: string) => {
                          const map: Record<string, string> = {
                            de: "Deutsch",
                            fr: "Français",
                            it: "Italiano",
                            en: "English",
                          };
                          return map[l] || l;
                        })
                        .join(", ")}
                    </span>
                  </div>
                )}

                {profile.membership_since && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-vsh-blue" />
                    <span className="text-muted-foreground">
                      Mitglied seit{" "}
                      {new Date(profile.membership_since).toLocaleDateString("de-CH", {
                        year: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Form Card */}
            <Card className="rounded-2xl">
              <CardContent className="p-5">
                <h2 className="font-semibold text-foreground">
                  Nachricht an {profile.first_name}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ihre Anfrage wird direkt an den Therapeuten weitergeleitet.
                </p>
                <div className="mt-4">
                  <ContactForm
                    therapistId={profile.id}
                    therapistName={name}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Other therapists nearby CTA */}
            {profile.city && (
              <div className="rounded-2xl border bg-vsh-blue/5 p-5 text-center">
                <p className="text-sm font-medium text-foreground">
                  Weitere Therapeuten in {profile.city}?
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 rounded-xl"
                  asChild
                >
                  <Link href={`/therapeuten?q=${encodeURIComponent(profile.city)}`}>
                    Suche starten <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: fullName,
            jobTitle: "Hypnosetherapeut",
            description: profile.bio || undefined,
            image: profile.photo_url || undefined,
            telephone: profile.phone || undefined,
            email: profile.email || undefined,
            url: profile.website || undefined,
            address: {
              "@type": "PostalAddress",
              streetAddress: profile.street || undefined,
              postalCode: profile.zip || undefined,
              addressLocality: profile.city || undefined,
              addressRegion: profile.canton || undefined,
              addressCountry: "CH",
            },
            memberOf: {
              "@type": "Organization",
              name: "VSH — Verband Schweizer Hypnosetherapeuten",
              url: "https://v-s-h.ch",
            },
            knowsLanguage: profile.languages || undefined,
          }),
        }}
      />
    </div>
  );
}
