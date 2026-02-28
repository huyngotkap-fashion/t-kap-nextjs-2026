import { Metadata } from "next";
import dynamic from "next/dynamic";
import JsonLd from "@/components/JsonLd";

const ClientApp = dynamic(() => import("@/app/ClientApp"), { ssr: false });

const baseUrl = process.env.APP_URL || "https://t-kap.com.vn";

export const metadata: Metadata = {
  title: "Men's Bespoke Suits & Luxury Tailoring | T-kap Fashion",
  description:
    "Discover premium men's bespoke suits, tailored jackets, and luxury formalwear at T-kap Fashion. Crafted with precision and timeless elegance.",
  alternates: {
    canonical: `${baseUrl}/men`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Men's Bespoke Suits | T-kap Fashion",
    description:
      "Luxury men's tailoring and bespoke suits designed for modern gentlemen.",
    url: `${baseUrl}/men`,
    siteName: "T-kap Fashion",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Men's Bespoke Suits | T-kap Fashion",
    description:
      "Premium bespoke tailoring for modern gentlemen.",
  },
};

export default function MenPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Men's Collection - T-kap Fashion",
    url: `${baseUrl}/men`,
    description:
      "Premium men's bespoke suits and luxury tailoring by T-kap Fashion.",
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ClientApp />
    </>
  );
}