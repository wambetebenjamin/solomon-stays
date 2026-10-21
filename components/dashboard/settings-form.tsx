"use client";

import { useRef, useState } from "react";
import { Image as ImageIcon, Plus, Save, Trash2, Upload } from "lucide-react";
import { MONTH_LONG } from "@/lib/dates";
import type { HotelSettings, RoomTypeConfig } from "@/lib/types";

export function SettingsForm({ initialSettings }: { initialSettings: HotelSettings }) {
  const [settings, setSettings] = useState<HotelSettings>(initialSettings);
  const [newChannel, setNewChannel] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const updateRoomType = (id: string, patch: Partial<RoomTypeConfig>) => {
    setSettings((current) => ({
      ...current,
      roomTypes: current.roomTypes.map((roomType) =>
        roomType.id === id ? { ...roomType, ...patch } : roomType,
      ),
    }));
  };

  const addRoomType = () => {
    setSettings((current) => ({
      ...current,
      roomTypes: [
        ...current.roomTypes,
        { id: `rt-${Date.now()}`, name: "New room type", rate: 8500, count: 4 },
      ],
    }));
  };

  const removeRoomType = (id: string) => {
    setSettings((current) => ({
      ...current,
      roomTypes: current.roomTypes.filter((roomType) => roomType.id !== id),
    }));
  };

  const addChannel = () => {
    const value = newChannel.trim();
    if (!value) return;
    setSettings((current) => ({ ...current, channels: [...current.channels, value] }));
    setNewChannel("");
  };

  const uploadLogo = async (file: File) => {
    setUploading(true);
    setMessage(null);
    try {
      const body = new FormData();
      body.append("logo", file);
      const response = await fetch("/api/dashboard/settings/upload", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) {
        setMessage({ kind: "error", text: data.error ?? "Logo upload failed." });
        return;
      }
      if (data.url) {
        setSettings((current) => ({ ...current, logoUrl: data.url as string }));
        setMessage({ kind: "success", text: "Logo uploaded to Vercel Blob." });
      } else {
        setMessage({ kind: "error", text: data.message ?? "Blob storage is not configured." });
      }
    } catch {
      setMessage({ kind: "error", text: "Logo upload failed. Check your connection." });
    } finally {
      setUploading(false);
    }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/dashboard/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage({ kind: "error", text: data.error ?? "Settings could not be saved." });
        return;
      }
      setSettings(data as HotelSettings);
      setMessage({ kind: "success", text: "Settings saved to your property record." });
    } catch {
      setMessage({ kind: "error", text: "Network error. Settings were not saved." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="settings-grid">
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Hotel profile</h3>
            <p>Shown across the dashboard and printed on every report.</p>
          </div>
          <ImageIcon size={16} style={{ color: "var(--ss-muted)" }} aria-hidden="true" />
        </div>

        <div className="ss-form-grid">
          <div className="ss-field span-2">
            <label htmlFor="hotel-name">Hotel name</label>
            <input
              id="hotel-name"
              className="ss-input"
              value={settings.hotelName}
              onChange={(event) => setSettings({ ...settings, hotelName: event.target.value })}
            />
          </div>
          <div className="ss-field">
            <label htmlFor="hotel-city">City or town</label>
            <input
              id="hotel-city"
              className="ss-input"
              value={settings.city}
              onChange={(event) => setSettings({ ...settings, city: event.target.value })}
            />
          </div>
          <div className="ss-field">
            <label htmlFor="hotel-rooms">Total room count</label>
            <input
              id="hotel-rooms"
              type="number"
              min={1}
              className="ss-input"
              value={settings.totalRooms}
              onChange={(event) => setSettings({ ...settings, totalRooms: Number(event.target.value) })}
            />
          </div>
          <div className="ss-field">
            <label htmlFor="reporting-email">Reporting email address</label>
            <input
              id="reporting-email"
              type="email"
              className="ss-input"
              value={settings.reportingEmail}
              onChange={(event) => setSettings({ ...settings, reportingEmail: event.target.value })}
            />
          </div>
          <div className="ss-field">
            <label htmlFor="fiscal-month">Fiscal year start month</label>
            <select
              id="fiscal-month"
              className="ss-select"
              value={settings.fiscalYearStartMonth}
              onChange={(event) => setSettings({ ...settings, fiscalYearStartMonth: Number(event.target.value) })}
            >
              {MONTH_LONG.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="ss-field">
          <label htmlFor="logo-upload">Hotel logo</label>
          <div className="upload-preview">
            {settings.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logoUrl} alt="Current hotel logo" />
            ) : (
              <span className="ss-tag">No logo</span>
            )}
          </div>
          <input
            ref={fileRef}
            id="logo-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploadLogo(file);
            }}
          />
          <button type="button" className="ss-btn outline small" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? (
              <>
                <span className="spinner dark" aria-hidden="true" /> Uploading
              </>
            ) : (
              <>
                <Upload size={14} aria-hidden="true" /> Upload to Vercel Blob
              </>
            )}
          </button>
          <p className="ss-hint">PNG, JPG or SVG up to 2 MB. Stored in Vercel Blob when the token is configured.</p>
        </div>

        <div className="panel-head" style={{ marginTop: 26 }}>
          <div>
            <h3>Room type configuration</h3>
            <p>Add, edit or remove the room types sold at this property.</p>
          </div>
        </div>

        {settings.roomTypes.map((roomType) => (
          <div className="roomtype-row" key={roomType.id}>
            <input
              className="ss-input"
              aria-label="Room type name"
              value={roomType.name}
              onChange={(event) => updateRoomType(roomType.id, { name: event.target.value })}
            />
            <input
              className="ss-input"
              type="number"
              min={500}
              step={50}
              aria-label={`${roomType.name} rate`}
              value={roomType.rate}
              onChange={(event) => updateRoomType(roomType.id, { rate: Number(event.target.value) })}
            />
            <input
              className="ss-input"
              type="number"
              min={0}
              aria-label={`${roomType.name} room count`}
              value={roomType.count}
              onChange={(event) => updateRoomType(roomType.id, { count: Number(event.target.value) })}
            />
            <button
              type="button"
              className="icon-btn"
              onClick={() => removeRoomType(roomType.id)}
              aria-label={`Remove ${roomType.name}`}
            >
              <Trash2 size={14} aria-hidden="true" />
            </button>
          </div>
        ))}
        <button type="button" className="ss-btn outline small" onClick={addRoomType}>
          <Plus size={14} aria-hidden="true" /> Add room type
        </button>

        <div className="panel-head" style={{ marginTop: 26 }}>
          <div>
            <h3>Booking channels</h3>
            <p>Names appear in the channel analysis tab and reports.</p>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {settings.channels.map((channel) => (
            <span className="ss-badge neutral" key={channel} style={{ gap: 8 }}>
              {channel}
              <button
                type="button"
                onClick={() =>
                  setSettings((current) => ({
                    ...current,
                    channels: current.channels.filter((item) => item !== channel),
                  }))
                }
                aria-label={`Remove ${channel} channel`}
                style={{ background: "transparent", border: 0, color: "var(--ss-red)", display: "flex", padding: 0 }}
              >
                <Trash2 size={11} aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="ss-input"
            placeholder="Add a channel, for example Airbnb"
            aria-label="New booking channel name"
            value={newChannel}
            onChange={(event) => setNewChannel(event.target.value)}
          />
          <button type="button" className="ss-btn outline" onClick={addChannel}>
            Add
          </button>
        </div>

        {message && <div className={`ss-alert ${message.kind}`}>{message.text}</div>}

        <div className="report-actions">
          <button type="submit" className="ss-btn" disabled={saving}>
            {saving ? (
              <>
                <span className="spinner" aria-hidden="true" /> Saving
              </>
            ) : (
              <>
                <Save size={15} aria-hidden="true" /> Save settings
              </>
            )}
          </button>
        </div>
      </div>

      <div className="ss-stack">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Workspace summary</h3>
              <p>How the property is described across the product.</p>
            </div>
          </div>
          <div className="detail-row">
            <span>Hotel</span>
            <b>{settings.hotelName}</b>
          </div>
          <div className="detail-row">
            <span>City</span>
            <b>{settings.city}</b>
          </div>
          <div className="detail-row">
            <span>Rooms</span>
            <b>{settings.totalRooms}</b>
          </div>
          <div className="detail-row">
            <span>Room types</span>
            <b>{settings.roomTypes.length}</b>
          </div>
          <div className="detail-row">
            <span>Channels</span>
            <b>{settings.channels.length}</b>
          </div>
          <div className="detail-row">
            <span>Reports to</span>
            <b>{settings.reportingEmail}</b>
          </div>
          <div className="detail-row">
            <span>Fiscal year starts</span>
            <b>{MONTH_LONG[settings.fiscalYearStartMonth - 1]}</b>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Storage and services</h3>
              <p>Configuration read from environment variables.</p>
            </div>
          </div>
          <div className="detail-row">
            <span>Vercel KV</span>
            <b>Settings and rooms persist when KV credentials exist</b>
          </div>
          <div className="detail-row">
            <span>Vercel Blob</span>
            <b>Logo upload requires BLOB_READ_WRITE_TOKEN</b>
          </div>
          <div className="detail-row">
            <span>SMTP</span>
            <b>Scheduled reports use nodemailer when SMTP is set</b>
          </div>
          <div className="insight-card">
            <div className="insight-label">Demo mode</div>
            <p>
              Without storage credentials the dashboard keeps a working in memory copy of your settings, so
              you can still explore every screen.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
