import type { Metadata } from "next";
import "./globals.css";
import { FONT_VARIABLES } from "@/lib/fonts";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ThemeStyleInjector from "@/components/layout/theme-style-injector";
import { getSEOSettings, getGymSettings } from "@/lib/data/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [seo, gym] = await Promise.all([getSEOSettings(), getGymSettings()]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || seo.canonicalUrl;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: seo.defaultTitle, template: seo.titleTemplate },
    description: seo.defaultDescription,
    keywords: seo.keywords.split(",").map((k) => k.trim()),
    icons: gym.faviconUrl ? [{ url: gym.faviconUrl }] : undefined,
    robots: { index: seo.robotsIndex, follow: seo.robotsFollow },
    openGraph: {
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      url: seo.canonicalUrl,
      siteName: gym.brandName,
      images: seo.ogImage ? [seo.ogImage] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    alternates: { canonical: seo.canonicalUrl },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${FONT_VARIABLES} antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-screen bg-background text-foreground flex flex-col">
        <ThemeStyleInjector />
        <TooltipProvider delay={150}>{children}</TooltipProvider>
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}
