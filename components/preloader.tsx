"use client";

import { useEffect, useState } from "react";

const SKIP_KEY = "solomon_stays_preloader_seen";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [hiding, setHiding] = useState(false);
  const [percent, setPercent] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    let skip = false;
    try {
      skip = sessionStorage.getItem(SKIP_KEY) === "true";
    } catch {
      skip = false;
    }

    if (skip) {
      setVisible(false);
      return;
    }

    const prefersReduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReduced);

    const started = Date.now();
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - started;
      setPercent(Math.min(100, Math.round((elapsed / 900) * 100)));
    }, 60);

    const finish = window.setTimeout(() => {
      setPercent(100);
      setHiding(true);
      window.setTimeout(() => {
        setVisible(false);
        try {
          sessionStorage.setItem(SKIP_KEY, "true");
        } catch {
          /* storage is optional */
        }
      }, 420);
    }, 1000);

    const hardStop = window.setTimeout(() => setVisible(false), 3000);
    window.clearInterval(tick);

    return () => {
      window.clearTimeout(finish);
      window.clearTimeout(hardStop);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`loader_bg${hiding ? " is-hiding" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Solomon Stays"
    >
      {!reducedMotion && (
        <div className="loader">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/loading.gif" alt="" width={220} height={110} />
        </div>
      )}
      <span className="loader-percent">{percent}%</span>
      <span className="sr-only">Loading your occupancy dashboard</span>
    </div>
  );
}
