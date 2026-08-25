import { trackList } from "@/lib/tracks";
import { siteConfig } from "@/config/site";

export default function sitemap() {
  const lastModified = new Date();
  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    ...trackList.map((t) => ({
      url: `${siteConfig.url}/songs/${t.slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    })),
  ];
}
