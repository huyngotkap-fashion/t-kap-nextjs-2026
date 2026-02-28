
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { getDocumentOnce } from "@/services/firestoreService";
import JsonLd from "@/components/JsonLd";

const ClientApp = dynamic(() => import("@/app/ClientApp"), { ssr: false });

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const parts = slug.split("-");
  const id = parts[parts.length - 1];

  const product = await getDocumentOnce("products", id) as any;

  if (!product) {
    return {
      title: "Product Not Found | T-kap Fashion",
    };
  }

  return {
    title: `${product.name} | T-kap Fashion Luxury`,
    description: product.description || `Discover ${product.name} at T-kap Fashion. Masterfully engineered fabrics meeting a century of tailoring heritage.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const slug = params.slug;
  const parts = slug.split("-");
  const id = parts[parts.length - 1];
  const product = await getDocumentOnce("products", id) as any;

  const jsonLd = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.imageUrl,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "T-kap Fashion"
    },
    "offers": {
      "@type": "Offer",
      "url": `${process.env.APP_URL}/product/${slug}`,
      "priceCurrency": "USD",
      "price": product.price,
      "availability": "https://schema.org/InStock"
    }
  } : null;

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <ClientApp />
    </>
  );
}
