import { Metadata } from "next";
import dynamic from "next/dynamic";

const ClientApp = dynamic(() => import("@/app/ClientApp"), { ssr: false });

export const metadata: Metadata = {
  title: "Journal | T-Kap Fashion Insights & Tailoring Stories",
  description:
    "Explore T-Kap Journal for insights into luxury tailoring, fabric innovations, bespoke craftsmanship, and modern gentleman style.",

  keywords: [
    "luxury tailoring",
    "bespoke suit",
    "men style guide",
    "tailoring journal",
    "T-Kap fashion blog",
  ],

  openGraph: {
    title: "T-Kap Journal | Luxury Tailoring & Style Stories",
    description:
      "Discover craftsmanship, style guides, and fabric expertise from T-Kap Fashion.",
    url: "https://t-kap.com.vn/journal",
    siteName: "T-Kap Fashion",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "T-Kap Journal",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },

  alternates: {
    canonical: "https://t-kap.com.vn/journal",
  },
};

export default function JournalPage() {
  return <ClientApp />;
}