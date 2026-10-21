"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Power, Search, Trash2, X } from "lucide-react";
import { ROOM_TYPES, ROOM_TYPE_RATES } from "@/lib/seedData";
import type { Room, RoomStatus, RoomTypeName } from "@/lib/types";

const STATUS_OPTIONS: RoomStatus[] = ["available", "occupied", "maintenance", "reserved"];

interface FormState {
  number: string;
  type: RoomTypeName;
  floor: string;
  rate: string;
  status: RoomStatus;
}

const emptyForm = (): FormState => ({
  number: "",
  type: "Double",
  floor: "1",
  rate: String(ROOM_TYPE_RATES.Double),
  status: "available",
});

export function RoomManager({ initialRooms }: { initialRooms: Room[] }) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [editing, setEditing] = useState<Room | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(
    () =>
      rooms.filter((room) => {
        if (typeFilter !== "all" && room.type !== typeFilter) return false;
        if (search.trim() && !room.number.includes(search.trim())) return false;
        return true;
      }),
    [rooms, search, typeFilter],
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setShowForm(true);
    setMessage(null);
  };

  const openEdit = (room: Room) => {
    setEditing(room);
    setForm({
      number: room.number,
      type: room.type,
      floor: String(room.floor),
      rate: String(room.rate),
      status: room.status,
    });
    setShowForm(true);
    setMessage(null);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    const payload = {
      number: form.number.trim(),
      type: form.type,
      floor: Number(form.floor),
      rate: Number(form.rate),
      status: form.status,
    };

    try {
      const response = await fetch(editing ? `/api/dashboard/rooms/${editing.id}` : "/api/dashboard/rooms", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage({ kind: "error", text: data.error ?? "The room could not be saved." });
        return;
      }

      if (editing) {
        setRooms((current) =>
          current.map((room) => (room.id === editing.id ? { ...room, ...payload } : room)),
        );
        setMessage({ kind: "success", text: `Room ${payload.number} updated.` });
      } else {
        setRooms((current) => [...current, data.room as Room].sort((a, b) => a.number.localeCompare(b.number)));
        setMessage({ kind: "success", text: `Room ${payload.number} added to the property.` });
      }
      setShowForm(false);
      setEditing(null);
    } catch {
      setMessage({ kind: "error", text: "Network error. The room was not saved." });
    } finally {
      setBusy(false);
    }
  };

  const deactivate = async (room: Room) => {
    setBusy(true);
    try {
      const response = await fetch(`/api/dashboard/rooms/${room.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "maintenance" }),
      });
      if (response.ok) {
        setRooms((current) =>
          current.map((item) => (item.id === room.id ? { ...item, status: "maintenance" } : item)),
        );
        setMessage({ kind: "success", text: `Room ${room.number} moved to maintenance and taken off sale.` });
      } else {
        setMessage({ kind: "error", text: "The room could not be deactivated." });
      }
    } catch {
      setMessage({ kind: "error", text: "Network error. The room was not deactivated." });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (room: Room) => {
    setBusy(true);
    try {
      const response = await fetch(`/api/dashboard/rooms/${room.id}`, { method: "DELETE" });
      if (response.ok) {
        setRooms((current) => current.filter((item) => item.id !== room.id));
        setMessage({ kind: "success", text: `Room ${room.number} removed from the property.` });
      } else {
        setMessage({ kind: "error", text: "The room could not be removed." });
      }
    } catch {
      setMessage({ kind: "error", text: "Network error. The room was not removed." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ss-stack">
      <div className="panel">
        <div className="filter-row" style={{ marginBottom: 0 }}>
          <div style={{ position: "relative" }}>
            <Search size={14} aria-hidden="true" style={{ position: "absolute", left: 12, top: 13, color: "var(--ss-muted)" }} />
            <input
              className="ss-input"
              style={{ paddingLeft: 33 }}
              placeholder="Search room number"
              aria-label="Search room number"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select
            className="ss-select"
            aria-label="Filter by room type"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option value="all">All room types</option>
            {ROOM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <span className="panel-note">{filtered.length} rooms listed</span>
          <button type="button" className="ss-btn" style={{ marginLeft: "auto" }} onClick={openCreate}>
            <Plus size={15} aria-hidden="true" /> Add room
          </button>
        </div>

        {message && <div className={`ss-alert ${message.kind}`}>{message.text}</div>}

        {showForm && (
          <form onSubmit={submit} style={{ marginTop: 18, borderTop: "1px solid var(--ss-line)", paddingTop: 18 }}>
            <div className="panel-head">
              <div>
                <h3>{editing ? `Edit room ${editing.number}` : "Add a room"}</h3>
                <p>Rooms added here are saved to your property record.</p>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                aria-label="Close room form"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>

            <div className="ss-form-grid">
              <div className="ss-field">
                <label htmlFor="room-number">Room number</label>
                <input
                  id="room-number"
                  className="ss-input"
                  required
                  maxLength={8}
                  value={form.number}
                  onChange={(event) => setForm({ ...form, number: event.target.value })}
                />
              </div>
              <div className="ss-field">
                <label htmlFor="room-type">Room type</label>
                <select
                  id="room-type"
                  className="ss-select"
                  value={form.type}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      type: event.target.value as RoomTypeName,
                      rate: String(ROOM_TYPE_RATES[event.target.value as RoomTypeName]),
                    })
                  }
                >
                  {ROOM_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ss-field">
                <label htmlFor="room-floor">Floor</label>
                <input
                  id="room-floor"
                  type="number"
                  min={1}
                  max={30}
                  className="ss-input"
                  required
                  value={form.floor}
                  onChange={(event) => setForm({ ...form, floor: event.target.value })}
                />
              </div>
              <div className="ss-field">
                <label htmlFor="room-rate">Rate per night, KES</label>
                <input
                  id="room-rate"
                  type="number"
                  min={1000}
                  step={50}
                  className="ss-input"
                  required
                  value={form.rate}
                  onChange={(event) => setForm({ ...form, rate: event.target.value })}
                />
              </div>
              <div className="ss-field">
                <label htmlFor="room-status">Status</label>
                <select
                  id="room-status"
                  className="ss-select"
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value as RoomStatus })}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ss-field" style={{ display: "flex", alignItems: "flex-end" }}>
                <button type="submit" className="ss-btn" disabled={busy} style={{ width: "100%" }}>
                  {busy ? <span className="spinner" aria-hidden="true" /> : editing ? "Save changes" : "Add room"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="panel tight">
        <div className="ss-table-wrap" style={{ border: 0 }}>
          <table className="ss-table">
            <thead>
              <tr>
                <th scope="col">Room</th>
                <th scope="col">Type</th>
                <th scope="col">Floor</th>
                <th scope="col">Rate per night</th>
                <th scope="col">Status</th>
                <th scope="col">Guest</th>
                <th scope="col" style={{ textAlign: "right" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((room) => (
                <tr key={room.id}>
                  <td className="strong">{room.number}</td>
                  <td>{room.type}</td>
                  <td>Floor {room.floor}</td>
                  <td className="num">KES {room.rate.toLocaleString("en-KE")}</td>
                  <td>
                    <span className={`ss-badge ${room.status}`}>{room.status}</span>
                  </td>
                  <td>{room.guestName ?? "Vacant"}</td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button type="button" className="icon-btn" onClick={() => openEdit(room)} aria-label={`Edit room ${room.number}`}>
                      <Pencil size={14} aria-hidden="true" />
                    </button>{" "}
                    <button type="button" className="icon-btn" onClick={() => deactivate(room)} aria-label={`Deactivate room ${room.number}`}>
                      <Power size={14} aria-hidden="true" />
                    </button>{" "}
                    <button type="button" className="icon-btn" onClick={() => remove(room)} aria-label={`Delete room ${room.number}`}>
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="empty-state">
            <p>No rooms match this search.</p>
          </div>
        )}
      </div>

      <div className="insight-card" style={{ marginTop: 0 }}>
        <div className="insight-label">Note</div>
        <p>
          Deactivating a room moves it to maintenance and removes it from the sellable count. Deleting a room
          removes it from the property record permanently, so prefer deactivation for renovation or seasonal
          closures.
        </p>
      </div>
    </div>
  );
}
