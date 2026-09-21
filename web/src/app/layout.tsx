import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";
import { SiteFooter, SiteHeader } from "@/app/components/site-shell";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "FormatStack Journal", template: "%s | FormatStack Journal" },
  description: "Field notes on document intelligence, structured data, and better workflows.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full antialiased ${manrope.variable} ${plexMono.variable}`}>
      <body className="min-h-full">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <div className="page-wrap">{children}</div>
        <SiteFooter />
        <SanityLive />
      </body>
    </html>
  );
}
