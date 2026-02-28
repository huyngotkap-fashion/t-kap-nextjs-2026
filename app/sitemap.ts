import { MetadataRoute } from "next";
import { getCollectionOnce } from "@/services/firestoreService";

function slugify(text: any) {
  if (!text || typeof text !== "string") return "";

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_URL || "https://t-kap.com.vn";

  const products = await getCollectionOnce("products");
  const blogs = await getCollectionOnce("blogs");

  // ✅ Product URLs
  const productEntries: MetadataRoute.Sitemap = products
    .filter((p: any) => typeof p.name === "string")
    .map((p: any) => ({
      url: `${baseUrl}/product/${slugify(p.name)}-${p.id}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  // ✅ Blog URLs
  const blogEntries: MetadataRoute.Sitemap = blogs
    .filter((b: any) => typeof b.title === "string")
    .map((b: any) => ({
      url: `${baseUrl}/blog/${slugify(b.title)}-${b.id}`,
      lastModified: b.updatedAt ? new Date(b.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  // ✅ Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/men`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/women`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/stores`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/quotation`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  return [...staticPages, ...productEntries, ...blogEntries];
}