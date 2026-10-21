import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarRange,
  Gauge,
  LineChart,
  Network,
  PieChart,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import { HeroEntrance } from "@/components/hero-entrance";
import { DemoPreview } from "@/components/marketing/demo-preview";
import { TESTIMONIALS, getTodayRecord } from "@/lib/seedData";
import { formatKes } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Hotel occupancy prediction and revenue analytics for Kenya",
  description:
    "Solomon Stays gives Kenyan hotel managers real time occupancy, a 30 day demand forecast, RevPAR and ADR tracking, channel profitability and one click reports. Free 14 day trial, no credit card.",
};

const PAIN_POINTS = [
  {
    index: "01",
    title: "No demand forecasting",
    body: "Rates are set on instinct the week before arrival. Without a forecast, shoulder season weeks sell too cheap and peak weekends sell out at yesterday's price.",
  },
  {
    index: "02",
    title: "Manual pricing decisions",
    body: "Rate changes wait for a Monday meeting that never happens. Friday and Saturday demand is priced the same as a Tuesday, and the gap never shows up in a spreadsheet.",
  },
  {
    index: "03",
    title: "No real time room status",
    body: "Housekeeping, front desk and reservations all keep their own list. Available rooms get sold as occupied, and maintenance rooms stay blocked for days.",
  },
];

const FEATURES = [
  {
    icon: Gauge,
    title: "Real time occupancy dashboard",
    body: "Six headline KPIs refresh from your property data: occupancy, RevPAR, ADR, revenue, rooms available and tomorrow's forecast.",
  },
  {
    icon: TrendingUp,
    title: "30 day demand forecast",
    body: "A deterministic model weighs the same day of week across your history, then adjusts for Kenyan school terms and public holidays.",
  },
  {
    icon: LineChart,
    title: "RevPAR tracking",
    body: "Revenue per available room against ADR, so you can see whether a rate increase actually earned more money for the hotel.",
  },
  {
    icon: Network,
    title: "Channel comparison",
    body: "Direct, OTA, walk-in and corporate side by side, with commission and net revenue, so the cheapest channel stops looking like the best one.",
  },
  {
    icon: CalendarRange,
    title: "Seasonal trend analysis",
    body: "The same month across three years, with school holiday and public holiday peaks marked, plus a written insight under each chart.",
  },
  {
    icon: ReceiptText,
    title: "One click PDF and CSV reports",
    body: "Daily, weekly, monthly and occupancy versus forecast reports generated in the browser, downloadable, and scheduled to your team by email.",
  },
];

const PRICING = [
  {
    name: "Starter",
    price: 3500,
    description: "For a single guest house finding its first reliable numbers.",
    features: [
      "1 property",
      "Up to 30 rooms",
      "Occupancy and revenue dashboard",
      "30 day demand forecast",
      "PDF and CSV reports",
      "Email support",
    ],
    featured: false,
  },
  {
    name: "Growth",
    price: 7500,
    description: "For independent hotels running a full revenue calendar.",
    features: [
      "1 property",
      "Up to 100 rooms",
      "Everything in Starter",
      "Channel profitability analysis",
      "Seasonal trend insights",
      "Scheduled email reports",
      "WhatsApp support",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: null,
    description: "For hospitality groups and management companies.",
    features: [
      "Multiple properties",
      "Property selector for managers",
      "Group level revenue reporting",
      "Custom onboarding and data import",
      "Dedicated account manager",
      "Service level agreement",
    ],
    featured: false,
  },
];

export default function HomePage() {
  const today = getTodayRecord();

  return (
    <>
      <HeroEntrance>
        <section className="ss-hero">
          <div className="ss-hero-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/banner1.jpg"
              alt="Nairobi hotel room overlooking the city skyline at dusk"
              width={1568}
              height={784}
            />
          </div>
          <div className="ss-hero-inner">
            <div className="container">
              <div className="row">
                <div className="col-xl-7 col-lg-7 col-md-12">
                  <div className="ss-hero-copy">
                    <span className="ss-eyebrow">Know your rooms. Grow your revenue.</span>
                    <h1>
                      Occupancy forecasting built for <em>Kenyan hotels</em>
                    </h1>
                    <p>
                      Solomon Stays turns your reservation history into a 30 day demand forecast, a live
                      occupancy view and a revenue report your owners will read. No spreadsheets, no guessing
                      on Friday rates.
                    </p>
                    <div className="ss-hero-actions">
                      <Link href="/auth/signup" className="book_btn">
                        Start Free Trial
                      </Link>
                      <Link href="/demo" className="btn-custom">
                        View Live Demo
                      </Link>
                    </div>
                    <div className="ss-hero-stats">
                      <div>
                        <strong>30 days</strong>
                        <span>Demand forecast horizon</span>
                      </div>
                      <div>
                        <strong>6 KPIs</strong>
                        <span>One revenue dashboard</span>
                      </div>
                      <div>
                        <strong>14 days</strong>
                        <span>Free, no card needed</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 offset-xl-1 col-lg-5 col-md-12">
                  <div className="ss-hero-panel">
                    <h2>Demo Hotel, Nairobi today</h2>
                    <div className="ss-panel-row">
                      <span>Occupancy</span>
                      <b className="accent">{today.occupancy}%</b>
                    </div>
                    <div className="ss-panel-row">
                      <span>RevPAR</span>
                      <b>{formatKes(today.revpar)}</b>
                    </div>
                    <div className="ss-panel-row">
                      <span>ADR</span>
                      <b>{formatKes(today.adr)}</b>
                    </div>
                    <div className="ss-panel-row">
                      <span>Rooms occupied</span>
                      <b>
                        {today.roomsOccupied}
                        <small style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}> / {today.totalRooms}</small>
                      </b>
                    </div>
                    <p className="ss-panel-note">
                      Sample data from the product demo. Sign up to connect your own rooms and rates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </HeroEntrance>

      <section className="ss-section">
        <div className="container">
          <div className="row">
            <div className="col-xl-5 col-lg-5 col-md-12">
              <div className="ss-section-title left-rule" style={{ marginBottom: 30 }}>
                <h2>Most Kenyan hotels still manage occupancy on spreadsheets.</h2>
                <p>
                  The data exists, in the property management system, the OTA extranets and the front desk
                  notebook. What is missing is a single view that turns that history into tomorrow's price.
                </p>
              </div>
              <Link href="/demo" className="read_more" style={{ maxWidth: 190 }}>
                See the difference
              </Link>
            </div>
            <div className="col-xl-7 col-lg-7 col-md-12">
              <div className="row">
                {PAIN_POINTS.map((point) => (
                  <div className="col-md-12" key={point.index}>
                    <div className="ss-pain" style={{ display: "flex", gap: 22, marginBottom: 16 }}>
                      <div className="ss-pain-index" style={{ margin: 0 }}>
                        {point.index}
                      </div>
                      <div>
                        <h3>{point.title}</h3>
                        <p>{point.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ss-section grey">
        <div className="container">
          <div className="ss-section-title centre">
            <span className="ss-title-rule" />
            <h2>Everything a revenue manager needs, nothing they do not</h2>
            <p>
              Six tools that replace the spreadsheet, the wall chart and the Friday morning guesswork. Built
              with the rhythm of Kenyan school terms, public holidays and corporate travel in mind.
            </p>
          </div>
          <div className="row">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div className="col-xl-4 col-lg-4 col-md-6" key={feature.title} style={{ marginBottom: 24 }}>
                  <div className="ss-feature">
                    <div className="ss-feature-icon">
                      <Icon size={21} aria-hidden="true" />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <DemoPreview />

      <section className="ss-section">
        <div className="container">
          <div className="ss-section-title centre">
            <span className="ss-title-rule" />
            <h2>Straightforward pricing in Kenyan shillings</h2>
            <p>
              Monthly billing, cancel any time, and a 14 day trial on every plan. Enterprise pricing is
              quoted after a short call about your properties.
            </p>
          </div>
          <div className="row">
            {PRICING.map((plan) => (
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
                    {plan.price ? (
                      <>
                        KES {plan.price.toLocaleString("en-KE")}
                        <small>per month</small>
                      </>
                    ) : (
                      <>
                        Custom
                        <small>quoted per group</small>
                      </>
                    )}
                  </div>
                  <ul className="ss-price-list">
                    {plan.features.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <Link href={plan.price ? "/auth/signup" : "/contact"} className={plan.featured ? "ss-btn" : "ss-btn outline"}>
                    {plan.price ? "Start free trial" : "Request a quote"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <Link href="/pricing" style={{ color: "#ff0909", fontWeight: 500, fontSize: 14 }}>
              Compare every plan feature by feature
            </Link>
          </div>
        </div>
      </section>

      <section className="ss-section grey">
        <div className="container">
          <div className="ss-section-title centre">
            <span className="ss-title-rule" />
            <h2>Hotel managers who stopped guessing</h2>
            <p>Three revenue teams using Solomon Stays across Nairobi, Kisumu and Mombasa.</p>
          </div>
          <div className="row">
            {TESTIMONIALS.map((item) => (
              <div className="col-xl-4 col-lg-4 col-md-12" key={item.name} style={{ marginBottom: 24 }}>
                <div className="ss-testimonial">
                  <p>{item.quote}</p>
                  <div className="ss-testimonial-name">{item.name}</div>
                  <div className="ss-testimonial-role">{item.role}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="row" style={{ marginTop: 16 }}>
            <div className="col-xl-4 col-lg-4 col-md-4 col-12">
              <div style={{ textAlign: "center" }}>
                <div className="kpi-value" style={{ fontSize: 38 }}>
                  12%
                </div>
                <p style={{ fontSize: 13 }}>Average RevPAR lift in the first quarter</p>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4 col-12">
              <div style={{ textAlign: "center" }}>
                <div className="kpi-value" style={{ fontSize: 38 }}>
                  9 hrs
                </div>
                <p style={{ fontSize: 13 }}>Reporting time saved every month</p>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4 col-12">
              <div style={{ textAlign: "center" }}>
                <div className="kpi-value" style={{ fontSize: 38 }}>
                  3 clicks
                </div>
                <p style={{ fontSize: 13 }}>From dashboard to a report for the owners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ss-cta-band">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-8 col-md-12">
              <h2>Start a free 14 day trial. No credit card required.</h2>
              <p>
                Connect your rooms, import your history and see your first 30 day forecast before you pay
                anything. Our team will help you load the data on a short WhatsApp call.
              </p>
              <div className="ss-hero-actions">
                <Link href="/auth/signup" className="book_btn">
                  Start Free Trial
                </Link>
                <Link href="/contact" className="btn-custom">
                  Book a demo
                </Link>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12">
              <div className="ss-hero-panel" style={{ marginTop: 0 }}>
                <h2>Talk to a revenue manager</h2>
                <p style={{ fontSize: 13.5, lineHeight: "24px", color: "rgba(255,255,255,0.74)" }}>
                  WhatsApp +254 112 272 061. We reply within one business day and can walk through your
                  occupancy history before you sign up.
                </p>
                <div className="ss-hero-actions" style={{ marginTop: 18 }}>
                  <a
                    href="https://wa.me/254112272061?text=Hello%20Solomon%20Stays%2C%20I%20would%20like%20to%20set%20up%20an%20occupancy%20dashboard%20for%20my%20hotel."
                    className="btn-custom"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 14, padding: "10px 26px" }}
                  >
                    Message us <ArrowRight size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ss-section tight">
        <div className="container">
          <div className="row" style={{ alignItems: "center" }}>
            <div className="col-xl-6 col-lg-6 col-md-12">
              <div className="ss-section-title left-rule" style={{ marginBottom: 0 }}>
                <h2>Built around how Kenyan hotels actually sell rooms</h2>
                <p>
                  School term breaks, Mashujaa Day weekends, diaspora season in July and August, corporate
                  allotments in Nairobi and conference weeks in Kisumu. The forecast knows all of it, and the
                  dashboard shows you what each one is worth.
                </p>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12">
              <div className="row">
                <div className="col-6" style={{ marginBottom: 16 }}>
                  <div className="panel">
                    <div className="kpi-label">
                      <BarChart3 size={14} aria-hidden="true" /> Channel net revenue
                    </div>
                    <div className="kpi-value" style={{ fontSize: 26 }}>
                      68%
                    </div>
                    <div className="kpi-foot">Direct and corporate after commission</div>
                  </div>
                </div>
                <div className="col-6" style={{ marginBottom: 16 }}>
                  <div className="panel">
                    <div className="kpi-label">
                      <PieChart size={14} aria-hidden="true" /> OTA share
                    </div>
                    <div className="kpi-value" style={{ fontSize: 26 }}>
                      41%
                    </div>
                    <div className="kpi-foot">18% commission on every booked night</div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="insight-card" style={{ marginTop: 0 }}>
                    <div className="insight-label">Insight</div>
                    <p>
                      December historically shows your highest occupancy at 87 percent. Consider adjusting
                      rates by 15 to 20 percent from December 15 onward.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
