import { trackList } from "@/lib/tracks";

const base =
  process.env.NEXT_PUBLIC_SITE_URL || "https://raksha-bandhan.vercel.app";

export default function sitemap() {
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...trackList.map((t) => ({
      url: `${base}/songs/${t.slug}`,
      changeFrequency: "monthly",
      priority: 0.9,
    })),
  ];
}
