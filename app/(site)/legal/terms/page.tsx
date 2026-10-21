import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL_DOCUMENTS } from "@/lib/legalContent";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "The agreement between Solomon Stays and the hotel or hospitality business using the occupancy analytics dashboard.",
};

export default function TermsPage() {
  return <LegalPage document={LEGAL_DOCUMENTS.terms} />;
}
