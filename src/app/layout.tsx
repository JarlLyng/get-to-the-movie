import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Get to the Movie!",
  description: "Arnold Schwarzenegger-inspired movie recommendation app. Answer the quiz questions and get recommended perfect Arnold movies!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
