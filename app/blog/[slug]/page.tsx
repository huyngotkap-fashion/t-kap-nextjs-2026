import { Metadata } from "next";
import dynamic from "next/dynamic";
import { getDocumentOnce } from "@/services/firestoreService";
import JsonLd from "@/components/JsonLd";

const ClientApp = dynamic(() => import("@/app/ClientApp"), { ssr: false });

type Props = {
  params: { slug: string };
};

/* =========================
   HELPER FUNCTIONS
========================= */

function extractIdFromSlug(slug: string) {
  const parts = slug.split("-");
  return parts[parts.length - 1];
}

function getRawContent(blog: any) {
  if (!blog?.content) return "";

  if (typeof blog.content === "string") return blog.content;

  return blog.content?.vi || blog.content?.en || "";
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, "");
}

function getDescription(blog: any) {
  if (blog?.excerpt) return blog.excerpt;

  const raw = getRawContent(blog);
  return stripHtml(raw).substring(0, 160) || 
    "Tin tức mới nhất từ T-Kap – chuyên sản xuất áo polo và đồng phục doanh nghiệp cao cấp.";
}

function formatDate(date: any) {
  if (!date) return new Date().toISOString();

  if (typeof date === "string") return date;

  if (date?.toDate) return date.toDate().toISOString();

  return new Date(date).toISOString();
}

/* =========================
   METADATA
========================= */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const id = extractIdFromSlug(slug);

  const blog = await getDocumentOnce("blogs", id) as any;

  if (!blog) {
    return {
      title: "Bài viết không tồn tại | T-Kap",
      description: "Trang tin tức T-Kap – chuyên sản xuất áo polo & đồng phục doanh nghiệp.",
    };
  }

  const url = `https://t-kap.com.vn/blog/${slug}`;
  const description = getDescription(blog);
  const publishedTime = formatDate(blog.createdAt);

  return {
    title: `${blog.title} | T-Kap Journal`,
    description,
    keywords: blog.tags || [
      "áo polo đồng phục",
      "sản xuất áo polo",
      "đồng phục doanh nghiệp",
      "T-Kap Fashion",
      "xưởng may đồng phục cao cấp",
    ],

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: blog.title,
      description,
      url,
      type: "article",
      publishedTime,
      images: [
        {
          url: blog.imageUrl || "https://t-kap.com.vn/og-image.jpg",
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: [blog.imageUrl || "https://t-kap.com.vn/og-image.jpg"],
    },
  };
}

/* =========================
   PAGE
========================= */

export default async function BlogPage({ params }: Props) {
  const slug = params.slug;
  const id = extractIdFromSlug(slug);

  const blog = await getDocumentOnce("blogs", id) as any;

  if (!blog) return null;

  const url = `https://t-kap.com.vn/blog/${slug}`;
  const description = getDescription(blog);
  const published = formatDate(blog.createdAt);
  const modified = formatDate(blog.updatedAt || blog.createdAt);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    image: blog.imageUrl || "https://t-kap.com.vn/og-image.jpg",
    description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Organization",
      name: "T-Kap",
    },
    publisher: {
      "@type": "Organization",
      name: "T-Kap",
      logo: {
        "@type": "ImageObject",
        url: "https://res.cloudinary.com/dozhznwuf/image/upload/v1768206325/logo-tkap_hrspdt.png",
      },
    },
    datePublished: published,
    dateModified: modified,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ClientApp />
    </>
  );
}