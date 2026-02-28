import { Metadata } from "next";
import dynamic from "next/dynamic";
import JsonLd from "@/components/JsonLd";

const ClientApp = dynamic(() => import("./ClientApp"), { ssr: false });

const baseUrl = process.env.APP_URL || "https://t-kap.com.vn";

export const metadata: Metadata = {
  title:
    "T-kap Fashion | Bespoke Suit Vietnam | Luxury Tailoring in Ho Chi Minh City",
  description:
    "T-kap Fashion is a luxury bespoke tailoring house in Vietnam, crafting premium suits, refined formalwear, and timeless elegance for modern gentlemen and women.",
  alternates: {
    canonical: baseUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "T-kap Fashion | Luxury Bespoke Tailoring in Vietnam",
    description:
      "Discover premium bespoke suits and luxury tailoring in Ho Chi Minh City.",
    url: baseUrl,
    siteName: "T-kap Fashion",
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`, // nên có ảnh này trong public
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "T-kap Fashion | Luxury Bespoke Tailoring",
    description:
      "Premium bespoke tailoring and luxury suits crafted in Vietnam.",
  },
  keywords: [
    "bespoke suit Vietnam",
    "luxury tailoring Ho Chi Minh City",
    "custom suit Vietnam",
    "premium menswear Vietnam",
    "T-kap Fashion",
  ],
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "T-kap Fashion",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "Luxury bespoke tailoring house in Vietnam offering premium custom suits and refined craftsmanship.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ho Chi Minh City",
      addressCountry: "VN",
    },
    sameAs: [
      "https://facebook.com/yourpage",
      "https://instagram.com/yourpage",
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ClientApp />
    </>
  );
}