import supabase from "@/lib/supabase";

// Public read-only stats endpoint. CDN-cached ~60s to protect Supabase.
export async function GET() {
  if (!supabase) {
    return Response.json({ error: "Stats not configured" }, { status: 503 });
  }

  const { data, error } = await supabase.rpc("get_stats");
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
