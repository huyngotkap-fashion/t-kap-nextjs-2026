import { MetadataRoute } from "next";
import { getCollectionOnce } from "@/services/firestoreService";

function slugify(text: any) {
  if (!text) return "item";

  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://t-kap.com.vn";

  const products = await getCollectionOnce("products");
  const blogs = await getCollectionOnce("blogs");

  const productEntries = products
  .filter((p: any) => p?.id && p?.name)
  .map((p: any) => ({
    url: `${baseUrl}/product/${slugify(p.name)}-${p.id}`,
    lastModified: p.updatedAt?.toDate?.() || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogEntries = blogs.map((b: any) => ({
    url: `${baseUrl}/blog/${slugify(b.title)}-${String(b.id)}`,
    lastModified: b.updatedAt?.toDate?.() || new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/men`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/polo-sport`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/stores`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/quotation`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  return [...staticPages, ...productEntries, ...blogEntries];
}