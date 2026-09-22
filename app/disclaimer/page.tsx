import type { Metadata } from "next";
import legal from "@/data/legal.json";
import LegalPage from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: legal.disclaimer.title,
  description: legal.disclaimer.heading,
};

export default function Page() {
  return <LegalPage document={legal.disclaimer} />;
}
