import Link from "next/link";
import { MapPin, Globe, Shield, ArrowRight } from "lucide-react";

export interface TherapistCardData {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  title?: string;
  photo_url?: string;
  bio?: string;
  city?: string;
  canton?: string;
  latitude?: number;
  longitude?: number;
  specializations?: string[];
  languages?: string[];
  insurance_recognized?: boolean;
  offers_online?: boolean;
  distance_km?: number;
}

interface TherapistCardProps {
  therapist: TherapistCardData;
}

export function TherapistCard({ therapist: t }: TherapistCardProps) {
  return (
    <Link
      href={`/therapeuten/${t.slug || t.id}`}
      className="card-hover group flex gap-4 rounded-2xl border bg-white p-5 transition-colors"
    >
      {/* Avatar */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-vsh-blue/5 text-xl font-bold text-vsh-blue overflow-hidden">
        {t.photo_url ? (
          <img
            src={t.photo_url}
            alt={`${t.first_name} ${t.last_name}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            {t.first_name?.[0]}
            {t.last_name?.[0]}
          </>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-vsh-blue transition-colors">
              {t.title && <span className="text-muted-foreground font-normal">{t.title} </span>}
              {t.first_name} {t.last_name}
            </h3>
            {(t.city || t.canton) && (
              <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {[t.city, t.canton].filter(Boolean).join(", ")}
                {t.distance_km != null && (
                  <span className="ml-1 text-xs text-vsh-gold">
                    ({t.distance_km} km)
                  </span>
                )}
              </p>
            )}
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Tags */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {t.offers_online && (
            <span className="inline-flex items-center gap-1 rounded-full bg-vsh-blue/5 px-2 py-0.5 text-xs font-medium text-vsh-blue">
              <Globe className="h-3 w-3" /> Online
            </span>
          )}
          {t.insurance_recognized && (
            <span className="inline-flex items-center gap-1 rounded-full bg-vsh-green/5 px-2 py-0.5 text-xs font-medium text-vsh-green">
              <Shield className="h-3 w-3" /> Krankenkasse
            </span>
          )}
          {t.specializations?.slice(0, 3).map((spec) => (
            <span
              key={spec}
              className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {spec}
            </span>
          ))}
          {(t.specializations?.length || 0) > 3 && (
            <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              +{t.specializations!.length - 3}
            </span>
          )}
        </div>

        {/* Bio excerpt */}
        {t.bio && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{t.bio}</p>
        )}
      </div>
    </Link>
  );
}
