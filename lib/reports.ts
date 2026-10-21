import { addDays, shortLabel, todayIso } from "@/lib/dates";
import { getDailyHistory } from "@/lib/seedData";
import type { DailyRecord, ReportPayload, ReportRequest, ReportRow } from "@/lib/types";

const TITLES: Record<ReportRequest["type"], string> = {
  daily: "Daily Summary",
  weekly: "Weekly Summary",
  monthly: "Monthly Revenue Report",
  "occupancy-comparison": "Occupancy vs Forecast Comparison",
};

function aggregate(records: DailyRecord[], label: string): ReportRow {
  if (records.length === 0) {
    return { label, occupancy: 0, adr: 0, revpar: 0, revenue: 0 };
  }
  const totals = records.reduce(
    (acc, record) => ({
      occupancy: acc.occupancy + record.occupancy,
      adr: acc.adr + record.adr,
      revpar: acc.revpar + record.revpar,
      revenue: acc.revenue + record.revenue,
    }),
    { occupancy: 0, adr: 0, revpar: 0, revenue: 0 },
  );
  return {
    label,
    occupancy: Number((totals.occupancy / records.length).toFixed(1)),
    adr: Math.round(totals.adr / records.length),
    revpar: Math.round(totals.revpar / records.length),
    revenue: Math.round(totals.revenue),
  };
}

export function buildReport(
  request: ReportRequest,
  hotelName: string,
): ReportPayload {
  const history = getDailyHistory();
  const endDate = request.endDate || todayIso();
  const startDate = request.startDate || addDays(endDate, -6);
  const inRange = history.filter((record) => record.date >= startDate && record.date <= endDate);
  const records = inRange.length > 0 ? inRange : history.slice(-7);

  let rows: ReportRow[] = [];

  if (request.type === "weekly") {
    const weeks = new Map<string, DailyRecord[]>();
    records.forEach((record) => {
      const index = Math.floor(
        (new Date(`${record.date}T00:00:00Z`).getTime() - new Date(`${records[0].date}T00:00:00Z`).getTime()) /
          (7 * 24 * 60 * 60 * 1000),
      );
      const key = `Week ${index + 1}`;
      weeks.set(key, [...(weeks.get(key) ?? []), record]);
    });
    rows = Array.from(weeks.entries()).map(([label, group]) => aggregate(group, label));
  } else if (request.type === "monthly") {
    const months = new Map<string, DailyRecord[]>();
    records.forEach((record) => {
      const key = record.date.slice(0, 7);
      months.set(key, [...(months.get(key) ?? []), record]);
    });
    rows = Array.from(months.entries()).map(([label, group]) => aggregate(group, label));
  } else {
    rows = records.map((record) => ({
      label: shortLabel(record.date),
      occupancy: record.occupancy,
      adr: record.adr,
      revpar: record.revpar,
      revenue: record.revenue,
    }));
  }

  const totals = aggregate(records, "Period total");
  const averageForecast = 71.4;
  const forecastVariance = Number((totals.occupancy - averageForecast).toFixed(1));

  return {
    type: request.type,
    title: TITLES[request.type],
    hotelName,
    startDate,
    endDate,
    generatedAt: new Date().toISOString(),
    rows,
    totals,
    forecastVariance,
    summary:
      request.type === "occupancy-comparison"
        ? `Actual occupancy averaged ${totals.occupancy} percent against a forecast of ${averageForecast} percent, a variance of ${forecastVariance} points.`
        : `${records.length} days reviewed. Average occupancy ${totals.occupancy} percent, ADR KES ${totals.adr.toLocaleString("en-KE")}, RevPAR KES ${totals.revpar.toLocaleString("en-KE")}.`,
  };
}

export function reportToCsv(report: ReportPayload): string {
  const header = ["Label", "Occupancy percent", "ADR KES", "RevPAR KES", "Revenue KES"];
  const lines = report.rows.map((row) =>
    [row.label, row.occupancy, row.adr, row.revpar, row.revenue].join(","),
  );
  lines.push(
    [
      "Total",
      report.totals.occupancy,
      report.totals.adr,
      report.totals.revpar,
      report.totals.revenue,
    ].join(","),
  );
  return [header.join(","), ...lines].join("\n");
}
