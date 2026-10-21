"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "solomon_stays_consent";

export interface ConsentState {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: number;
}

const defaultConsent: Omit<ConsentState, "updatedAt"> = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: false,
  version: 1,
};

function readConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (typeof parsed !== "object" || parsed === null) return null;
    return { ...defaultConsent, ...parsed, necessary: true };
  } catch {
    return null;
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [prefs, setPrefs] = useState({ functional: true, analytics: true, marketing: false });

  useEffect(() => {
    const stored = readConsent();
    if (!stored) {
      setVisible(true);
    } else {
      setPrefs({
        functional: stored.functional,
        analytics: stored.analytics,
        marketing: stored.marketing,
      });
    }

    const open = () => {
      setVisible(true);
      setShowPreferences(true);
    };
    window.addEventListener("open-cookie-preferences", open);
    return () => window.removeEventListener("open-cookie-preferences", open);
  }, []);

  const persist = (state: Omit<ConsentState, "updatedAt" | "version">) => {
    const payload: ConsentState = {
      ...state,
      necessary: true,
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* storage can be unavailable in private mode */
    }
    setVisible(false);
    setShowPreferences(false);
  };

  const acceptAll = () =>
    persist({ necessary: true, functional: true, analytics: true, marketing: true });

  const essentialOnly = () =>
    persist({ necessary: true, functional: false, analytics: false, marketing: false });

  if (!visible) return null;

  return (
    <>
      <div className="ss-cookie-banner" role="region" aria-label="Cookie consent">
        <div className="container">
          <div className="ss-cookie-inner">
            <div className="ss-cookie-copy">
              <strong>Cookies and your data at Solomon Stays</strong>
              We use necessary cookies to keep you signed in and optional cookies to understand how hotel
              managers use the dashboard. Under the Kenya Data Protection Act 2019 you can accept all,
              reject the optional ones, or choose per category. Read our{" "}
              <Link href="/legal/cookie-policy">cookie policy</Link> and{" "}
              <Link href="/legal/privacy-policy">privacy policy</Link>.
            </div>
            <div className="ss-cookie-actions">
              <button type="button" className="ss-btn outline" onClick={() => setShowPreferences(true)}>
                Manage Preferences
              </button>
              <button type="button" className="ss-btn" onClick={acceptAll}>
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPreferences && (
        <div
          className="ss-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-pref-title"
        >
          <div className="ss-modal">
            <h2 id="cookie-pref-title">Cookie preferences</h2>
            <p>
              Choose which categories of cookies Solomon Stays may store on this device. Necessary cookies
              stay on because the dashboard cannot work without them.
            </p>

            <div className="ss-pref-row">
              <div>
                <h3>Necessary</h3>
                <p>Session, security and consent storage. These cannot be switched off.</p>
              </div>
              <button type="button" className="ss-switch" role="switch" aria-checked="true" disabled aria-label="Necessary cookies, always on" />
            </div>

            <div className="ss-pref-row">
              <div>
                <h3>Functional</h3>
                <p>Remembers your property selection, dashboard tab and report preferences.</p>
              </div>
              <button
                type="button"
                className="ss-switch"
                role="switch"
                aria-checked={prefs.functional}
                aria-label="Functional cookies"
                onClick={() => setPrefs((current) => ({ ...current, functional: !current.functional }))}
              />
            </div>

            <div className="ss-pref-row">
              <div>
                <h3>Analytics</h3>
                <p>Aggregated usage data that shows which dashboard views help hotel managers most.</p>
              </div>
              <button
                type="button"
                className="ss-switch"
                role="switch"
                aria-checked={prefs.analytics}
                aria-label="Analytics cookies"
                onClick={() => setPrefs((current) => ({ ...current, analytics: !current.analytics }))}
              />
            </div>

            <div className="ss-pref-row">
              <div>
                <h3>Marketing</h3>
                <p>Measures the performance of our campaigns to hotel groups in Kenya and East Africa.</p>
              </div>
              <button
                type="button"
                className="ss-switch"
                role="switch"
                aria-checked={prefs.marketing}
                aria-label="Marketing cookies"
                onClick={() => setPrefs((current) => ({ ...current, marketing: !current.marketing }))}
              />
            </div>

            <div className="ss-modal-actions">
              <button
                type="button"
                className="ss-btn"
                onClick={() => persist({ necessary: true, ...prefs })}
              >
                Save preferences
              </button>
              <button type="button" className="ss-btn outline" onClick={essentialOnly}>
                Necessary only
              </button>
              <button type="button" className="ss-btn outline" onClick={() => setShowPreferences(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event("open-cookie-preferences"))}
    >
      Cookie preferences
    </button>
  );
}
