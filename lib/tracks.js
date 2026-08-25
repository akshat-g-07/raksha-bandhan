import tracks from "@/data/tracks.json";

export function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// tracks with a URL-friendly slug derived from the title
export const trackList = tracks.map((t) => ({ ...t, slug: slugify(t.title) }));

export function getTrackBySlug(slug) {
  return trackList.find((t) => t.slug === slug) || null;
}
