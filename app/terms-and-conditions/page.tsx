import type { Metadata } from "next";
import legal from "@/data/legal.json";
import LegalPage from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: legal.terms.title,
  description: legal.terms.heading,
};

export default function Page() {
  return <LegalPage document={legal.terms} />;
}
