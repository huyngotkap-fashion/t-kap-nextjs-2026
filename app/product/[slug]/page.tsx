import { Metadata } from "next";
import dynamic from "next/dynamic";
import { getDocumentOnce } from "@/services/firestoreService";
import JsonLd from "@/components/JsonLd";

const ClientApp = dynamic(() => import("@/app/ClientApp"), { ssr: false });

type Props = {
  params: { slug: string };
};

const baseUrl = process.env.APP_URL || "https://t-kap.com.vn";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const id = slug.split("-").pop() || "";

  const product: any = await getDocumentOnce("products", id);

  if (!product) {
    return {
      title: "Product Not Found | T-kap Fashion",
      description: "The product you are looking for does not exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const productUrl = `${baseUrl}/product/${slug}`;

  return {
    title: `${product.name} | T-kap Fashion Luxury`,
    description:
      product.description ||
      `Discover ${product.name} at T-kap Fashion. Premium bespoke tailoring crafted for modern gentlemen.`,
    alternates: {
      canonical: productUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      url: productUrl,
      siteName: "T-kap Fashion",
      type: "website",
      images: [
        {
          url: product.imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const slug = params.slug;
  const id = slug.split("-").pop() || "";

  const product: any = await getDocumentOnce("products", id);

  if (!product) return null;

  const productUrl = `${baseUrl}/product/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.imageUrl],
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand || "T-kap Fashion",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ClientApp />
    </>
  );
}