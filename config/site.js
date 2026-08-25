// Central website configuration — the single source of truth for domain,
// contact details, branding, and SEO defaults. Import anywhere via
// `@/config/site`. Edit values here rather than hard-coding them elsewhere.

const domain = "rakshabandhan.xyz";

// Prefer an explicit env override (e.g. preview/branch deploys), otherwise
// derive the canonical URL from the domain. Trailing slashes are stripped so
// composed URLs never double up.
const url = `https://${domain}`;

export const siteConfig = {
  domain,
  url,

  // Branding
  name: "Raksha Bandhan Songs",
  shortName: "Rakhi Songs",
  title: "Raksha Bandhan Songs — Free Rakhi Music Player",
  description:
    "Play classic Raksha Bandhan (Rakhi) songs free — a music player celebrating the timeless bond of brothers and sisters. Stream the full festival playlist online.",

  // SEO
  keywords: [
    "Raksha Bandhan songs",
    "Rakhi songs",
    "Raksha Bandhan music",
    "Rakhi music player",
    "Raksha Bandhan playlist",
    "brother sister songs",
    "bhai behen songs",
    "Bollywood Rakhi songs",
    "Raksha Bandhan special songs",
    "free Rakhi songs online",
  ],
  language: "en",
  locale: "en_US",

  // Theme / PWA colors (dark UI)
  themeColor: "#1a1915",
  backgroundColor: "#0a0a0a",

  // Credits (also used for structured-data publisher + the footer)
  author: {
    name: "Pixel Venturers",
    url: "https://pixelventurers.com",
  },
  poweredBy: {
    name: "InitiateJS",
    url: "https://initiatejs.dev",
  },

  // Public playlists / social profiles (share menu + JSON-LD `sameAs`).
  links: {
    spotify: "https://open.spotify.com/playlist/2AVjI8Z57bqMJVtU3V9X1Q",
    youtubeMusic:
      "https://music.youtube.com/playlist?list=PLVdSJtgLgaNg&si=jOtXbqY6ug0FC-Zn",
  },

  // Search-console verification (set via env when available).
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default siteConfig;
