import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';
// Use static export when NEXT_PUBLIC_BASE_PATH is set (even if empty string for custom domain)
const isExport = process.env.NEXT_PUBLIC_BASE_PATH !== undefined;

const nextConfig: NextConfig = {
  // Use static export for GitHub Pages (works with both subpath and custom domain)
  ...(isExport && { output: 'export' }),
  // basePath is empty for custom domain, or /get-to-the-movie for GitHub Pages subpath
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    ...(isExport && { unoptimized: true }), // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },
};

export default nextConfig;
