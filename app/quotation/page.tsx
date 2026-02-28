
import { Metadata } from "next";
import dynamic from "next/dynamic";

const ClientApp = dynamic(() => import("@/app/ClientApp"), { ssr: false });

export const metadata: Metadata = {
  title: "Get a Quotation | T-kap Fashion",
  description: "Request a quotation for bespoke tailoring and luxury ready-to-wear. Masterfully engineered fabrics meeting a century of tailoring heritage.",
};

export default function QuotationPage() {
  return <ClientApp />;
}
