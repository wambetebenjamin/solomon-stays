"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/demo", label: "Live Demo" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header">
        <div className="container">
          <div className="logo_section">
            <div className="logo">
              <Link href="/" aria-label="Solomon Stays home">
                <span className="ss-wordmark">
                  Solomon <span>Stays</span>
                </span>
                <small>Hotel revenue analytics</small>
              </Link>
            </div>
          </div>

          <div className="nav-column">
            <nav className="navigation navbar navbar-expand-md navbar-dark" aria-label="Main navigation">
              <ul className="navbar-nav">
                {NAV.map((item) => {
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <li key={item.href} className="nav-item">
                      <Link
                        href={item.href}
                        className={`nav-link${active ? " active" : ""}`}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="ss-nav-actions">
              <Link href="/auth/signin" className="ss-nav-link-plain">
                Sign in
              </Link>
              <Link href="/auth/signup" className="read_more">
                Start free trial
              </Link>
            </div>

            <button
              type="button"
              className="ss-menu-toggle"
              aria-expanded={open}
              aria-controls="ss-mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>

          <div className={`ss-mobile-panel${open ? " open" : ""}`} id="ss-mobile-nav">
            <ul>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/auth/signin" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
              </li>
            </ul>
            <Link href="/auth/signup" className="ss-btn" onClick={() => setOpen(false)}>
              Start free trial
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
