"use client";

import { useRef, useState } from "react";
import { CalendarRange, Download, FileText, Mail, Table2 } from "lucide-react";
import { downloadCsv, downloadReportPdf } from "@/lib/reportPdf";
import { addDays, formatKes, todayIso } from "@/lib/dates";
import { buildReport } from "@/lib/reports";
import type { ReportPayload, ReportRequest } from "@/lib/types";

const REPORT_TYPES: Array<{ value: ReportRequest["type"]; label: string }> = [
  { value: "daily", label: "Daily Summary" },
  { value: "weekly", label: "Weekly Summary" },
  { value: "monthly", label: "Monthly Revenue Report" },
  { value: "occupancy-comparison", label: "Occupancy vs Forecast Comparison" },
];

function reportToCsvLocal(report: ReportPayload): string {
  const header = ["Label", "Occupancy percent", "ADR KES", "RevPAR KES", "Revenue KES"];
  const lines = report.rows.map((row) =>
    [row.label, row.occupancy, row.adr, row.revpar, row.revenue].map((cell) => `"${cell}"`).join(","),
  );
  lines.push(
    ["Period total", report.totals.occupancy, report.totals.adr, report.totals.revpar, report.totals.revenue]
      .map((cell) => `"${cell}"`)
      .join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

export function ReportsTab({
  defaultEmail,
  demo = false,
  hotelName = "Demo Hotel, Nairobi",
}: {
  defaultEmail: string;
  demo?: boolean;
  hotelName?: string;
}) {
  const [type, setType] = useState<ReportRequest["type"]>("monthly");
  const [startDate, setStartDate] = useState(addDays(todayIso(), -29));
  const [endDate, setEndDate] = useState(todayIso());
  const [report, setReport] = useState<ReportPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [email, setEmail] = useState(defaultEmail);
  const [scheduleMessage, setScheduleMessage] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setScheduleMessage(null);

    if (demo) {
      window.setTimeout(() => {
        setReport(buildReport({ type, startDate, endDate }, hotelName));
        setLoading(false);
      }, 550);
      return;
    }

    try {
      const response = await fetch("/api/dashboard/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, startDate, endDate }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "The report could not be generated. Check the date range.");
        setReport(null);
        return;
      }
      setReport(payload.report as ReportPayload);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    if (!report || !previewRef.current) return;
    setDownloading(true);
    try {
      await downloadReportPdf(previewRef.current, report);
    } catch {
      setError("PDF generation failed in this browser. Try the CSV download instead.");
    } finally {
      setDownloading(false);
    }
  };

  const schedule = async () => {
    if (demo) {
      setScheduleMessage("Scheduling is switched off in the public demo. Sign up to email reports to your team.");
      return;
    }
    setScheduling(true);
    setScheduleMessage(null);
    try {
      const response = await fetch("/api/dashboard/reports/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frequency, reportType: type, email }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setScheduleMessage(payload.error ?? "The schedule could not be saved.");
        return;
      }
      setScheduleMessage(payload.message as string);
    } catch {
      setScheduleMessage("Network error. The schedule was not saved.");
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div className="report-grid">
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Generate a report</h3>
            <p>Choose a range and a report type. Reports use your property history.</p>
          </div>
          <CalendarRange size={17} style={{ color: "var(--ss-red)" }} aria-hidden="true" />
        </div>

        <div className="ss-field">
          <label htmlFor="report-type">Report type</label>
          <select
            id="report-type"
            className="ss-select"
            value={type}
            onChange={(event) => setType(event.target.value as ReportRequest["type"])}
          >
            {REPORT_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="ss-form-grid">
          <div className="ss-field">
            <label htmlFor="report-start">Start date</label>
            <input
              id="report-start"
              type="date"
              className="ss-input"
              value={startDate}
              max={endDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>
          <div className="ss-field">
            <label htmlFor="report-end">End date</label>
            <input
              id="report-end"
              type="date"
              className="ss-input"
              value={endDate}
              min={startDate}
              max={todayIso()}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
        </div>

        <button type="button" className="ss-btn" onClick={generate} disabled={loading} style={{ width: "100%" }}>
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" /> Generating report
            </>
          ) : (
            <>
              <FileText size={15} aria-hidden="true" /> Generate Report
            </>
          )}
        </button>

        {error && <div className="ss-alert error">{error}</div>}

        <hr style={{ border: 0, borderTop: "1px solid var(--ss-line)", margin: "24px 0 20px 0" }} />

        <div className="panel-head" style={{ marginBottom: 10 }}>
          <div>
            <h3>Schedule this report</h3>
            <p>Email the report on a fixed rhythm using our SMTP sender.</p>
          </div>
          <Mail size={16} style={{ color: "var(--ss-muted)" }} aria-hidden="true" />
        </div>

        <div className="ss-field">
          <label htmlFor="schedule-frequency">Frequency</label>
          <select
            id="schedule-frequency"
            className="ss-select"
            value={frequency}
            onChange={(event) => setFrequency(event.target.value as "daily" | "weekly" | "monthly")}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="ss-field">
          <label htmlFor="schedule-email">Reporting email</label>
          <input
            id="schedule-email"
            type="email"
            className="ss-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="revenue@yourhotel.co.ke"
          />
        </div>

        <button type="button" className="ss-btn dark" onClick={schedule} disabled={scheduling} style={{ width: "100%" }}>
          {scheduling ? (
            <>
              <span className="spinner" aria-hidden="true" /> Saving schedule
            </>
          ) : (
            "Schedule Report"
          )}
        </button>

        {scheduleMessage && <div className="ss-alert success">{scheduleMessage}</div>}
      </div>

      <div className="report-preview" ref={previewRef}>
        {loading ? (
          <div className="report-loading">
            <span className="spinner dark lg" aria-hidden="true" />
            <span>Building your {REPORT_TYPES.find((option) => option.value === type)?.label.toLowerCase()}</span>
          </div>
        ) : report ? (
          <>
            <div className="report-preview-head">
              <span className="ss-tag red">Solomon Stays report</span>
              <h3>{report.title}</h3>
              <span>
                {report.hotelName} | {report.startDate} to {report.endDate}
              </span>
            </div>

            <div className="report-summary">{report.summary}</div>

            <div className="ss-table-wrap">
              <table className="ss-table">
                <thead>
                  <tr>
                    <th scope="col">Period</th>
                    <th scope="col">Occupancy</th>
                    <th scope="col">ADR</th>
                    <th scope="col">RevPAR</th>
                    <th scope="col">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {report.rows.slice(0, 14).map((row) => (
                    <tr key={row.label}>
                      <td className="strong">{row.label}</td>
                      <td className="num">{row.occupancy}%</td>
                      <td className="num">{formatKes(row.adr)}</td>
                      <td className="num">{formatKes(row.revpar)}</td>
                      <td className="num">{formatKes(row.revenue)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="strong">{report.totals.label}</td>
                    <td className="num">{report.totals.occupancy}%</td>
                    <td className="num">{formatKes(report.totals.adr)}</td>
                    <td className="num">{formatKes(report.totals.revpar)}</td>
                    <td className="num">{formatKes(report.totals.revenue)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="panel-note" style={{ marginTop: 12 }}>
              {report.rows.length > 14
                ? `Showing the first 14 of ${report.rows.length} rows in this preview. The PDF and CSV include every row.`
                : `${report.rows.length} rows included in this report.`}
            </p>

            <div className="report-actions">
              <button type="button" className="ss-btn" onClick={downloadPdf} disabled={downloading}>
                {downloading ? (
                  <>
                    <span className="spinner" aria-hidden="true" /> Building PDF
                  </>
                ) : (
                  <>
                    <Download size={15} aria-hidden="true" /> Download PDF
                  </>
                )}
              </button>
              <button
                type="button"
                className="ss-btn outline"
                onClick={() => downloadCsv(reportToCsvLocal(report), `solomon-stays-${report.type}-${report.endDate}.csv`)}
              >
                <Table2 size={15} aria-hidden="true" /> Download CSV
              </button>
            </div>
          </>
        ) : (
          <div className="report-loading">
            <FileText size={30} style={{ color: "var(--ss-silver)" }} aria-hidden="true" />
            <span style={{ maxWidth: 320, textAlign: "center", lineHeight: "22px" }}>
              Choose a report type and date range, then generate the report. A preview appears here and can
              be downloaded as a PDF or CSV, or scheduled to your team.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
