import { ArrowUpRight } from "lucide-react";

function SpotifyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function YouTubeMusicIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z" />
    </svg>
  );
}

const PLAYLISTS = [
  {
    label: (
      <span className="inline-flex items-start">
        Spotify <ArrowUpRight size={10} />
      </span>
    ),
    href: "https://open.spotify.com/playlist/2AVjI8Z57bqMJVtU3V9X1Q",
    Icon: SpotifyIcon,
    brand: "#1DB954",
  },
  {
    label: (
      <span className="inline-flex items-start">
        YouTube Music <ArrowUpRight size={10} />
      </span>
    ),
    href: "https://music.youtube.com/playlist?list=PLVdSJtgLgaNg&si=jOtXbqY6ug0FC-Zn",
    Icon: YouTubeMusicIcon,
    brand: "#FF0000",
  },
];

export default function PlaylistShare() {
  return (
    <div className="flex items-center gap-2">
      {PLAYLISTS.map(({ label, href, Icon, brand }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-black/40 py-1.5 px-2 md:px-4 text-sm 2xl:text-base font-medium text-white backdrop-blur-sm drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] transition hover:bg-black/60"
        >
          <Icon className="h-4 w-4" style={{ color: brand }} />
          <span className="hidden md:inline">{label}</span>
        </a>
      ))}
    </div>
  );
}
