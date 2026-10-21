"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BedDouble,
  CalendarCheck,
  LayoutDashboard,
  Settings,
  ExternalLink,
  CreditCard,
} from "lucide-react";

const LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/rooms", label: "Rooms", icon: BedDouble },
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({ hotelName }: { hotelName: string }) {
  const pathname = usePathname();

  return (
    <aside className="dash-sidebar" aria-label="Dashboard navigation">
      <div className="dash-brand">
        <Link href="/" aria-label="Solomon Stays home">
          <span className="ss-wordmark">
            Solomon <span>Stays</span>
          </span>
          <small>Revenue analytics</small>
        </Link>
        <div className="dash-hotel">{hotelName}</div>
      </div>

      <nav className="dash-nav">
        <div className="dash-nav-label">Workspace</div>
        {LINKS.map((link) => {
          const Icon = link.icon;
          const active = link.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>
              <Icon size={16} aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
        <div className="dash-nav-label">Shortcuts</div>
        <Link href="/demo">
          <ExternalLink size={16} aria-hidden="true" />
          Public demo
        </Link>
        <Link href="/pricing">
          <CreditCard size={16} aria-hidden="true" />
          Plan and billing
        </Link>
      </nav>

      <div className="dash-sidebar-foot">
        Sample property data. Occupancy prediction runs on the weighted moving average model described in
        our documentation. No external AI service is used.
        <br />
        <Link href="/legal/privacy-policy">Privacy</Link> and{" "}
        <Link href="/legal/terms">terms</Link>
      </div>
    </aside>
  );
}
