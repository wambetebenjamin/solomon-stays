import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL_DOCUMENTS } from "@/lib/legalContent";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Solomon Stays collects, uses and protects hotel and guest data under the Kenya Data Protection Act 2019.",
};

export default function PrivacyPolicyPage() {
  return <LegalPage document={LEGAL_DOCUMENTS["privacy-policy"]} />;
}
