import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact and demo requests",
  description:
    "Request a Solomon Stays demo or ask about occupancy analytics for your hotel. WhatsApp +254 112 272 061, or send the form and we reply within one business day.",
};

const WHATSAPP =
  "https://wa.me/254112272061?text=Hello%20Solomon%20Stays%2C%20I%20would%20like%20to%20set%20up%20an%20occupancy%20dashboard%20for%20my%20hotel.";

export default function ContactPage() {
  return (
    <>
      <section className="ss-page-banner">
        <div className="container">
          <div className="ss-breadcrumb">
            <Link href="/">Home</Link> / <span>Contact</span>
          </div>
          <h1>Talk to the team behind the dashboard</h1>
          <p>
            Tell us about your property and we will walk through your occupancy history with you before you
            commit to anything.
          </p>
        </div>
      </section>

      <section className="ss-section tight">
        <div className="container">
          <div className="row">
            <div className="col-xl-7 col-lg-7 col-md-12" style={{ marginBottom: 24 }}>
              <ContactForm />
            </div>

            <div className="col-xl-5 col-lg-5 col-md-12" style={{ marginBottom: 24 }}>
              <div className="panel" style={{ marginBottom: 18 }}>
                <div className="panel-head">
                  <div>
                    <h3>Direct channels</h3>
                    <p>Fastest answer is WhatsApp during Nairobi business hours.</p>
                  </div>
                  <MessageCircle size={17} style={{ color: "var(--ss-red)" }} aria-hidden="true" />
                </div>
                <div className="detail-row">
                  <span>
                    <MessageCircle size={13} aria-hidden="true" /> WhatsApp
                  </span>
                  <b>
                    <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                      +254 112 272 061
                    </a>
                  </b>
                </div>
                <div className="detail-row">
                  <span>
                    <Mail size={13} aria-hidden="true" /> Email
                  </span>
                  <b>
                    <a href="mailto:hello@solomonstays.co.ke">hello@solomonstays.co.ke</a>
                  </b>
                </div>
                <div className="detail-row">
                  <span>
                    <MapPin size={13} aria-hidden="true" /> Office
                  </span>
                  <b>Westlands, Nairobi, Kenya</b>
                </div>
                <div className="detail-row">
                  <span>
                    <Clock size={13} aria-hidden="true" /> Hours
                  </span>
                  <b>Monday to Friday, 8.00 to 18.00 EAT</b>
                </div>
              </div>

              <div className="panel" style={{ marginBottom: 18 }}>
                <div className="panel-head">
                  <div>
                    <h3>What a demo covers</h3>
                    <p>Thirty minutes, screen shared, using your own numbers if you have them.</p>
                  </div>
                </div>
                <ul className="ss-price-list" style={{ margin: 0 }}>
                  <li>A walk through the occupancy dashboard with your room count</li>
                  <li>How the 30 day forecast reads your history and Kenyan holidays</li>
                  <li>Channel commission, net revenue and the direct booking case</li>
                  <li>Reports and how they reach owners and management</li>
                </ul>
              </div>

              <div className="insight-card" style={{ marginTop: 0 }}>
                <div className="insight-label">Prefer to look first</div>
                <p>
                  The public demo carries six months of sample data for Demo Hotel, Nairobi, 80 rooms. No sign
                  up needed.{" "}
                  <Link href="/demo" style={{ color: "var(--ss-red)", fontWeight: 500 }}>
                    Open the live demo
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
