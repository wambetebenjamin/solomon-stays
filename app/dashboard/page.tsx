import type { Metadata } from "next";
import { DashboardTabs } from "@/components/dashboard/overview-tabs";
import { getChannelMonths, getChannels, getKpis, getRevenueSeries, getRoomTypeOccupancy } from "@/lib/dashboardData";
import { combinedForecastSeries } from "@/lib/occupancyPredictor";
import { getDailyHistory, getRooms, getSeasonality, SEASONAL_INSIGHTS, defaultSettings } from "@/lib/seedData";
import { loadRooms, loadSettings } from "@/lib/kv";
import { longLabel } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Occupancy, revenue and forecast dashboard for your hotel.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [settings, rooms] = await Promise.all([loadSettings(defaultSettings()), loadRooms(getRooms())]);
  const history = getDailyHistory();
  const kpis = getKpis(settings.hotelName);
  const forecast = combinedForecastSeries(history);
  const revenue = getRevenueSeries(30).map((record) => ({
    date: record.date,
    revenue: record.revenue,
    adr: record.adr,
    revpar: record.revpar,
  }));

  return (
    <>
      <div className="dash-section-title">
        <div>
          <h2>Overview for {longLabel(kpis.date)}</h2>
          <p>
            Six KPI cards, one revenue picture. Figures below are the recorded close of business for the
            property.
          </p>
        </div>
        <span className="ss-badge neutral">Live data source: property history</span>
      </div>

      <DashboardTabs
        kpis={kpis}
        forecast={forecast}
        revenue={revenue}
        roomTypeOccupancy={getRoomTypeOccupancy(7)}
        channels={getChannels()}
        channelMonths={getChannelMonths()}
        seasonality={getSeasonality()}
        insights={SEASONAL_INSIGHTS}
        rooms={rooms}
        reportingEmail={settings.reportingEmail}
      />
    </>
  );
}
