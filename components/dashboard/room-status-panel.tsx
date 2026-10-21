"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BedDouble, Search, X } from "lucide-react";
import { ROOM_TYPES } from "@/lib/seedData";
import type { Room, RoomStatus } from "@/lib/types";

const STATUS_OPTIONS: RoomStatus[] = ["available", "occupied", "maintenance", "reserved"];

const STATUS_COLORS: Record<RoomStatus, string> = {
  available: "var(--ss-status-available)",
  occupied: "var(--ss-status-occupied)",
  maintenance: "var(--ss-status-maintenance)",
  reserved: "var(--ss-status-reserved)",
};

export function RoomStatusPanel({
  rooms: initialRooms,
  readOnly = false,
}: {
  rooms: Room[];
  readOnly?: boolean;
}) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [floor, setFloor] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Room | null>(null);
  const [saving, setSaving] = useState(false);

  const floors = useMemo(
    () => Array.from(new Set(rooms.map((room) => room.floor))).sort((a, b) => a - b),
    [rooms],
  );

  const filtered = rooms.filter((room) => {
    if (floor !== "all" && String(room.floor) !== floor) return false;
    if (type !== "all" && room.type !== type) return false;
    if (status !== "all" && room.status !== status) return false;
    if (search.trim() && !room.number.includes(search.trim())) return false;
    return true;
  });

  const counts = STATUS_OPTIONS.reduce<Record<RoomStatus, number>>(
    (acc, key) => ({ ...acc, [key]: rooms.filter((room) => room.status === key).length }),
    { available: 0, occupied: 0, maintenance: 0, reserved: 0 },
  );

  const changeStatus = async (room: Room, nextStatus: RoomStatus) => {
    setRooms((current) =>
      current.map((item) =>
        item.id === room.id
          ? {
              ...item,
              status: nextStatus,
              guestName:
                nextStatus === "occupied" || nextStatus === "reserved" ? item.guestName ?? "Walk-in guest" : undefined,
              checkIn:
                nextStatus === "occupied" || nextStatus === "reserved" ? item.checkIn ?? new Date().toISOString().slice(0, 10) : undefined,
              checkOut:
                nextStatus === "occupied" || nextStatus === "reserved" ? item.checkOut ?? new Date().toISOString().slice(0, 10) : undefined,
            }
          : item,
      ),
    );
    setSelected((current) => (current && current.id === room.id ? { ...current, status: nextStatus } : current));

    setSaving(true);
    try {
      await fetch(`/api/dashboard/rooms/${room.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch {
      /* the panel keeps the local change even when the workspace is offline */
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="room-legend">
        {STATUS_OPTIONS.map((key) => (
          <span key={key}>
            <i style={{ background: STATUS_COLORS[key] }} />
            {key.charAt(0).toUpperCase() + key.slice(1)} ({counts[key]})
          </span>
        ))}
      </div>

      <div className="filter-row">
        <div style={{ position: "relative" }}>
          <Search
            size={14}
            aria-hidden="true"
            style={{ position: "absolute", left: 12, top: 13, color: "var(--ss-muted)" }}
          />
          <input
            className="ss-input"
            style={{ paddingLeft: 33 }}
            placeholder="Search room number"
            aria-label="Search room number"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <select className="ss-select" aria-label="Filter by floor" value={floor} onChange={(event) => setFloor(event.target.value)}>
          <option value="all">All floors</option>
          {floors.map((value) => (
            <option key={value} value={String(value)}>
              Floor {value}
            </option>
          ))}
        </select>
        <select className="ss-select" aria-label="Filter by room type" value={type} onChange={(event) => setType(event.target.value)}>
          <option value="all">All room types</option>
          {ROOM_TYPES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select className="ss-select" aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((value) => (
            <option key={value} value={value}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </option>
          ))}
        </select>
        <span className="panel-note" style={{ marginLeft: "auto" }}>
          Showing {filtered.length} of {rooms.length} rooms
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <BedDouble size={28} aria-hidden="true" />
          <p>No rooms match these filters. Clear the search or choose another floor.</p>
        </div>
      ) : (
        <div className="room-grid">
          {filtered.map((room) => (
            <button
              type="button"
              key={room.id}
              className={`room-card status-${room.status}`}
              onClick={() => setSelected(room)}
              aria-label={`Room ${room.number}, ${room.type}, ${room.status}`}
            >
              <span className="room-num">{room.number}</span>
              <span className="room-type">{room.type}</span>
              <span className="room-rate">KES {room.rate.toLocaleString("en-KE")}</span>
              <span className="room-status-line">
                <i className="room-dot" />
                {room.status}
              </span>
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className="room-detail-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setSelected(null)}
            />
            <motion.aside
              className="room-detail"
              initial={{ x: 420, opacity: 0.6 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 420, opacity: 0 }}
              transition={{ type: "tween", duration: 0.26, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-label={`Room ${selected.number} details`}
            >
              <div className="room-detail-head">
                <div>
                  <span>Room detail</span>
                  <h3>{selected.number}</h3>
                </div>
                <button type="button" className="room-detail-close" onClick={() => setSelected(null)} aria-label="Close room detail">
                  <X size={16} aria-hidden="true" />
                </button>
              </div>

              <div className="detail-row">
                <span>Room type</span>
                <b>{selected.type}</b>
              </div>
              <div className="detail-row">
                <span>Floor</span>
                <b>Floor {selected.floor}</b>
              </div>
              <div className="detail-row">
                <span>Rate per night</span>
                <b>KES {selected.rate.toLocaleString("en-KE")}</b>
              </div>
              <div className="detail-row">
                <span>Status</span>
                <b>
                  <span className={`ss-badge ${selected.status}`}>{selected.status}</span>
                </b>
              </div>
              <div className="detail-row">
                <span>Current guest</span>
                <b>{selected.guestName ?? "No guest in house"}</b>
              </div>
              <div className="detail-row">
                <span>Check in</span>
                <b>{selected.checkIn ?? "Not applicable"}</b>
              </div>
              <div className="detail-row">
                <span>Check out</span>
                <b>{selected.checkOut ?? "Not applicable"}</b>
              </div>

              <div className="ss-field" style={{ marginTop: 22 }}>
                <label htmlFor="change-status">Change status</label>
                <select
                  id="change-status"
                  className="ss-select"
                  value={selected.status}
                  disabled={saving || readOnly}
                  onChange={(event) => changeStatus(selected, event.target.value as RoomStatus)}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
                <p className="ss-hint">
                  {readOnly
                    ? "This is the read only demo. Sign up to change room status on your own property."
                    : "Guest names are fictional placeholders in this demo workspace. Status changes are saved to your property record."}
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
