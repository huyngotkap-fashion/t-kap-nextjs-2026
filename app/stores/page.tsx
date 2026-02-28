
import { Metadata } from "next";
import dynamic from "next/dynamic";

const ClientApp = dynamic(() => import("@/app/ClientApp"), { ssr: false });

export const metadata: Metadata = {
  title: "Store Locator | T-kap Fashion",
  description: "Find a T-kap Fashion store near you. Experience masterfully engineered fabrics and a century of tailoring heritage.",
};

export default function StoresPage() {
  return <ClientApp />;
}
