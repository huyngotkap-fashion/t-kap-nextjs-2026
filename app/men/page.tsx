
import { Metadata } from "next";
import dynamic from "next/dynamic";

const ClientApp = dynamic(() => import("@/app/ClientApp"), { ssr: false });

export const metadata: Metadata = {
  title: "Men's Collection | Luxury Tailoring",
  description: "Explore the T-kap Fashion Men's Collection. Masterfully engineered fabrics meeting a century of tailoring heritage.",
};

export default function MenPage() {
  return <ClientApp />;
}
