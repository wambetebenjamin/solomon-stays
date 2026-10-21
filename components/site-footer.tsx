import Link from "next/link";
import { CookiePreferencesButton } from "@/components/cookie-consent";

const YEAR = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
            <div className="footer-brand">
              <Link href="/" aria-label="Solomon Stays home">
                <span className="ss-wordmark">
                  Solomon <span>Stays</span>
                </span>
                <small>Know your rooms. Grow your revenue.</small>
              </Link>
            </div>
            <p className="footer-about">
              Occupancy prediction and revenue management analytics for Kenyan hotels, lodges and
              hospitality groups. Built by revenue managers, for revenue managers.
            </p>
            <ul className="social_icon">
              <li>
                <a href="https://wa.me/254112272061" aria-label="Solomon Stays on WhatsApp" target="_blank" rel="noopener noreferrer">
                  <i className="fa fa-whatsapp" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href="https://wa.me/254112272061" aria-label="Message Solomon Stays" target="_blank" rel="noopener noreferrer">
                  <i className="fa fa-comments" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a href="mailto:hello@solomonstays.co.ke" aria-label="Email Solomon Stays">
                  <i className="fa fa-envelope" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6">
            <h3>Product</h3>
            <ul className="link_menu">
              <li>
                <Link href="/demo">Live demo</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link href="/auth/signup">Free trial</Link>
              </li>
            </ul>
          </div>

          <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6">
            <h3>Legal</h3>
            <ul className="link_menu">
              <li>
                <Link href="/legal/privacy-policy">Privacy policy</Link>
              </li>
              <li>
                <Link href="/legal/terms">Terms of service</Link>
              </li>
              <li>
                <Link href="/legal/cookie-policy">Cookie policy</Link>
              </li>
              <li>
                <CookiePreferencesButton className="footer-link-button" />
              </li>
            </ul>
          </div>

          <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
            <h3>Talk to us</h3>
            <ul className="conta">
              <li>
                <i className="fa fa-whatsapp" aria-hidden="true" />
                <a href="https://wa.me/254112272061" target="_blank" rel="noopener noreferrer">
                  +254 112 272 061
                </a>
              </li>
              <li>
                <i className="fa fa-envelope" aria-hidden="true" />
                <a href="mailto:hello@solomonstays.co.ke">hello@solomonstays.co.ke</a>
              </li>
              <li>
                <i className="fa fa-map-marker" aria-hidden="true" />
                <span>Westlands, Nairobi, Kenya</span>
              </li>
            </ul>
            <div className="bottom_form">
              <Link href="/contact" className="sub_btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                Book a demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="copyright">
        <div className="container">
          <p>
            Copyright {YEAR} Solomon Stays. All rights reserved. Cairo Road, Westlands, Nairobi. WhatsApp
            +254 112 272 061. Built for Kenyan hospitality teams.
          </p>
        </div>
      </div>
    </footer>
  );
}
