import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";
import { SiteFooter, SiteHeader } from "@/app/components/site-shell";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "FormatStack Blog", template: "%s | FormatStack Blog" },
  description:
    "Field notes on document intelligence, structured data, and better workflows.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full scroll-smooth antialiased motion-reduce:scroll-auto ${manrope.variable} ${plexMono.variable}`}
    >
      <body className="min-h-full bg-paper font-brand text-ink selection:bg-lime selection:text-ink">
        <a
          className="fixed top-4 left-4 z-100 translate-y-[-150%] rounded-full bg-ink px-4 py-[.8rem] text-white focus:translate-y-0"
          href="#main-content"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div className="overflow-hidden">{children}</div>
        <SiteFooter />
        <SanityLive />
      </body>
    </html>
  );
}
