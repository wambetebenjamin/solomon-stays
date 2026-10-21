import type { Metadata } from "next";
import Link from "next/link";
import { ComparisonMatrix, FaqAccordion, PricingCards } from "@/components/pricing/pricing-table";

export const metadata: Metadata = {
  title: "Pricing, hotel analytics plans in Kenyan shillings",
  description:
    "Starter at KES 3,500 a month for up to 30 rooms, Growth at KES 7,500 for up to 100 rooms, and Enterprise pricing for groups. Monthly or annual billing.",
};

export default function PricingPage() {
  return (
    <>
      <section className="ss-page-banner">
        <div className="container">
          <div className="ss-breadcrumb">
            <Link href="/">Home</Link> / <span>Pricing</span>
          </div>
          <h1>Pricing built for Kenyan hotels</h1>
          <p>
            One property, one price in shillings, no per user charges. Every plan starts with a free 14 day
            trial and no credit card.
          </p>
        </div>
      </section>

      <section className="ss-section tight">
        <div className="container">
          <PricingCards />
        </div>
      </section>

      <section className="ss-section grey">
        <div className="container">
          <div className="ss-section-title centre">
            <span className="ss-title-rule" />
            <h2>Compare every feature</h2>
            <p>Everything included in each plan, written plainly so procurement can read it in one pass.</p>
          </div>
          <ComparisonMatrix />
          <p className="panel-note" style={{ marginTop: 12 }}>
            Room limits apply per property. Annual billing is charged once for ten months, giving two months
            free. Prices exclude VAT.
          </p>
        </div>
      </section>

      <section className="ss-section">
        <div className="container">
          <div className="row">
            <div className="col-xl-5 col-lg-5 col-md-12">
              <div className="ss-section-title left-rule">
                <h2>Questions hotel managers ask before signing up</h2>
                <p>
                  If your question is not here, message us on WhatsApp at +254 112 272 061 and a revenue
                  manager, not a call centre, will reply.
                </p>
                <div style={{ marginTop: 22 }}>
                  <Link href="/contact" className="ss-btn">
                    Book a demo
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-7 col-lg-7 col-md-12">
              <FaqAccordion />
            </div>
          </div>
        </div>
      </section>

      <section className="ss-cta-band">
        <div className="container">
          <h2>Free 14 day trial. No credit card required.</h2>
          <p>Start today, import your rooms and history, and read your first 30 day forecast this week.</p>
          <div className="ss-hero-actions">
            <Link href="/auth/signup" className="book_btn">
              Start Free Trial
            </Link>
            <Link href="/demo" className="btn-custom">
              View Live Demo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
