import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

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
