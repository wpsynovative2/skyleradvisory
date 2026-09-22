import type { Metadata } from "next";
import legal from "@/data/legal.json";
import LegalPage from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: legal.privacy.title,
  description: legal.privacy.heading,
};

export default function Page() {
  return <LegalPage document={legal.privacy} />;
}
