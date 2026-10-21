"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCcw, TriangleAlert } from "lucide-react";

const WHATSAPP =
  "https://wa.me/254112272061?text=Hello%20Solomon%20Stays%2C%20I%20would%20like%20to%20set%20up%20an%20occupancy%20dashboard%20for%20my%20hotel.";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Solomon Stays dashboard error", error);
  }, [error]);

  return (
    <div className="ss-error-page">
      <div className="ss-error-inner">
        <span className="ss-error-code">500</span>
        <div className="ss-error-icon">
          <TriangleAlert size={52} strokeWidth={1.25} aria-hidden="true" />
        </div>
        <h1>Something went wrong on our side.</h1>
        <p>
          The dashboard could not load this view. Try again, and if it keeps happening message us on WhatsApp
          at +254 112 272 061 so a revenue manager can look at your workspace.
        </p>
        <div className="ss-error-actions">
          <button type="button" className="ss-btn" onClick={reset}>
            <RefreshCcw size={15} aria-hidden="true" /> Try Again
          </button>
          <a className="ss-btn outline" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
            WhatsApp +254 112 272 061
          </a>
          <Link className="ss-btn outline" href="/dashboard">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
