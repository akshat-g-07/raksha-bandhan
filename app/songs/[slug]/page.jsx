import { notFound } from "next/navigation";

import PlayerScreen from "@/components/PlayerScreen";
import { getTrackBySlug, trackList } from "@/lib/tracks";

// Only the known song slugs are valid pages (unknown -> 404, no soft-404s).
export const dynamicParams = false;

export function generateStaticParams() {
  return trackList.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const t = getTrackBySlug(slug);
  if (!t) return {};

  const url = `/songs/${t.slug}`;
  const description = `Listen to ${t.title} by ${t.artist} — a Raksha Bandhan (Rakhi) song. Play it free with the full festival playlist.`;

  return {
    title: t.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${t.title} | Raksha Bandhan Songs`,
      description,
      url,
      type: "music.song",
      images: [`https://i.ytimg.com/vi/${t.youtubeId}/hqdefault.jpg`],
    },
  };
}

export default async function SongPage({ params }) {
  const { slug } = await params;
  const t = getTrackBySlug(slug);
  if (!t) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: t.title,
    byArtist: { "@type": "MusicGroup", name: t.artist },
    inAlbum: { "@type": "MusicAlbum", name: "Raksha Bandhan Songs" },
    url: `/songs/${t.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* server-rendered heading gives the crawler the song keyword */}
      <h1 className="sr-only">
        {t.title} — {t.artist} | Raksha Bandhan Songs
      </h1>
      <PlayerScreen startId={t.youtubeId} />
    </>
  );
}
