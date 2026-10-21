import Link from "next/link";
import { Building2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="ss-error-page">
        <div className="ss-error-inner">
          <span className="ss-error-code">404</span>
          <div className="ss-error-icon">
            <Building2 size={54} strokeWidth={1.25} aria-hidden="true" />
          </div>
          <h1>This room was not found.</h1>
          <p>
            The page you asked for is not on the floor plan. Check the address, or head back to the dashboard
            and pick up where you left off.
          </p>
          <div className="ss-error-actions">
            <Link href="/dashboard" className="ss-btn">
              Back to Dashboard
            </Link>
            <Link href="/" className="ss-btn outline">
              Go to the home page
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
