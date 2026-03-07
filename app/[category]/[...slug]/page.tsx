import dynamic from "next/dynamic";

const ClientApp = dynamic(() => import("../../ClientApp"), { ssr: false });

export default function CategoryPage({
  params,
}: {
  params: { category: string; slug?: string[] };
}) {
  const fullSlug = [params.category, ...(params.slug || [])].join("/");

  return <ClientApp landingSlug={fullSlug} />;
}