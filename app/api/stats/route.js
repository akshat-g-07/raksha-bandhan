// Server-only: total visitors since Web Analytics was enabled (production),
// read from Vercel's Web Analytics REST API with a secret bearer token. The
// client polls this route so the token is never exposed to the browser.
// Returns { visitors: number | null }; null tells the client to use its
// simulated fallback (e.g. local dev, missing config, or API/plan errors).

const ENDPOINT = "https://api.vercel.com/v1/query/web-analytics/visits/count";

export async function GET() {
  const token = process.env.VERCEL_ANALYTICS_TOKEN;
  // Accepts a project id or the project name; Vercel also injects VERCEL_PROJECT_ID.
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token || !projectId) {
    return Response.json({ visitors: null });
  }

  const params = new URLSearchParams({ projectId });
  if (teamId) params.set("teamId", teamId);

  try {
    const res = await fetch(`${ENDPOINT}?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      // Cache the upstream call ~5 min to stay well under Vercel API rate limits.
      next: { revalidate: 300 },
    });
    if (!res.ok) return Response.json({ visitors: null });

    const json = await res.json();
    const d = json?.data;
    const visitors = Array.isArray(d) ? d[0]?.visitors : d?.visitors;

    return Response.json(
      { visitors: typeof visitors === "number" ? visitors : null },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch {
    return Response.json({ visitors: null });
  }
}
