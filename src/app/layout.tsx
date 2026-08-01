import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { getBusinessSettings } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getBusinessSettings();

  const title = settings.seo_title || "Kemekem Barbershop";
  const description =
    settings.seo_description ||
    "Premium grooming experience in Addis Ababa. Book your appointment online.";
  const ogImage = settings.og_image_url || settings.hero_image_url || "/og-default.jpg";

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ),
    title: {
      default: title,
      template: `%s | ${settings.business_name}`,
    },
    description,
    keywords: settings.seo_keywords || undefined,
    authors: [{ name: "Kemekem Barbershop" }],
    creator: "Kemekem Barbershop",
    openGraph: {
      type: "website",
      locale: "en_ET",
      url: "/",
      title,
      description,
      siteName: settings.business_name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
    icons: {
      icon: settings.favicon_url || "/favicon.png",
    },
    manifest: "/manifest.json",
    themeColor: "#0a0a0a",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingActions />
          </div>
        </Providers>
      </body>
    </html>
  );
}