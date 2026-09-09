import type { Metadata, Viewport } from "next";
import { Cinzel, Josefin_Sans } from "next/font/google";
import { SmoothScrollProvider } from "@/components/layout/smooth-scroll-provider";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { SiteLoader } from "@/components/layout/site-loader";
import { SkipToContent } from "@/components/layout/skip-to-content";
import { CookieConsentProvider } from "@/components/legal/cookie-consent-provider";
import { SITE, OG_IMAGE, getSiteUrl } from "@/lib/site";
import { JsonLd, organizationJsonLd, webSiteJsonLd } from "@/components/seo/json-ld";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const josefinSans = Josefin_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F0E8" },
    { media: "(prefers-color-scheme: dark)", color: "#1E4B5D" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.name, url: siteUrl }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "real estate",
  applicationName: SITE.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "48x48" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      {
        url: "/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  alternates: {
    canonical: "/",
    languages: {
      "fr-SN": siteUrl,
      fr: siteUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_SN",
    alternateLocale: ["fr_FR"],
    url: siteUrl,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    countryName: "Sénégal",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr-SN"
      className={`${cinzel.variable} ${josefinSans.variable} hide-native-scrollbar h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/media/apps-temoins-almadies/salon-salle-a-manger.webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/media/apps-temoins-almadies/plan/floor-1-p1.webp"
          media="(min-width: 1024px)"
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
        <ThemeProvider>
          <CookieConsentProvider>
            <SiteLoader />
            <SmoothScrollProvider>
              <SkipToContent />
              <CustomCursor />
              {children}
            </SmoothScrollProvider>
          </CookieConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
