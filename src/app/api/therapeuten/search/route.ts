import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAPBOX_TOKEN = process.env.MAPBOX_SECRET_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface SearchParams {
  q?: string;
  lat?: number;
  lng?: number;
  radius?: number; // km
  spezialisierung?: string;
  sprache?: string;
  kanton?: string;
  online?: boolean;
  kasse?: boolean;
  sort?: "distance" | "name" | "newest";
  page?: number;
  limit?: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const params: SearchParams = {
    q: searchParams.get("q") || undefined,
    lat: searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : undefined,
    lng: searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : undefined,
    radius: searchParams.get("radius") ? parseFloat(searchParams.get("radius")!) : 50,
    spezialisierung: searchParams.get("spezialisierung") || undefined,
    sprache: searchParams.get("sprache") || undefined,
    kanton: searchParams.get("kanton") || undefined,
    online: searchParams.get("online") === "true" || undefined,
    kasse: searchParams.get("kasse") === "true" || undefined,
    sort: (searchParams.get("sort") as SearchParams["sort"]) || "name",
    page: parseInt(searchParams.get("page") || "1"),
    limit: Math.min(parseInt(searchParams.get("limit") || "20"), 100),
  };

  // If query string given but no lat/lng, geocode it
  if (params.q && !params.lat && !params.lng) {
    const geo = await geocode(params.q);
    if (geo) {
      params.lat = geo.lat;
      params.lng = geo.lng;
    }
  }

  const supabase = await createClient();
  const offset = ((params.page || 1) - 1) * (params.limit || 20);

  // If we have coordinates, use PostGIS proximity query via RPC
  if (params.lat && params.lng) {
    const { data, error } = await supabase.rpc("search_therapists_nearby", {
      search_lat: params.lat,
      search_lng: params.lng,
      radius_km: params.radius || 50,
      filter_specialization: params.spezialisierung || null,
      filter_language: params.sprache || null,
      filter_canton: params.kanton || null,
      filter_online: params.online || null,
      filter_insurance: params.kasse || null,
      sort_by: params.sort || "distance",
      result_limit: params.limit || 20,
      result_offset: offset,
    });

    if (error) {
      // Fallback to basic query if RPC not available
      return fallbackSearch(supabase, params, offset);
    }

    return NextResponse.json({
      therapists: data || [],
      center: { lat: params.lat, lng: params.lng },
      total: data?.length || 0,
    });
  }

  // No coordinates — basic filtered list
  return fallbackSearch(supabase, params, offset);
}

async function fallbackSearch(
  supabase: Awaited<ReturnType<typeof createClient>>,
  params: SearchParams,
  offset: number
) {
  let query = supabase
    .from("profiles")
    .select(
      "id, slug, first_name, last_name, title, photo_url, city, canton, latitude, longitude, specializations, languages, insurance_recognized, offers_online, bio",
      { count: "exact" }
    )
    .eq("is_published", true)
    .eq("approval_status", "approved")
    .is("deactivated_at", null);

  if (params.kanton) {
    query = query.eq("canton", params.kanton);
  }
  if (params.online) {
    query = query.eq("offers_online", true);
  }
  if (params.kasse) {
    query = query.eq("insurance_recognized", true);
  }
  if (params.spezialisierung) {
    query = query.contains("specializations", [params.spezialisierung]);
  }
  if (params.sprache) {
    query = query.contains("languages", [params.sprache]);
  }

  // Sorting
  if (params.sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("last_name", { ascending: true });
  }

  query = query.range(offset, offset + (params.limit || 20) - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    therapists: data || [],
    total: count || 0,
  });
}

async function geocode(query: string): Promise<{ lat: number; lng: number } | null> {
  if (!MAPBOX_TOKEN) return null;

  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?country=CH&types=place,postcode,locality&limit=1&access_token=${MAPBOX_TOKEN}`,
      { next: { revalidate: 86400 } } // Cache 24h
    );

    if (!res.ok) return null;
    const data = await res.json();

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    }
  } catch {
    // Geocoding failed silently
  }
  return null;
}
