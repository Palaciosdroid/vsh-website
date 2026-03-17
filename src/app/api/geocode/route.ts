import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { street, zip, city, canton, country } = await request.json();

    if (!city) {
      return NextResponse.json({ error: "Stadt ist erforderlich" }, { status: 400 });
    }

    const addressParts = [street, zip, city, canton, country || "CH"].filter(Boolean);
    const query = encodeURIComponent(addressParts.join(", "));

    const token = process.env.MAPBOX_SECRET_TOKEN;
    if (!token) {
      // Fallback: return null coords if no token configured
      return NextResponse.json({ latitude: null, longitude: null });
    }

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&country=CH&limit=1&language=de`
    );

    if (!res.ok) {
      return NextResponse.json({ latitude: null, longitude: null });
    }

    const data = await res.json();
    const feature = data.features?.[0];

    if (!feature) {
      return NextResponse.json({ latitude: null, longitude: null });
    }

    const [longitude, latitude] = feature.center;

    return NextResponse.json({ latitude, longitude });
  } catch {
    return NextResponse.json({ error: "Geocoding fehlgeschlagen" }, { status: 500 });
  }
}
