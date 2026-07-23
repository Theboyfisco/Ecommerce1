import { MetadataRoute } from 'next';
import { generateDummyProducts, dummyCategories } from '@/lib/dummyData';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aurelia-maison.com';

  const products = generateDummyProducts(150);

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = dummyCategories.map((c) => ({
    url: `${baseUrl}/categories/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [
    { url: baseUrl, changeFrequency: 'daily', priority: 1.0 },
    ...categoryEntries,
    ...productEntries,
  ];
}

