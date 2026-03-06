import dynamic from "next/dynamic";

const ClientApp = dynamic(() => import("../ClientApp"), { ssr: false });

export default function LandingPage({ params }: { params: { slug: string } }) {
  return <ClientApp landingSlug={params.slug} />;
}