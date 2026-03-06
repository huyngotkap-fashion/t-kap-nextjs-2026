import { Metadata } from "next";
import dynamic from "next/dynamic";
import JsonLd from "@/components/JsonLd";

const ClientApp = dynamic(() => import("../ClientApp"), { ssr: false });

const baseUrl = process.env.APP_URL || "https://t-kap.com.vn";

export const metadata: Metadata = {
  title: "Áo Polo Thể Thao Cao Cấp | Polo Sport Premium - T-kap Fashion",
  description:
    "Khám phá bộ sưu tập áo polo thể thao cao cấp từ T-kap Fashion. Thiết kế hiện đại, chất liệu cao cấp, phù hợp cho doanh nghiệp, golf, resort và phong cách lifestyle.",
  
  alternates: {
    canonical: `${baseUrl}/polo-sport`,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Polo Sport Premium | T-kap Fashion",
    description:
      "Áo polo thể thao cao cấp với thiết kế hiện đại và chất liệu premium từ T-kap Fashion.",
    url: `${baseUrl}/polo-sport`,
    siteName: "T-kap Fashion",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Polo Sport Premium | T-kap Fashion",
    description:
      "Premium sport polo shirts designed for performance and luxury style.",
  },
};

export default function PoloSportPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Polo Sport Collection - T-kap Fashion",
    url: `${baseUrl}/polo-sport`,
    description:
      "Bộ sưu tập áo polo thể thao cao cấp dành cho phong cách năng động và doanh nghiệp hiện đại.",
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ClientApp initialCategory="polo-sport" />
    </>
  );
}