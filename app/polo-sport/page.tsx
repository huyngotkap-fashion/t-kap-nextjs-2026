import { Metadata } from "next";
import dynamic from "next/dynamic";
import JsonLd from "@/components/JsonLd";

const ClientApp = dynamic(() => import("../ClientApp"), { ssr: false });

const baseUrl = process.env.APP_URL || "https://t-kap.com.vn";

export const metadata: Metadata = {
  title: "Áo Polo Thể Thao Cao Cấp | Polo Sport Premium - T-KAP Fashion",

  description:
    "Khám phá bộ sưu tập áo polo thể thao cao cấp từ T-KAP Fashion. Thiết kế hiện đại, chất liệu premium, phù hợp cho doanh nghiệp, golf, resort và phong cách lifestyle.",

  keywords: [
    "áo polo thể thao",
    "polo sport",
    "áo polo cao cấp",
    "áo polo doanh nghiệp",
    "premium polo shirt",
    "corporate polo uniform",
  ],

  metadataBase: new URL(baseUrl),

  alternates: {
    canonical: "/polo-sport",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "Polo Sport Premium | T-KAP Fashion",
    description:
      "Áo polo thể thao cao cấp với thiết kế hiện đại và chất liệu premium từ T-KAP Fashion.",
    url: "/polo-sport",
    siteName: "T-KAP Fashion",
    type: "website",
    locale: "vi_VN",
  },

  twitter: {
    card: "summary_large_image",
    title: "Polo Sport Premium | T-KAP Fashion",
    description:
      "Premium sport polo shirts designed for performance and luxury style.",
  },
};

export default function PoloSportPage() {

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Polo Sport Collection - T-KAP Fashion",
    url: `${baseUrl}/polo-sport`,
    description:
      "Bộ sưu tập áo polo thể thao cao cấp dành cho phong cách năng động và doanh nghiệp hiện đại.",

    isPartOf: {
      "@type": "WebSite",
      name: "T-KAP Fashion",
      url: baseUrl,
    },

    about: {
      "@type": "Product",
      name: "Áo Polo Thể Thao Cao Cấp",
      brand: {
        "@type": "Brand",
        name: "T-KAP Fashion",
      },
      category: "Sport Polo Shirt",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ClientApp initialCategory="polo-sport" />
    </>
  );
}