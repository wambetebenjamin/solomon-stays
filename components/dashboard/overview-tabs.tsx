"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  BedDouble,
  CalendarClock,
  Info,
  PieChart as PieIcon,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { ForecastAreaChart } from "@/components/charts/forecast-area-chart";
import { RevenueLineChart } from "@/components/charts/revenue-line-chart";
import { RoomTypeBarChart, type RoomTypePoint } from "@/components/charts/room-type-bar-chart";
import { AdrRevparComposedChart } from "@/components/charts/adr-revpar-composed";
import { SourceLegendBreakdown, SourcePieChart } from "@/components/charts/source-pie-chart";
import { ChannelMonthlyBarChart } from "@/components/charts/channel-monthly-bar-chart";
import { SeasonalityLineChart, type SeasonalityPoint } from "@/components/charts/seasonality-line-chart";
import { RoomStatusPanel } from "@/components/dashboard/room-status-panel";
import { ReportsTab } from "@/components/dashboard/reports-tab";
import { formatKes, formatPercent } from "@/lib/dates";
import type { ChannelMonth, ChannelSummary, KpiSnapshot, Room } from "@/lib/types";
import type { ChartForecastPoint } from "@/lib/occupancyPredictor";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "channels", label: "Channel Analysis" },
  { id: "seasonal", label: "Seasonal Trends" },
  { id: "reports", label: "Reports" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface OverviewProps {
  kpis: KpiSnapshot;
  forecast: ChartForecastPoint[];
  revenue: Array<{ date: string; revenue: number; adr: number; revpar: number }>;
  roomTypeOccupancy: RoomTypePoint[];
  channels: ChannelSummary[];
  channelMonths: ChannelMonth[];
  seasonality: SeasonalityPoint[];
  insights: Record<string, string>;
  rooms: Room[];
  reportingEmail: string;
  demo?: boolean;
}

export function DashboardTabs(props: OverviewProps) {
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <>
      <div className="dash-tabs" role="tablist" aria-label="Dashboard sections">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            className={`dash-tab${tab === item.id ? " active" : ""}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="tab-body">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            id={`panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {tab === "overview" && <OverviewSection {...props} />}
            {tab === "channels" && <ChannelsSection channels={props.channels} months={props.channelMonths} />}
            {tab === "seasonal" && <SeasonalSection seasonality={props.seasonality} insights={props.insights} />}
            {tab === "reports" && (
              <ReportsTab
                defaultEmail={props.reportingEmail}
                demo={props.demo}
                hotelName={props.kpis.hotelName}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

function KpiRow({ kpis }: { kpis: KpiSnapshot }) {
  return (
    <div className="kpi-grid">
      <KpiCard
        label="Occupancy rate today"
        value={kpis.occupancyRate}
        suffix="%"
        decimals={1}
        delta={kpis.deltas.occupancy}
        foot={`${kpis.roomsOccupied} of ${kpis.totalRooms} rooms, vs last week`}
      />
      <KpiCard
        label="RevPAR today, KES"
        value={kpis.revpar}
        delta={kpis.deltas.revpar}
        foot="vs same day last week"
      />
      <KpiCard label="ADR today, KES" value={kpis.adr} delta={kpis.deltas.adr} foot="vs same day last week" />
      <KpiCard
        label="Total revenue today, KES"
        value={kpis.revenue}
        delta={kpis.deltas.revenue}
        foot="Rooms revenue"
      />
      <KpiCard
        label="Rooms available tonight"
        value={kpis.roomsAvailable}
        foot={`Out of ${kpis.totalRooms} rooms`}
      />
      <KpiCard
        label="Forecast occupancy tomorrow"
        value={kpis.forecastOccupancyTomorrow}
        suffix="%"
        decimals={1}
        prediction
        foot="Weighted same day of week model"
      />
    </div>
  );
}

function OverviewSection({
  kpis,
  forecast,
  revenue,
  roomTypeOccupancy,
  channels,
  rooms,
  demo,
}: OverviewProps) {
  return (
    <div className="ss-stack">
      <KpiRow kpis={kpis} />

      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>30 day occupancy forecast against actual</h3>
            <p>
              The last seven days of recorded occupancy lead into a 30 day prediction. Kenyan school terms and
              public holidays are already priced into the line.
            </p>
          </div>
          <span className="badge-line">
            <span className="ss-badge neutral">{formatPercent(kpis.forecastOccupancyTomorrow)} tomorrow</span>
            <span className="ss-badge red">Deterministic model</span>
          </span>
        </div>
        <ForecastAreaChart data={forecast} height={320} />
        <p className="panel-note">
          Formula: weighted moving average of the same day of week across 180 days, adjusted by a seasonal
          month index and Kenyan holiday flags. No external AI API is called.
        </p>
      </div>

      <div className="row">
        <div className="col-xl-7 col-lg-7 col-md-12" style={{ marginBottom: 18 }}>
          <div className="panel" style={{ height: "100%" }}>
            <div className="panel-head">
              <div>
                <h3>Daily revenue, past 30 days</h3>
                <p>Rooms revenue posted each night</p>
              </div>
              <TrendingUp size={17} style={{ color: "var(--ss-red)" }} aria-hidden="true" />
            </div>
            <RevenueLineChart data={revenue} height={286} />
          </div>
        </div>
        <div className="col-xl-5 col-lg-5 col-md-12" style={{ marginBottom: 18 }}>
          <div className="panel" style={{ height: "100%" }}>
            <div className="panel-head">
              <div>
                <h3>Booking source breakdown</h3>
                <p>Share of bookings this month</p>
              </div>
              <PieIcon size={17} style={{ color: "var(--ss-muted)" }} aria-hidden="true" />
            </div>
            <SourcePieChart data={channels} height={228} />
            <SourceLegendBreakdown data={channels} />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-7 col-lg-7 col-md-12" style={{ marginBottom: 18 }}>
          <div className="panel" style={{ height: "100%" }}>
            <div className="panel-head">
              <div>
                <h3>Occupancy by room type, past 7 days</h3>
                <p>Rooms occupied in each category, single, double, suite and family</p>
              </div>
              <BarChart3 size={17} style={{ color: "var(--ss-muted)" }} aria-hidden="true" />
            </div>
            <RoomTypeBarChart data={roomTypeOccupancy} height={286} />
          </div>
        </div>
        <div className="col-xl-5 col-lg-5 col-md-12" style={{ marginBottom: 18 }}>
          <div className="panel" style={{ height: "100%" }}>
            <div className="panel-head">
              <div>
                <h3>ADR and RevPAR, past 30 days</h3>
                <p>Average rate against revenue per available room</p>
              </div>
              <CalendarClock size={17} style={{ color: "var(--ss-muted)" }} aria-hidden="true" />
            </div>
            <AdrRevparComposedChart data={revenue} height={286} />
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Room status grid</h3>
            <p>
              {kpis.totalRooms} rooms across the property. Click any room for the guest, dates, rate and a
              status change.
            </p>
          </div>
          <BedDouble size={17} style={{ color: "var(--ss-muted)" }} aria-hidden="true" />
        </div>
        <RoomStatusPanel rooms={rooms} readOnly={demo} />
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Today at a glance</h3>
            <p>Chairman's summary, ready for the morning briefing</p>
          </div>
          <ReceiptText size={17} style={{ color: "var(--ss-muted)" }} aria-hidden="true" />
        </div>
        <div className="ss-grid-3">
          <div className="insight-card" style={{ marginTop: 0 }}>
            <div className="insight-label">Occupancy</div>
            <p>
              {kpis.roomsOccupied} of {kpis.totalRooms} rooms sold at {formatPercent(kpis.occupancyRate)}, an
              average rate of {formatKes(kpis.adr)}.
            </p>
          </div>
          <div className="insight-card" style={{ marginTop: 0 }}>
            <div className="insight-label">Tomorrow</div>
            <p>
              The model expects {formatPercent(kpis.forecastOccupancyTomorrow)} occupancy tomorrow. Release
              remaining inventory to OTA channels only if the pace line stays under that number.
            </p>
          </div>
          <div className="insight-card" style={{ marginTop: 0 }}>
            <div className="insight-label">Revenue</div>
            <p>
              Rooms revenue of {formatKes(kpis.revenue)} today and {formatKes(kpis.revpar)} RevPAR across all{" "}
              {kpis.totalRooms} keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChannelsSection({ channels, months }: { channels: ChannelSummary[]; months: ChannelMonth[] }) {
  return (
    <div className="ss-stack">
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Bookings by source, past 12 months</h3>
            <p>Direct, OTA, walk-in and corporate bookings counted by arrival month</p>
          </div>
          <span className="ss-badge neutral">BarChart</span>
        </div>
        <ChannelMonthlyBarChart data={months} height={330} />
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Source performance this month</h3>
            <p>Commission applied at the channel rate, net revenue is what the hotel keeps</p>
          </div>
          <Info size={16} style={{ color: "var(--ss-muted)" }} aria-hidden="true" />
        </div>
        <div className="ss-table-wrap">
          <table className="ss-table">
            <thead>
              <tr>
                <th scope="col">Source</th>
                <th scope="col">Bookings this month</th>
                <th scope="col">Revenue this month</th>
                <th scope="col">Commission rate</th>
                <th scope="col">Net revenue</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((channel) => (
                <tr key={channel.source}>
                  <td className="strong">{channel.source}</td>
                  <td className="num">{channel.bookings}</td>
                  <td className="num">{formatKes(channel.revenue)}</td>
                  <td className="num">{(channel.commissionRate * 100).toFixed(0)}%</td>
                  <td className="num">{formatKes(channel.netRevenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="insight-card">
          <div className="insight-label">Channel insight</div>
          <p>
            OTA bookings carry an 18 percent commission, so every OTA night has to earn roughly 22 percent
            more than a direct night to be worth the same money. Move repeat guests to a direct offer before
            the next festive season.
          </p>
        </div>
      </div>
    </div>
  );
}

const SEASONAL_CARDS = [
  {
    month: "December",
    title: "Festive peak",
    body: "December historically shows your highest occupancy at 87 percent. Consider adjusting rates by 15 to 20 percent from December 15 onward.",
  },
  {
    month: "April",
    title: "School break and Easter",
    body: "April combines the Easter weekend with the first school break of the year. Family rooms lead the pick up, so protect them from overbooking by corporate blocks.",
  },
  {
    month: "July and August",
    title: "Diaspora season",
    body: "July and August carry the strongest mid year occupancy of the calendar. Suites sell out first, so a two night minimum over long weekends protects rate without hurting volume.",
  },
  {
    month: "September",
    title: "Shoulder month",
    body: "September resets after the second term break. Conference and group business is the fastest route back above 70 percent, and midweek corporate rates should be renegotiated now.",
  },
];

function SeasonalSection({
  seasonality,
  insights,
}: {
  seasonality: SeasonalityPoint[];
  insights: Record<string, string>;
}) {
  return (
    <div className="ss-stack">
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Occupancy for the same month across three years</h3>
            <p>
              Red bands mark Kenyan school breaks and public holidays where occupancy peaks are normally
              visible. The navy band marks Mashujaa Day week.
            </p>
          </div>
          <span className="ss-badge neutral">LineChart</span>
        </div>
        <SeasonalityLineChart data={seasonality} height={340} />
        <div className="chart-legend">
          <span>
            <i style={{ background: "#a3aec6" }} /> 2024 occupancy
          </span>
          <span>
            <i style={{ background: "#0f1521" }} /> 2025 occupancy
          </span>
          <span>
            <i style={{ background: "#ff0909" }} /> 2026 occupancy
          </span>
          <span>
            <i style={{ background: "rgba(255,9,9,0.18)" }} /> School holiday and public holiday bands
          </span>
        </div>
      </div>

      <div className="ss-grid-2">
        {SEASONAL_CARDS.map((card) => (
          <div className="panel" key={card.month}>
            <div className="panel-head">
              <div>
                <h3>{card.title}</h3>
                <p>{card.month}</p>
              </div>
            </div>
            <div className="insight-card" style={{ marginTop: 0 }}>
              <div className="insight-label">Narrative insight</div>
              <p>{card.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Month by month commentary</h3>
            <p>Generated from the same history the chart uses, kept as plain text for your team</p>
          </div>
        </div>
        <div className="ss-table-wrap">
          <table className="ss-table">
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">What the history shows</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(insights).map(([month, text]) => (
                <tr key={month}>
                  <td className="strong" style={{ width: 120 }}>
                    {month}
                  </td>
                  <td>{text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
