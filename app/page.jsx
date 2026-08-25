import PlayerScreen from "@/components/PlayerScreen";
import { siteConfig } from "@/config/site";
import { trackList } from "@/lib/tracks";

const playlistJsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicPlaylist",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  inLanguage: siteConfig.language,
  numTracks: trackList.length,
  sameAs: [siteConfig.links.spotify, siteConfig.links.youtubeMusic],
  track: trackList.map((t) => ({
    "@type": "MusicRecording",
    name: t.title,
    byArtist: { "@type": "MusicGroup", name: t.artist },
    url: `${siteConfig.url}/songs/${t.slug}`,
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(playlistJsonLd) }}
      />
      <PlayerScreen />
    </>
  );
}
