import { Metadata } from "next";
import dynamic from "next/dynamic";
import JsonLd from "@/components/JsonLd";

const ClientApp = dynamic(() => import("@/app/ClientApp"), { ssr: false });

const baseUrl = process.env.APP_URL || "https://t-kap.com.vn";

export const metadata: Metadata = {
  title: "Women's Bespoke & Luxury Tailoring | T-kap Fashion",
  description:
    "Explore elegant women's bespoke tailoring, premium craftsmanship, and refined luxury fashion at T-kap Fashion.",
  alternates: {
    canonical: `${baseUrl}/women`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Women's Bespoke Collection | T-kap Fashion",
    description:
      "Luxury bespoke tailoring for women with exceptional craftsmanship and timeless elegance.",
    url: `${baseUrl}/women`,
    siteName: "T-kap Fashion",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Women's Bespoke Collection | T-kap Fashion",
    description:
      "Elegant bespoke tailoring for women by T-kap Fashion.",
  },
};

export default function WomenPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Women's Collection - T-kap Fashion",
    url: `${baseUrl}/women`,
    description:
      "Luxury women's bespoke tailoring and premium designs.",
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ClientApp />
    </>
  );
}