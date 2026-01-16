import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH 
    ? `https://jarllyng.github.io${process.env.NEXT_PUBLIC_BASE_PATH}`
    : 'https://jarllyng.github.io/get-to-the-movie';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
