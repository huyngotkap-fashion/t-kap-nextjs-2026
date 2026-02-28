
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
  title: {
    default: "T-kap Fashion | Luxury Tailoring & Executive Elegance",
    template: "%s | T-kap Fashion",
  },
  description: "An icon of executive elegance. Masterfully engineered fabrics meeting a century of tailoring heritage. Premium bespoke tailoring and luxury ready-to-wear.",
  keywords: ["luxury fashion", "bespoke tailoring", "executive elegance", "T-kap Fashion", "luxury suits", "Vietnam tailoring"],
  authors: [{ name: "T-kap Fashion" }],
  creator: "T-kap Fashion",
  publisher: "T-kap Fashion",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.APP_URL || "https://t-kap.com.vn"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "https://res.cloudinary.com/dozhznwuf/image/upload/v1768206325/logo-tkap_hrspdt.png",
    apple: "https://res.cloudinary.com/dozhznwuf/image/upload/v1768206325/logo-tkap_hrspdt.png",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://t-kap.com.vn",
    siteName: "T-kap Fashion",
    title: "T-kap Fashion | Luxury Tailoring",
    description: "An icon of executive elegance. Masterfully engineered fabrics meeting a century of tailoring heritage.",
    images: [
      {
        url: "https://res.cloudinary.com/dozhznwuf/image/upload/v1768206325/logo-tkap_hrspdt.png",
        width: 1200,
        height: 630,
        alt: "T-kap Fashion Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "T-kap Fashion | Luxury Tailoring",
    description: "An icon of executive elegance. Masterfully engineered fabrics meeting a century of tailoring heritage.",
    images: ["https://res.cloudinary.com/dozhznwuf/image/upload/v1768206325/logo-tkap_hrspdt.png"],
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
        {children}
      </body>
    </html>
  );
}
