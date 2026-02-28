
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { getDocumentOnce } from "@/services/firestoreService";
import JsonLd from "@/components/JsonLd";

const ClientApp = dynamic(() => import("@/app/ClientApp"), { ssr: false });

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const parts = slug.split("-");
  const id = parts[parts.length - 1];

  const blog = await getDocumentOnce("blogs", id) as any;

  if (!blog) {
    return {
      title: "Blog Not Found | T-kap Fashion",
    };
  }

  return {
    title: `${blog.title} | T-kap Journal`,
    description: blog.excerpt || blog.content?.substring(0, 160) || "Read the latest from T-kap Fashion Journal.",
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [blog.imageUrl],
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const slug = params.slug;
  const parts = slug.split("-");
  const id = parts[parts.length - 1];
  const blog = await getDocumentOnce("blogs", id) as any;

  const jsonLd = blog ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "image": blog.imageUrl,
    "description": blog.excerpt,
    "author": {
      "@type": "Organization",
      "name": "T-kap Fashion"
    },
    "publisher": {
      "@type": "Organization",
      "name": "T-kap Fashion",
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/dozhznwuf/image/upload/v1768206325/logo-tkap_hrspdt.png"
      }
    },
    "datePublished": blog.createdAt || new Date().toISOString()
  } : null;

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <ClientApp />
    </>
  );
}
