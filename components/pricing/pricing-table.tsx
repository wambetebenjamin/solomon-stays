"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    monthly: 3500,
    description: "A single guest house or small hotel finding its first reliable numbers.",
    limits: "1 property, up to 30 rooms",
    features: [
      "Occupancy, RevPAR and ADR dashboard",
      "30 day demand forecast",
      "Room status grid",
      "Daily and monthly PDF reports",
      "CSV exports",
      "Email support",
    ],
    featured: false,
    cta: "Start free trial",
    href: "/auth/signup",
  },
  {
    name: "Growth",
    monthly: 7500,
    description: "Independent hotels running a full revenue calendar and a channel mix.",
    limits: "1 property, up to 100 rooms",
    features: [
      "Everything in Starter",
      "Channel profitability analysis",
      "Seasonal trend insights",
      "Booking log with filters",
      "Scheduled email reports",
      "Occupancy versus forecast report",
      "WhatsApp support",
    ],
    featured: true,
    cta: "Start free trial",
    href: "/auth/signup",
  },
  {
    name: "Enterprise",
    monthly: null,
    description: "Hospitality groups, management companies and multi property operators.",
    limits: "Multiple properties, custom room count",
    features: [
      "Everything in Growth",
      "Multi property selector",
      "Group level revenue reporting",
      "Custom onboarding and data import",
      "Dedicated account manager",
      "Service level agreement",
      "Invoice billing in KES or USD",
    ],
    featured: false,
    cta: "Request a quote",
    href: "/contact",
  },
];

const MATRIX = [
  { feature: "Occupancy and revenue dashboard", starter: true, growth: true, enterprise: true },
  { feature: "30 day demand forecast", starter: true, growth: true, enterprise: true },
  { feature: "Room status grid", starter: true, growth: true, enterprise: true },
  { feature: "Room management and booking log", starter: true, growth: true, enterprise: true },
  { feature: "Channel profitability analysis", starter: false, growth: true, enterprise: true },
  { feature: "Seasonal trend insight cards", starter: false, growth: true, enterprise: true },
  { feature: "Scheduled email reports", starter: false, growth: true, enterprise: true },
  { feature: "Occupancy versus forecast report", starter: false, growth: true, enterprise: true },
  { feature: "Multi property selector", starter: false, growth: false, enterprise: true },
  { feature: "Group level reporting", starter: false, growth: false, enterprise: true },
  { feature: "Dedicated account manager", starter: false, growth: false, enterprise: true },
  { feature: "Custom data import", starter: false, growth: false, enterprise: true },
];

const FAQS = [
  {
    question: "How is the 30 day forecast calculated?",
    answer:
      "The forecast uses a weighted moving average of the same day of week across your recorded history, adjusted by a seasonal month index and flags for Kenyan school breaks and public holidays. It is a deterministic formula, so the same data always produces the same forecast. No external AI service is called.",
  },
  {
    question: "Do I need a credit card to start the trial?",
    answer:
      "No. The 14 day trial starts without payment details. At the end of the trial you choose a plan, or your workspace pauses and keeps your data for 30 days.",
  },
  {
    question: "Which property management systems can you import from?",
    answer:
      "We import CSV exports from the common property management and channel manager tools used in Kenya, including reservation exports, room lists and daily close of business figures. For Enterprise, our team runs the import with you.",
  },
  {
    question: "Can I run more than one hotel on one account?",
    answer:
      "Yes on the Enterprise plan. Multi property managers get a property selector in the dashboard header and can switch between properties without signing out. Starter and Growth cover a single property.",
  },
  {
    question: "How do you handle my hotel data under the Kenya Data Protection Act?",
    answer:
      "Occupancy and revenue data is stored in your own workspace, encrypted in transit, and never sold or shared with third parties for marketing. You can export or delete your data at any time from settings.",
  },
  {
    question: "What happens if my hotel is larger than the plan room limit?",
    answer:
      "You can move up a plan at any point and the change is prorated. Above 100 rooms we usually recommend an Enterprise quote because there is normally more than one property or department involved.",
  },
];

export function PricingCards() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: 34 }}>
        <div className="ss-billing-toggle" role="group" aria-label="Billing period">
          <button type="button" className={annual ? "" : "active"} onClick={() => setAnnual(false)} aria-pressed={!annual}>
            Monthly
          </button>
          <button type="button" className={annual ? "active" : ""} onClick={() => setAnnual(true)} aria-pressed={annual}>
            Annual
          </button>
        </div>
        <span className="ss-save-note">
          {annual ? "Two months free on annual billing" : "Switch to annual and save two months"}
        </span>
      </div>

      <div className="row">
        {PLANS.map((plan) => {
          const price = plan.monthly === null ? null : annual ? plan.monthly * 10 : plan.monthly;
          return (
            <div className="col-xl-4 col-lg-4 col-md-12" key={plan.name} style={{ marginBottom: 24 }}>
              <div className={`ss-price-card${plan.featured ? " featured" : ""}`}>
                <h3>
                  {plan.name}
                  {plan.featured && (
                    <span className="ss-badge red" style={{ marginLeft: 10, verticalAlign: "middle" }}>
                      Most popular
                    </span>
                  )}
                </h3>
                <div className="ss-price-desc">{plan.description}</div>
                <div className="ss-price-amount">
                  {price === null ? (
                    <>
                      Custom
                      <small>quoted per group</small>
                    </>
                  ) : (
                    <>
                      KES {price.toLocaleString("en-KE")}
                      <small>{annual ? "per year" : "per month"}</small>
                    </>
                  )}
                </div>
                <div className="ss-tag">{plan.limits}</div>
                <ul className="ss-price-list">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link href={plan.href} className={plan.featured ? "ss-btn" : "ss-btn outline"}>
                  {plan.cta}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function ComparisonMatrix() {
  return (
    <div className="ss-table-wrap">
      <table className="ss-table matrix">
        <thead>
          <tr>
            <th scope="col">Feature</th>
            <th scope="col">Starter</th>
            <th scope="col">Growth</th>
            <th scope="col">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {MATRIX.map((row) => (
            <tr key={row.feature}>
              <td>{row.feature}</td>
              <td>{row.starter ? <span className="ss-check">Included</span> : <span className="ss-dash">Not included</span>}</td>
              <td>{row.growth ? <span className="ss-check">Included</span> : <span className="ss-dash">Not included</span>}</td>
              <td>{row.enterprise ? <span className="ss-check">Included</span> : <span className="ss-dash">Not included</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      {FAQS.map((faq, index) => {
        const isOpen = open === index;
        return (
          <div className="ss-accordion-item" key={faq.question}>
            <button
              type="button"
              className="ss-accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${index}`}
              id={`faq-trigger-${index}`}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              {faq.question}
              <span className="ss-acc-icon" aria-hidden="true">
                {isOpen ? <Minus size={16} /> : <Plus size={16} />}
              </span>
            </button>
            {isOpen && (
              <div className="ss-accordion-panel" id={`faq-panel-${index}`} role="region" aria-labelledby={`faq-trigger-${index}`}>
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
