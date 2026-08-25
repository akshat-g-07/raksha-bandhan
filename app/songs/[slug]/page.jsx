import { notFound } from "next/navigation";

import PlayerScreen from "@/components/PlayerScreen";
import { getTrackBySlug, trackList } from "@/lib/tracks";
import { siteConfig } from "@/config/site";

// Only the known song slugs are valid pages (unknown -> 404, no soft-404s).
export const dynamicParams = false;

export function generateStaticParams() {
  return trackList.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const t = getTrackBySlug(slug);
  if (!t) return {};

  const path = `/songs/${t.slug}`;
  const description = `Listen to ${t.title} by ${t.artist} — a Raksha Bandhan (Rakhi) song. Play it free with the full festival playlist.`;
  const image = `https://i.ytimg.com/vi/${t.youtubeId}/hqdefault.jpg`;

  return {
    title: t.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${t.title} | ${siteConfig.name}`,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "music.song",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.title} | ${siteConfig.name}`,
      description,
      images: [image],
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
    inAlbum: { "@type": "MusicAlbum", name: siteConfig.name },
    inLanguage: siteConfig.language,
    url: `${siteConfig.url}/songs/${t.slug}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${t.youtubeId}/hqdefault.jpg`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* server-rendered heading gives the crawler the song keyword */}
      <h1 className="sr-only">
        {t.title} — {t.artist} | {siteConfig.name}
      </h1>
      <PlayerScreen startId={t.youtubeId} />
    </>
  );
}
