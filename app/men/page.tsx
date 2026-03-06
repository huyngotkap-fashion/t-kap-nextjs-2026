import { Metadata } from "next";
import dynamic from "next/dynamic";
import JsonLd from "@/components/JsonLd";

const ClientApp = dynamic(() => import("@/app/ClientApp"), { ssr: false });

const baseUrl = process.env.APP_URL || "https://t-kap.com.vn";

export const metadata: Metadata = {
  title:
"Áo Polo Cao Cấp & Đồng Phục Doanh Nghiệp | Premium Polo Shirts - T-Kap Fashion",

  description:
    "T-kap Fashion chuyên thiết kế áo polo cao cấp và đồng phục doanh nghiệp sang trọng. Premium polo shirts, luxury corporate uniforms và custom company apparel dành cho thương hiệu hiện đại.",

  keywords: [
    "áo polo cao cấp",
    "premium polo shirt",
    "corporate uniform",
    "đồng phục doanh nghiệp cao cấp",
    "áo polo đồng phục công ty",
    "custom polo shirt",
    "luxury polo shirt",
    "premium corporate uniform",
    "company uniform design",
  ],

  alternates: {
    canonical: `${baseUrl}/men`,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Premium Polo Shirts & Corporate Uniforms | T-kap Fashion",

    description:
      "Discover premium polo shirts and luxury corporate uniforms designed for modern brands.",

    url: `${baseUrl}/men`,
    siteName: "T-kap Fashion",
    type: "website",

    images: [
      {
        url: `${baseUrl}/og-polo.jpg`,
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Premium Polo Shirts | T-kap Fashion",
    description:
      "Luxury polo shirts and premium corporate uniforms.",
    images: [`${baseUrl}/og-polo.jpg`],
  },
};

export default function MenPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Premium Polo Shirts Collection - T-kap Fashion",
    url: `${baseUrl}/men`,
    description:
      "Premium polo shirts and luxury corporate uniforms from T-kap Fashion.",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Polo Collection",
        item: `${baseUrl}/men`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ClientApp initialCategory="men" />
    </>
  );
  
}