
import { Metadata } from "next";
import dynamic from "next/dynamic";

const ClientApp = dynamic(() => import("@/app/ClientApp"), { ssr: false });

export const metadata: Metadata = {
  title: "Journal | T-kap Fashion",
  description: "Read the latest from T-kap Fashion Journal. Insights into luxury tailoring, executive elegance, and masterfully engineered fabrics.",
};

export default function JournalPage() {
  return <ClientApp />;
}
