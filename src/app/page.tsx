import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import {
  Search,
  Users,
  MapPin,
  Award,
  Cigarette,
  Brain,
  ShieldAlert,
  Heart,
  Moon,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";

const specializations = [
  { name: "Raucherentwöhnung", icon: Cigarette, slug: "raucherentwoehnung" },
  { name: "Angst & Phobien", icon: ShieldAlert, slug: "angst-phobien" },
  { name: "Stressbewältigung", icon: Brain, slug: "stressbewaeltigung" },
  { name: "Schmerztherapie", icon: Heart, slug: "schmerztherapie" },
  { name: "Schlafstörungen", icon: Moon, slug: "schlafstoerungen" },
  { name: "Selbstvertrauen", icon: Sparkles, slug: "selbstvertrauen" },
];

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch latest published news
  const { data: news } = await supabase
    .from("news")
    .select("id, title, slug, excerpt, cover_image_url, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(3);

  // Fetch newest published members for carousel
  const { data: newMembers } = await supabase
    .from("profiles")
    .select("id, slug, first_name, last_name, city, canton, photo_url, specializations")
    .eq("is_published", true)
    .eq("approval_status", "approved")
    .order("created_at", { ascending: false })
    .limit(6);

  // Get stats
  const { count: memberCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true)
    .eq("approval_status", "approved");

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden py-24 text-white lg:py-36">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 animate-float" />
          <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-white/5 animate-float stagger-3" />
          <div className="absolute top-1/2 left-1/3 h-48 w-48 rounded-full bg-vsh-gold/10 animate-pulse-soft" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="animate-fade-in mb-4 text-sm font-medium uppercase tracking-wider text-vsh-gold-light">
              Verband Schweizer Hypnosetherapeuten
            </p>
            <h1 className="animate-fade-in-up text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Finden Sie Ihren{" "}
              <span className="text-vsh-gold-light">Hypnosetherapeuten</span>
            </h1>
            <p className="animate-fade-in-up stagger-2 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
              Ihr Verzeichnis für qualifizierte und geprüfte Hypnosetherapie
              in der Schweiz — professionell, vertrauensvoll, wirksam.
            </p>

            {/* Search CTA */}
            <div className="animate-fade-in-up stagger-3 mx-auto mt-10 flex max-w-lg items-center gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="PLZ, Ort oder Spezialisierung..."
                  className="h-12 w-full rounded-xl bg-white pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-vsh-gold"
                />
              </div>
              <Button
                size="lg"
                className="h-12 rounded-xl bg-vsh-gold hover:bg-vsh-gold-light text-white font-semibold px-6 shadow-lg"
                asChild
              >
                <Link href="/therapeuten">Suchen</Link>
              </Button>
            </div>

            <p className="animate-fade-in stagger-4 mt-4 text-sm text-white/50">
              Oder stöbern Sie in unseren{" "}
              <Link href="/therapeuten" className="underline underline-offset-2 hover:text-white/80">
                Spezialisierungen
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 -mt-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 rounded-2xl border bg-white p-6 shadow-lg shadow-black/5 sm:p-8">
            <div className="text-center animate-count-up">
              <div className="flex items-center justify-center gap-1.5">
                <Users className="h-5 w-5 text-vsh-blue" />
                <p className="text-3xl font-bold text-vsh-blue sm:text-4xl">{memberCount || "50"}+</p>
              </div>
              <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">Mitglieder</p>
            </div>
            <div className="text-center animate-count-up stagger-1">
              <div className="flex items-center justify-center gap-1.5">
                <MapPin className="h-5 w-5 text-vsh-blue" />
                <p className="text-3xl font-bold text-vsh-blue sm:text-4xl">15+</p>
              </div>
              <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">Kantone</p>
            </div>
            <div className="text-center animate-count-up stagger-2">
              <div className="flex items-center justify-center gap-1.5">
                <Award className="h-5 w-5 text-vsh-blue" />
                <p className="text-3xl font-bold text-vsh-blue sm:text-4xl">16</p>
              </div>
              <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">Spezialisierungen</p>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold">
              Therapiebereiche
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Beliebte Spezialisierungen
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Finden Sie den passenden Therapeuten für Ihr Anliegen
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {specializations.map((spec, i) => {
              const Icon = spec.icon;
              return (
                <Link
                  key={spec.slug}
                  href={`/therapeuten?spezialisierung=${spec.slug}`}
                  className={`card-hover group flex flex-col items-center gap-3 rounded-2xl border bg-white p-6 text-center animate-fade-in-up stagger-${i + 1}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-vsh-blue/5 text-vsh-blue transition-colors group-hover:bg-vsh-blue group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{spec.name}</span>
                </Link>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" className="rounded-xl" asChild>
              <Link href="/therapeuten">
                Alle Spezialisierungen anzeigen
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* New Members Carousel */}
      {newMembers && newMembers.length > 0 && (
        <section className="section-warm py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold">
                  Willkommen
                </p>
                <h2 className="mt-2 text-3xl font-bold text-foreground">
                  Neue Mitglieder
                </h2>
              </div>
              <Button variant="ghost" className="text-vsh-blue" asChild>
                <Link href="/therapeuten">
                  Alle anzeigen <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {newMembers.map((member) => (
                <Link
                  key={member.id}
                  href={`/therapeuten/${member.slug || member.id}`}
                  className="card-hover group flex items-center gap-4 rounded-2xl border bg-white p-5"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-vsh-blue/5 text-lg font-bold text-vsh-blue">
                    {member.first_name?.[0]}
                    {member.last_name?.[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground group-hover:text-vsh-blue">
                      {member.first_name} {member.last_name}
                    </p>
                    {(member.city || member.canton) && (
                      <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {[member.city, member.canton].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* News Teaser */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold">
                Blog
              </p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">Aktuelles</h2>
            </div>
            <Button variant="ghost" className="text-vsh-blue" asChild>
              <Link href="/news">
                Alle News <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news && news.length > 0 ? (
              news.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`}>
                  <Card className="card-hover h-full overflow-hidden rounded-2xl">
                    {article.cover_image_url && (
                      <div className="aspect-[16/9] overflow-hidden bg-muted">
                        <img
                          src={article.cover_image_url}
                          alt={article.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardContent className="p-5">
                      {article.published_at && (
                        <p className="text-xs font-medium text-vsh-gold">
                          {new Date(article.published_at).toLocaleDateString("de-CH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                      <h3 className="mt-2 font-semibold text-foreground line-clamp-2">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              // Placeholder when no news yet
              [1, 2, 3].map((i) => (
                <Card key={i} className="rounded-2xl">
                  <CardContent className="p-5">
                    <div className="h-2 w-16 rounded bg-vsh-gold/20" />
                    <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
                    <div className="mt-3 space-y-2">
                      <div className="h-3 w-full rounded bg-muted" />
                      <div className="h-3 w-2/3 rounded bg-muted" />
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground">
                      Hier erscheinen bald aktuelle News des Verbands.
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why VSH Section */}
      <section className="section-cool py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-vsh-gold">
              Warum VSH?
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Qualität, der Sie vertrauen können
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: CheckCircle,
                title: "Geprüfte Qualifikation",
                text: "Alle Mitglieder weisen eine anerkannte Ausbildung in Hypnosetherapie nach.",
              },
              {
                icon: Star,
                title: "Regelmässige Weiterbildung",
                text: "Unsere Therapeuten bilden sich kontinuierlich weiter — für beste Behandlungsqualität.",
              },
              {
                icon: Award,
                title: "Berufsethik & Standards",
                text: "Der VSH setzt klare ethische Richtlinien und professionelle Standards.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl border bg-white p-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vsh-green/10 text-vsh-green">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA: Mitglied werden */}
      <section className="hero-gradient relative overflow-hidden py-20 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-white/5" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">Mitglied werden</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">
            Profitieren Sie von der Verbandszugehörigkeit: Sichtbarkeit im
            Therapeuten-Verzeichnis, Weiterbildungsangebote, kollegiales Netzwerk
            und mehr.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 rounded-xl bg-vsh-gold hover:bg-vsh-gold-light text-white font-semibold px-8 shadow-lg"
              asChild
            >
              <Link href="/mitglied-werden">
                Jetzt Mitglied werden
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-white/30 text-white hover:bg-white/10"
              asChild
            >
              <Link href="/ueber-uns">Mehr erfahren</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
