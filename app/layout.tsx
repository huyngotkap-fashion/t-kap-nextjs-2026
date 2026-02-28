
import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
});

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "https://t-kap.com.vn"),

  title: {
    default: "T-Kap | Sản Xuất Áo Polo & Đồng Phục Doanh Nghiệp",
    template: "%s | T-kap Fashion",
  },

  description:
    "T-Kap chuyên sản xuất áo polo và đồng phục doanh nghiệp cao cấp: sơ mi, veston, quần tây, váy công sở, áo thun, bảo hộ lao động. Thiết kế chuẩn form – sản xuất trực tiếp – giá cạnh tranh.",

  keywords: [
    "T-kap Fashion",
    "bespoke tailoring Vietnam",
    "luxury suits Vietnam",
    "custom suits Ho Chi Minh",
    "executive menswear",
    "tailor Vietnam",
  ],

  authors: [{ name: "T-kap Fashion" }],
  creator: "T-kap Fashion",
  publisher: "T-kap Fashion",

  alternates: {
    canonical: "https://t-kap.com.vn",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://t-kap.com.vn",
    siteName: "T-kap Fashion",
    title: "T-kap Fashion | Luxury Bespoke Tailoring",
    description:
      "Premium bespoke tailoring and executive menswear crafted for modern gentlemen in Vietnam.",
    images: [
      {
        url: "https://res.cloudinary.com/dozhznwuf/image/upload/v1768206325/logo-tkap_hrspdt.png",
        width: 1200,
        height: 630,
        alt: "T-kap Fashion Luxury Tailoring",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "T-kap Fashion | Luxury Bespoke Tailoring",
    description:
      "Premium bespoke tailoring and executive menswear crafted for modern gentlemen.",
    images: [
      "https://res.cloudinary.com/dozhznwuf/image/upload/v1768206325/logo-tkap_hrspdt.png",
    ],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "PUT_YOUR_GOOGLE_VERIFICATION_CODE_HERE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} ${montserrat.variable} ${playfair.variable} selection:bg-black selection:text-white`}
      >
        {/* 🔥 Organization Schema for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "T-kap Fashion",
              url: "https://t-kap.com.vn",
              logo:
                "https://res.cloudinary.com/dozhznwuf/image/upload/v1768206325/logo-tkap_hrspdt.png",
              sameAs: [
                "https://facebook.com/yourpage",
                "https://instagram.com/yourpage",
              ],
            }),
          }}
        />

        {children}
      </body>
    </html>
  );
}
