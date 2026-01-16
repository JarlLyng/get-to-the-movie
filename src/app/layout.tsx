import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gettothemovie.iamjarl.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Get to the Movie! - Arnold Schwarzenegger Movie Recommendations",
    template: "%s | Get to the Movie!"
  },
  description: "Arnold Schwarzenegger-inspired movie recommendation app. Answer fun quiz questions and get recommended perfect Arnold movies with over-the-top Arnold-style commentary!",
  keywords: [
    "Arnold Schwarzenegger",
    "movie recommendations",
    "action movies",
    "movie quiz",
    "Arnold movies",
    "movie finder",
    "entertainment"
  ],
  authors: [{ name: "IAMJARL" }],
  creator: "IAMJARL",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Get to the Movie!",
    title: "Get to the Movie! - Arnold Schwarzenegger Movie Recommendations",
    description: "Answer fun quiz questions and get recommended perfect Arnold movies with over-the-top Arnold-style commentary!",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Get to the Movie! - Arnold Schwarzenegger Movie Recommendations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Get to the Movie! - Arnold Schwarzenegger Movie Recommendations",
    description: "Answer fun quiz questions and get recommended perfect Arnold movies!",
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
  verification: {
    // Add Google Search Console verification if needed
    // google: "your-google-verification-code",
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
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
        <Script
          defer
          src="https://umami-iamjarl.vercel.app/script.js"
          data-website-id="2b6e91c9-04a3-4f6c-9e85-0ce515327611"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
