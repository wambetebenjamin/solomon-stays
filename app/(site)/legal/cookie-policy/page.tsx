import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { LEGAL_DOCUMENTS } from "@/lib/legalContent";

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "The cookies and local storage Solomon Stays uses, how long they last, and how to change your preferences.",
};

export default function CookiePolicyPage() {
  return <LegalPage document={LEGAL_DOCUMENTS["cookie-policy"]} />;
}
