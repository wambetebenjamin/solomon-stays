export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalDocument {
  title: string;
  subtitle: string;
  updated: string;
  sections: LegalSection[];
}

export const LEGAL_DOCUMENTS: Record<"privacy-policy" | "terms" | "cookie-policy", LegalDocument> = {
  "privacy-policy": {
    title: "Privacy policy",
    subtitle:
      "How Solomon Stays collects, uses and protects hotel data and personal information under the Kenya Data Protection Act 2019.",
    updated: "Last updated 1 October 2026",
    sections: [
      {
        heading: "1. Who we are",
        paragraphs: [
          "Solomon Stays is a hotel occupancy prediction and revenue management analytics product operated from Westlands, Nairobi, Kenya. We are the data controller for the account information you give us, and a data processor for the reservation and occupancy data you load into your workspace.",
          "You can reach us on WhatsApp at +254 112 272 061 or by email at hello@solomonstays.co.ke.",
        ],
      },
      {
        heading: "2. Information we collect",
        bullets: [
          "Account information: your name, work email, hotel name, role and phone number.",
          "Property data: room lists, room types, rates, reservations, occupancy and revenue history that you import or enter.",
          "Guest data inside reservations: where your property management export includes guest names, we store them only to display reservations in your dashboard.",
          "Usage information: pages viewed, dashboard tabs used and reports generated, used in aggregate to improve the product.",
          "Payment and billing details, handled by our payment processor. We never store full card numbers.",
        ],
      },
      {
        heading: "3. Why we process your data",
        bullets: [
          "To provide the dashboard, forecasts, reports and notifications you request.",
          "To generate the 30 day occupancy forecast from your own recorded history.",
          "To respond to enquiries and provide support on WhatsApp or email.",
          "To meet tax, accounting and regulatory obligations in Kenya.",
          "To send product updates, where you have opted in. You can opt out at any time.",
        ],
      },
      {
        heading: "4. Legal basis for processing",
        paragraphs: [
          "We process account and property data to perform our contract with you, and guest data within reservations on your documented instructions as a processor. Marketing communications rely on your consent, and security logging relies on our legitimate interest in keeping the service safe.",
        ],
      },
      {
        heading: "5. How long we keep data",
        paragraphs: [
          "Active workspace data is kept for as long as your account is open. After closure, workspace data is retained for 30 days so you can export it, then deleted. Billing records are kept for seven years as required by Kenyan tax law. Aggregated, de identified statistics may be kept longer.",
        ],
      },
      {
        heading: "6. Who we share data with",
        bullets: [
          "Hosting and infrastructure providers, including Vercel, which operates the application and storage.",
          "Email delivery providers used for report scheduling and contact replies.",
          "Our payment processor for subscription billing.",
          "Authorities where we are legally required to disclose information.",
        ],
        paragraphs: [
          "We never sell hotel data, guest data or contact details, and we do not share them with advertising networks.",
        ],
      },
      {
        heading: "7. International transfers",
        paragraphs: [
          "Our infrastructure providers may process data outside Kenya. Where that happens we rely on contractual safeguards and standard data protection clauses, as permitted under the Kenya Data Protection Act 2019.",
        ],
      },
      {
        heading: "8. Your rights",
        bullets: [
          "Access a copy of the personal data we hold about you.",
          "Correct inaccurate information in your account or property record.",
          "Request deletion of your account and workspace data.",
          "Object to or restrict certain processing, including marketing.",
          "Request a portable export of your property data in CSV format.",
        ],
        paragraphs: [
          "Write to hello@solomonstays.co.ke to exercise any of these rights. We respond within 30 days. You may also complain to the Office of the Data Protection Commissioner in Kenya.",
        ],
      },
      {
        heading: "9. Security",
        paragraphs: [
          "Access to the dashboard requires an authenticated session, and each workspace is scoped to its own property. Data is encrypted in transit using TLS. Passwords are never stored in plain text. We review access logs and keep dependencies patched.",
        ],
      },
      {
        heading: "10. Children",
        paragraphs: [
          "Solomon Stays is a business tool for hotel staff and is not directed at children. We do not knowingly collect data from anyone under 18.",
        ],
      },
      {
        heading: "11. Changes to this policy",
        paragraphs: [
          "If we make a material change we will notify workspace administrators by email and update the date at the top of this page.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of service",
    subtitle: "The agreement between Solomon Stays and the hotel or hospitality business using the dashboard.",
    updated: "Last updated 1 October 2026",
    sections: [
      {
        heading: "1. Agreement",
        paragraphs: [
          "These terms govern your use of Solomon Stays, a hotel occupancy prediction and revenue management analytics service. By creating a workspace or using the dashboard you accept these terms on behalf of your hotel or business.",
        ],
      },
      {
        heading: "2. The trial",
        paragraphs: [
          "Every new workspace starts with a 14 day free trial. No credit card is required. At the end of the trial you may choose a plan; if you do not, the workspace becomes read only and your data is kept for 30 days before deletion.",
        ],
      },
      {
        heading: "3. Subscriptions and billing",
        bullets: [
          "Starter is KES 3,500 per month for one property of up to 30 rooms.",
          "Growth is KES 7,500 per month for one property of up to 100 rooms.",
          "Enterprise pricing is quoted per group and agreed in writing.",
          "Plans are billed monthly in advance, or annually at the equivalent of ten months.",
          "Prices exclude VAT and other applicable taxes.",
        ],
      },
      {
        heading: "4. Fair use of the forecast",
        paragraphs: [
          "The dashboard provides a deterministic occupancy forecast derived from your own history and Kenyan holiday calendars. It is a decision support tool. Room pricing, overbooking and revenue decisions remain yours, and Solomon Stays is not liable for commercial outcomes of decisions you take using the dashboard.",
        ],
      },
      {
        heading: "5. Your responsibilities",
        bullets: [
          "Keep login credentials secure and tell us promptly about unauthorised access.",
          "Ensure you have the right to load the reservation and guest data you import.",
          "Do not use the service to store unlawful content or to attempt to breach its security.",
          "Do not resell or white label the dashboard without a written agreement.",
        ],
      },
      {
        heading: "6. Availability",
        paragraphs: [
          "We aim for high availability and schedule maintenance outside Nairobi business hours where possible. Planned maintenance is announced in advance. We do not warrant uninterrupted service, and scheduled reports depend on third party email delivery.",
        ],
      },
      {
        heading: "7. Intellectual property",
        paragraphs: [
          "Solomon Stays owns the product, its code, charts, models and documentation. You own your property data. You grant us a limited licence to process that data to provide the service.",
        ],
      },
      {
        heading: "8. Cancellation",
        paragraphs: [
          "You may cancel at any time from settings. Cancellation stops future billing; the current period is not refunded. We may suspend a workspace for non payment after 14 days written notice.",
        ],
      },
      {
        heading: "9. Liability",
        paragraphs: [
          "To the extent permitted by Kenyan law, our total liability in any 12 month period is limited to the fees you paid in that period. We are not liable for indirect or consequential loss, including lost revenue or lost bookings.",
        ],
      },
      {
        heading: "10. Governing law",
        paragraphs: [
          "These terms are governed by the laws of Kenya, and the courts of Kenya have exclusive jurisdiction. We encourage you to contact us first so we can resolve a dispute directly.",
        ],
      },
    ],
  },
  "cookie-policy": {
    title: "Cookie policy",
    subtitle: "The cookies and local storage Solomon Stays uses, why, and how you control them.",
    updated: "Last updated 1 October 2026",
    sections: [
      {
        heading: "1. What we store on your device",
        paragraphs: [
          "We use a small number of cookies and browser storage entries. None of them contain payment details, and none are used for advertising networks. Your choices are stored under the local storage key solomon_stays_consent.",
        ],
      },
      {
        heading: "2. Necessary",
        bullets: [
          "Session cookies that keep you signed in to your hotel workspace.",
          "Security cookies that protect forms from abuse and cross site request forgery.",
          "solomon_stays_consent, which records your cookie choice.",
          "A one session preloader flag so the loading screen is not shown on every page.",
        ],
        paragraphs: ["Necessary storage cannot be switched off because the dashboard will not work without it."],
      },
      {
        heading: "3. Functional",
        bullets: [
          "Your selected property in a multi property account.",
          "Your last used dashboard tab.",
          "Report date ranges and preferred report type.",
        ],
      },
      {
        heading: "4. Analytics",
        paragraphs: [
          "Aggregated, non identifying usage measurement through Vercel Analytics and Speed Insights. This tells us which dashboard views are used and how quickly pages load. It is never used to identify an individual manager.",
        ],
      },
      {
        heading: "5. Marketing",
        paragraphs: [
          "If enabled, these cookies measure whether our campaigns reach hotel managers in Kenya and East Africa. Marketing cookies are off by default on your first visit.",
        ],
      },
      {
        heading: "6. Managing your choice",
        paragraphs: [
          "Use the Manage Preferences button in the cookie banner, or open the cookie preferences link in the footer at any time. You can also clear cookies and local storage in your browser settings, which resets the banner on your next visit.",
        ],
      },
      {
        heading: "7. Third parties",
        bullets: [
          "Google reCAPTCHA, which sets cookies when a form is submitted to protect against automated abuse.",
          "Vercel, which serves the application and measures performance.",
        ],
      },
    ],
  },
};
