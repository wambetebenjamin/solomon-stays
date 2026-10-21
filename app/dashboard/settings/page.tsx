import type { Metadata } from "next";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { defaultSettings } from "@/lib/seedData";
import { loadSettings } from "@/lib/kv";

export const metadata: Metadata = {
  title: "Settings",
  description: "Hotel profile, room types, channels and reporting preferences.",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await loadSettings(defaultSettings());

  return (
    <>
      <div className="dash-section-title">
        <div>
          <h2>Property settings</h2>
          <p>Hotel profile, room type configuration, booking channels and reporting preferences.</p>
        </div>
        <span className="ss-badge neutral">{settings.totalRooms} rooms configured</span>
      </div>
      <SettingsForm initialSettings={settings} />
    </>
  );
}
