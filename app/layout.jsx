import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://raksha-bandhan.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Raksha Bandhan Songs — Free Rakhi Music Player",
    template: "%s | Raksha Bandhan Songs",
  },
  description:
    "Play classic Raksha Bandhan (Rakhi) songs free — a music player celebrating the bond of brothers and sisters.",
  openGraph: {
    type: "website",
    siteName: "Raksha Bandhan Songs",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body>{children}</body>
    </html>
  );
}
