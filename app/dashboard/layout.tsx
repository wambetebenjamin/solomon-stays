import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { UserMenu } from "@/components/dashboard/user-menu";
import { PropertySelector } from "@/components/dashboard/property-selector";
import { defaultSettings } from "@/lib/seedData";
import { loadSettings } from "@/lib/kv";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  const settings = await loadSettings(defaultSettings());
  const properties = session.user.properties?.length ? session.user.properties : [settings.hotelName];

  return (
    <div className="dash-shell">
      <DashboardSidebar hotelName={settings.hotelName} />
      <div className="dash-main">
        <div className="dash-topbar">
          <div>
            <h1>{settings.hotelName}</h1>
            <div className="dash-subtitle">
              Signed in as a hotel manager. Figures shown are sample property data for this workspace.
            </div>
          </div>
          <div className="dash-topbar-actions">
            <PropertySelector properties={properties} />
            <UserMenu
              name={session.user.name ?? "Hotel Manager"}
              email={session.user.email ?? "manager@solomonstays.co.ke"}
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
