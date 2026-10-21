"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { addDays, formatKes, shortLabel, todayIso } from "@/lib/dates";
import type { Booking } from "@/lib/types";

const SOURCES = ["Direct", "OTA", "Walk-in", "Corporate"];
const TYPES = ["Single", "Double", "Suite", "Family"];

export function BookingLog({ initialBookings }: { initialBookings: Booking[] }) {
  const [start, setStart] = useState(addDays(todayIso(), -30));
  const [end, setEnd] = useState(addDays(todayIso(), 30));
  const [type, setType] = useState("all");
  const [source, setSource] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(
    () =>
      initialBookings.filter((booking) => {
        if (booking.checkIn < start || booking.checkIn > end) return false;
        if (type !== "all" && booking.roomType !== type) return false;
        if (source !== "all" && booking.source !== source) return false;
        if (search.trim()) {
          const needle = search.trim().toLowerCase();
          if (
            !booking.guestName.toLowerCase().includes(needle) &&
            !booking.roomNumber.includes(needle) &&
            !booking.id.toLowerCase().includes(needle)
          ) {
            return false;
          }
        }
        return true;
      }),
    [initialBookings, start, end, type, source, search],
  );

  useEffect(() => {
    setPage(1);
  }, [start, end, type, source, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const exportCsv = () => {
    const header = ["Reference", "Room", "Room type", "Guest", "Check in", "Check out", "Nights", "Rate", "Source", "Total"];
    const rows = filtered.map((booking) =>
      [
        booking.id,
        booking.roomNumber,
        booking.roomType,
        booking.guestName,
        booking.checkIn,
        booking.checkOut,
        booking.nights,
        booking.rate,
        booking.source,
        booking.total,
      ]
        .map((cell) => `"${cell}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `solomon-stays-bookings-${start}-to-${end}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ss-stack">
      <div className="panel">
        <div className="filter-row" style={{ marginBottom: 0 }}>
          <div className="ss-field" style={{ margin: 0 }}>
            <label htmlFor="booking-start">From</label>
            <input
              id="booking-start"
              type="date"
              className="ss-input"
              value={start}
              max={end}
              onChange={(event) => setStart(event.target.value)}
            />
          </div>
          <div className="ss-field" style={{ margin: 0 }}>
            <label htmlFor="booking-end">To</label>
            <input
              id="booking-end"
              type="date"
              className="ss-input"
              value={end}
              min={start}
              onChange={(event) => setEnd(event.target.value)}
            />
          </div>
          <div className="ss-field" style={{ margin: 0 }}>
            <label htmlFor="booking-type">Room type</label>
            <select id="booking-type" className="ss-select" value={type} onChange={(event) => setType(event.target.value)}>
              <option value="all">All types</option>
              {TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="ss-field" style={{ margin: 0 }}>
            <label htmlFor="booking-source">Source</label>
            <select id="booking-source" className="ss-select" value={source} onChange={(event) => setSource(event.target.value)}>
              <option value="all">All sources</option>
              {SOURCES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="ss-field" style={{ margin: 0, position: "relative" }}>
            <label htmlFor="booking-search">Search</label>
            <Search size={14} aria-hidden="true" style={{ position: "absolute", left: 12, top: 34, color: "var(--ss-muted)" }} />
            <input
              id="booking-search"
              className="ss-input"
              style={{ paddingLeft: 33 }}
              placeholder="Guest, room or reference"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <button type="button" className="ss-btn outline" style={{ marginLeft: "auto" }} onClick={exportCsv}>
            <Download size={14} aria-hidden="true" /> Export CSV
          </button>
        </div>
      </div>

      <div className="panel tight">
        <div className="ss-table-wrap" style={{ border: 0 }}>
          <table className="ss-table">
            <thead>
              <tr>
                <th scope="col">Room</th>
                <th scope="col">Guest</th>
                <th scope="col">Check in</th>
                <th scope="col">Check out</th>
                <th scope="col">Nights</th>
                <th scope="col">Rate</th>
                <th scope="col">Source</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((booking) => (
                <tr key={booking.id}>
                  <td className="strong">{booking.roomNumber}</td>
                  <td>
                    {booking.guestName}
                    <span style={{ display: "block", fontSize: 11, color: "var(--ss-muted)" }}>
                      {booking.id}, {booking.roomType}
                    </span>
                  </td>
                  <td>{shortLabel(booking.checkIn)}</td>
                  <td>{shortLabel(booking.checkOut)}</td>
                  <td className="num">{booking.nights}</td>
                  <td className="num">{formatKes(booking.rate)}</td>
                  <td>
                    <span className="ss-badge neutral">{booking.source}</span>
                  </td>
                  <td className="num">{formatKes(booking.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No bookings in this range. Widen the dates or clear the filters.</p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderTop: "1px solid var(--ss-line)",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <span className="panel-note">
              Showing {(safePage - 1) * pageSize + 1} to {Math.min(safePage * pageSize, filtered.length)} of{" "}
              {filtered.length} bookings
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setPage(Math.max(1, safePage - 1))}
                disabled={safePage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={15} aria-hidden="true" />
              </button>
              <span className="panel-note">
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                disabled={safePage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
