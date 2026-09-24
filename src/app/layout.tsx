import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, Rajdhani } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TacticalClickProvider } from "@/components/TacticalClickProvider";
import { parseSiteUrl } from "@/lib/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "SENTINEL | Indian Defence Intelligence Archive",
  description: "A futuristic intelligence archive and open-source wiki documenting the Indian Armed Forces, historical conflicts, gallantry heroes, and defense capabilities.",
  metadataBase: parseSiteUrl(process.env.SITE_URL),
  openGraph: {
    title: "SENTINEL | Indian Defence Intelligence Archive",
    description: "Futuristic open-source digital intelligence archive and wiki documenting India's military history, operations, heroes, and arsenal.",
    siteName: "SENTINEL Defence Archive",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${rajdhani.variable} min-h-screen flex flex-col font-sans bg-background text-foreground selection:bg-primary/30 relative`}
      >
        <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40 z-0" aria-hidden="true" />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <TacticalClickProvider>
          <SiteHeader />
          <main id="main-content" className="flex-1 relative z-10">
            {children}
          </main>
          <SiteFooter />
        </TacticalClickProvider>
      </body>
    </html>
  );
}
