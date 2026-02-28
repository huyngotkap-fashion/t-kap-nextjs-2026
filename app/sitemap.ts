
import { MetadataRoute } from 'next';
import { getCollectionOnce } from '@/services/firestoreService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_URL || 'https://t-kap.com.vn';

  // Fetch all products and blogs
  const products = await getCollectionOnce('products');
  const blogs = await getCollectionOnce('blogs');

  const productEntries = products
    .filter((p: any) => p.name && typeof p.name === 'string')
    .map((p: any) => ({
      url: `${baseUrl}/product/${p.name.toLowerCase().replace(/\s+/g, '-')}-${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  const blogEntries = blogs
    .filter((b: any) => b.title && typeof b.title === 'string')
    .map((b: any) => ({
      url: `${baseUrl}/blog/${b.title.toLowerCase().replace(/\s+/g, '-')}-${b.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  const staticPages = [
    '',
    '/men',
    '/women',
    '/journal',
    '/stores',
    '/quotation',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.9,
  }));

  return [...staticPages, ...productEntries, ...blogEntries];
}
