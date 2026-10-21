import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DashboardTabs } from "@/components/dashboard/overview-tabs";
import {
  getChannelMonths,
  getChannels,
  getKpis,
  getRevenueSeries,
  getRoomTypeOccupancy,
} from "@/lib/dashboardData";
import { combinedForecastSeries } from "@/lib/occupancyPredictor";
import { getDailyHistory, getRooms, getSeasonality, SEASONAL_INSIGHTS } from "@/lib/seedData";
import { longLabel } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Live demo, hotel occupancy dashboard",
  description:
    "Explore the full Solomon Stays dashboard with six months of sample data for a fictional 80 room hotel in Nairobi. Occupancy, forecast, channels, seasonality and reports.",
};

export default function DemoPage() {
  const history = getDailyHistory();
  const kpis = getKpis("Demo Hotel, Nairobi");
  const revenue = getRevenueSeries(30).map((record) => ({
    date: record.date,
    revenue: record.revenue,
    adr: record.adr,
    revpar: record.revpar,
  }));

  return (
    <>
      <section className="ss-page-banner" style={{ padding: "40px 0" }}>
        <div className="container">
          <div className="ss-breadcrumb">
            <Link href="/">Home</Link> / <span>Live demo</span>
          </div>
          <h1>Demo Hotel, Nairobi, 80 rooms</h1>
          <p>
            Six months of sample history, fully interactive charts, and every report type. This is the exact
            product your team signs into, loaded with demo data.
          </p>
        </div>
      </section>

      <div className="ss-demo-banner">
        <div className="container">
          <div className="ss-demo-inner">
            <p>
              <strong style={{ color: "#ffffff" }}>This is demo data.</strong> Sign up to connect your hotel
              and forecast your own rooms.
            </p>
            <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
              <Link href="/auth/signup">
                Start free trial <ArrowRight size={13} style={{ verticalAlign: "middle" }} aria-hidden="true" />
              </Link>
              <Link href="/pricing">See pricing</Link>
            </div>
          </div>
        </div>
      </div>

      <section style={{ background: "var(--ss-grey)", padding: "28px 0 60px 0" }}>
        <div className="container">
          <div className="dash-section-title" style={{ marginTop: 0 }}>
            <div>
              <h2>Overview for {longLabel(kpis.date)}</h2>
              <p>Read only demo, data for a fictional property. Figures update daily from the sample set.</p>
            </div>
            <span className="ss-badge red">Demo data</span>
          </div>

          <DashboardTabs
            kpis={kpis}
            forecast={combinedForecastSeries(history)}
            revenue={revenue}
            roomTypeOccupancy={getRoomTypeOccupancy(7)}
            channels={getChannels()}
            channelMonths={getChannelMonths()}
            seasonality={getSeasonality()}
            insights={SEASONAL_INSIGHTS}
            rooms={getRooms()}
            reportingEmail="revenue@demo-hotel.co.ke"
            demo
          />

          <div className="panel" style={{ marginTop: 30, borderTop: "4px solid var(--ss-red)" }}>
            <div className="row" style={{ alignItems: "center" }}>
              <div className="col-xl-8 col-lg-8 col-md-12">
                <h3 style={{ fontSize: 21 }}>Ready to see these numbers for your own hotel?</h3>
                <p style={{ fontSize: 13.5, color: "var(--ss-body)", lineHeight: "24px" }}>
                  Start a free 14 day trial, import your room list and booking history, and we will help you
                  read the first forecast together.
                </p>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-12">
                <div className="report-actions" style={{ justifyContent: "flex-end", marginTop: 0 }}>
                  <Link href="/auth/signup" className="ss-btn">
                    Start Free Trial
                  </Link>
                  <Link href="/contact" className="ss-btn outline">
                    Book a demo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
