import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';
const isExport = process.env.NEXT_PUBLIC_BASE_PATH !== undefined;

const nextConfig: NextConfig = {
  // Only use static export when building for GitHub Pages
  ...(isExport && { output: 'export' }),
  // Only use basePath when building for production (GitHub Pages)
  // In dev mode, basePath is empty so app works on localhost:3000
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
