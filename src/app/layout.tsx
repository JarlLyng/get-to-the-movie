import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gettothemovie.iamjarl.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Get to the Movie! — Arnold Schwarzenegger Recommendation Quiz",
    template: "%s | Get to the Movie!"
  },
  description: "Discover your perfect Arnold Schwarzenegger movie. Answer fun questions & get AI-powered recommendations with over-the-top Arnold commentary. Free quiz.",
  keywords: [
    "Arnold Schwarzenegger",
    "movie recommendations",
    "action movies",
    "movie quiz",
    "Arnold movies",
    "personality movie quiz",
    "arnold movie quiz",
    "which arnold movie should i watch",
    "action movie recommendation quiz",
    "movie finder",
    "entertainment"
  ],
  authors: [{ name: "Jarl Lyng", url: "https://iamjarl.com" }],
  creator: "Jarl Lyng",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Get to the Movie!",
    title: "Get to the Movie! — What's Your Arnold?",
    description: "Take the Arnold movie quiz and discover which Schwarzenegger classic matches your personality. Funny recommendations + authentic Arnold vibes.",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Get to the Movie! — Arnold Schwarzenegger Recommendation Quiz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Get to the Movie! — What's Your Arnold?",
    description: "Take the Arnold movie quiz and discover which Schwarzenegger classic matches your personality. Free quiz with Arnold-style commentary!",
    creator: "@iamjarl",
    images: [`${baseUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${outfit.variable} ${inter.variable}`}>
      <body className="antialiased font-sans bg-background text-foreground selection:bg-primary/30 selection:text-primary">
        {children}
        <Script
          src="https://umami-iamjarl.vercel.app/script.js"
          data-website-id="2b6e91c9-04a3-4f6c-9e85-0ce515327611"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
