import { Metadata } from "next";
import dynamic from "next/dynamic";
import JsonLd from "@/components/JsonLd";

const ClientApp = dynamic(() => import("./ClientApp"), { ssr: false });

const baseUrl = process.env.APP_URL || "https://t-kap.com.vn";

export const metadata: Metadata = {
  title:
    "T-Kap | Sản Xuất Áo Polo & Đồng Phục Doanh Nghiệp Cao Cấp",

  description:
    "T-Kap chuyên sản xuất áo polo và đồng phục doanh nghiệp cao cấp tại Việt Nam: polo, sơ mi, veston, quần tây, váy công sở, áo thun, bảo hộ lao động. Thiết kế chuẩn form – sản xuất trực tiếp – giá cạnh tranh.",

  alternates: {
    canonical: baseUrl,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title:
      "T-Kap | Xưởng Sản Xuất Áo Polo & Đồng Phục Doanh Nghiệp",
    description:
      "Xưởng sản xuất áo polo và đồng phục doanh nghiệp cao cấp. Thiết kế riêng – may trực tiếp – tối ưu chi phí cho doanh nghiệp.",
    url: baseUrl,
    siteName: "T-Kap",
    type: "website",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "T-Kap Sản Xuất Áo Polo & Đồng Phục Doanh Nghiệp",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "T-Kap | Sản Xuất Áo Polo & Đồng Phục",
    description:
      "Xưởng may áo polo và đồng phục doanh nghiệp cao cấp tại Việt Nam.",
    images: [`${baseUrl}/og-image.jpg`],
  },

  keywords: [
    "sản xuất áo polo",
    "xưởng may áo polo",
    "đồng phục doanh nghiệp",
    "áo polo đồng phục",
    "may đồng phục công ty",
    "xưởng may đồng phục giá tốt",
    "T-Kap",
  ],
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "T-Kap",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "T-Kap là xưởng sản xuất áo polo và đồng phục doanh nghiệp cao cấp tại Việt Nam.",
    address: {
      "@type": "PostalAddress",
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