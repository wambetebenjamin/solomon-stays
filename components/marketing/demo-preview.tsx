"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ForecastAreaChart } from "@/components/charts/forecast-area-chart";
import { RevenueLineChart } from "@/components/charts/revenue-line-chart";
import { combinedForecastSeries, forecastTomorrow } from "@/lib/occupancyPredictor";
import { getDailyHistory, getTodayRecord } from "@/lib/seedData";

const history = getDailyHistory();
const series = combinedForecastSeries(history);
const tomorrow = forecastTomorrow(history);
const today = getTodayRecord();
const revenueSeries = history.slice(-30).map((record) => ({ date: record.date, revenue: record.revenue }));

export function DemoPreview() {
  return (
    <section className="ss-section grey" id="demo-preview">
      <div className="container">
        <div className="ss-section-title centre">
          <span className="ss-title-rule" />
          <h2>A dashboard your revenue meeting can actually use</h2>
          <p>
            Every number below is live and interactive, drawn from sample data for Demo Hotel, Nairobi, 80
            rooms. Hover the charts, change the tabs on the demo page, and see how the product behaves before
            you sign up.
          </p>
        </div>

        <div className="ss-demo-frame">
          <div className="ss-demo-bar">
            <div>
              <h3>Demo Hotel, Nairobi</h3>
              <span>80 rooms, sample data, 6 months of history</span>
            </div>
            <span className="ss-demo-flag">Demo data</span>
          </div>

          <div className="kpi-grid" style={{ marginBottom: 22 }}>
            <div className="kpi-card">
              <div className="kpi-label">Occupancy today</div>
              <div className="kpi-value">{today.occupancy}%</div>
              <div className="kpi-foot">{today.roomsOccupied} of 80 rooms occupied</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">RevPAR today, KES</div>
              <div className="kpi-value">{today.revpar.toLocaleString("en-KE")}</div>
              <div className="kpi-foot">Revenue per available room</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">ADR today, KES</div>
              <div className="kpi-value">{today.adr.toLocaleString("en-KE")}</div>
              <div className="kpi-foot">Average daily rate</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Revenue today, KES</div>
              <div className="kpi-value">{today.revenue.toLocaleString("en-KE")}</div>
              <div className="kpi-foot">Rooms revenue only</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Rooms available tonight</div>
              <div className="kpi-value">{80 - today.roomsOccupied}</div>
              <div className="kpi-foot">Ready to sell</div>
            </div>
            <div className="kpi-card prediction">
              <div className="kpi-label">
                Forecast tomorrow <span className="ss-badge red">Forecast</span>
              </div>
              <div className="kpi-value">{tomorrow}%</div>
              <div className="kpi-foot">Weighted day of week model</div>
            </div>
          </div>

          <div className="ss-grid-2">
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h3>30 day occupancy forecast</h3>
                  <p>Seven days of actual occupancy followed by the next 30 days of predicted demand</p>
                </div>
                <span className="ss-badge neutral">AreaChart</span>
              </div>
              <ForecastAreaChart data={series} height={260} />
            </div>
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h3>Daily revenue, past 30 days</h3>
                  <p>Rooms revenue recorded each night at the close of business</p>
                </div>
                <span className="ss-badge neutral">LineChart</span>
              </div>
              <RevenueLineChart data={revenueSeries} height={260} />
            </div>
          </div>

          <div className="report-actions" style={{ justifyContent: "flex-end" }}>
            <Link href="/demo" className="ss-btn dark">
              Open the full interactive demo <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
