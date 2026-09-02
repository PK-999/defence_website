import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

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

export const metadata: Metadata = {
  title: "SENTINEL | Indian Defence Archive",
  description: "A source-first interactive digital archive of India's military history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} min-h-screen flex flex-col font-sans selection:bg-primary/30 relative bg-grid-pattern`}
      >
        {/* HUD Scanner Line */}
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          <div className="w-full h-1 bg-primary/20 opacity-30 shadow-[0_0_10px_rgba(0,255,65,0.5)] animate-scan"></div>
        </div>

        <SiteHeader />
        <main className="flex-1 container max-w-screen-2xl mx-auto px-4 py-8 hud-corner hud-corner-tl hud-corner-br border border-primary/10 bg-background/50 backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,65,0.05)] mt-4 mb-8">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
