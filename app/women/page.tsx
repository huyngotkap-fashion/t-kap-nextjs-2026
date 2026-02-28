
import { Metadata } from "next";
import dynamic from "next/dynamic";

const ClientApp = dynamic(() => import("@/app/ClientApp"), { ssr: false });

export const metadata: Metadata = {
  title: "Women's Collection | Luxury Tailoring",
  description: "Explore the T-kap Fashion Women's Collection. Masterfully engineered fabrics meeting a century of tailoring heritage.",
};

export default function WomenPage() {
  return <ClientApp />;
}
