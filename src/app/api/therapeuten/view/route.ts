import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Debounce: allow 1 view per profile per IP per hour
const viewCache = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const { profileId } = await request.json();

    if (!profileId) {
      return NextResponse.json({ error: "Missing profileId" }, { status: 400 });
    }

    // Simple bot detection: check for common bot user agents
    const ua = request.headers.get("user-agent") || "";
    if (/bot|crawler|spider|scraper|curl|wget|python|java\//i.test(ua)) {
      return NextResponse.json({ ok: true }); // Silently ignore bots
    }

    // Debounce by IP + profile combination
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const cacheKey = `${ip}:${profileId}`;
    const lastView = viewCache.get(cacheKey);
    const now = Date.now();

    if (lastView && now - lastView < 3600000) {
      // Already counted within the last hour
      return NextResponse.json({ ok: true });
    }

    viewCache.set(cacheKey, now);

    // Clean old entries periodically (keep cache manageable)
    if (viewCache.size > 10000) {
      const cutoff = now - 3600000;
      for (const [key, time] of viewCache.entries()) {
        if (time < cutoff) viewCache.delete(key);
      }
    }

    const supabase = await createClient();

    // Try RPC first, fallback to direct update
    const { error: rpcError } = await supabase.rpc("increment_view_count", {
      profile_id: profileId,
    });

    if (rpcError) {
      // Fallback: direct increment
      const { data: profile } = await supabase
        .from("profiles")
        .select("view_count")
        .eq("id", profileId)
        .single();

      if (profile) {
        await supabase
          .from("profiles")
          .update({ view_count: (profile.view_count || 0) + 1 })
          .eq("id", profileId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
