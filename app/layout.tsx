import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SessionProvider } from "@/components/session-provider";
import { Preloader } from "@/components/preloader";
import { CookieConsent } from "@/components/cookie-consent";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { VoiceTour } from "@/components/voice-tour";

export const metadata: Metadata = {
  title: {
    default: "Solomon Stays | Know your rooms. Grow your revenue.",
    template: "%s | Solomon Stays",
  },
  description:
    "Solomon Stays is hotel occupancy prediction and revenue management analytics for Kenyan hotels. Forecast demand for 30 days, track RevPAR and ADR, compare booking channels and generate reports in one click.",
  keywords: [
    "hotel occupancy dashboard Kenya",
    "revenue management Nairobi",
    "RevPAR tracking",
    "hotel analytics Kenya",
    "occupancy forecast",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://solomonstays.co.ke"),
  openGraph: {
    title: "Solomon Stays | Know your rooms. Grow your revenue.",
    description:
      "Occupancy prediction and revenue management analytics built for Kenyan hotels. Start a free 14 day trial.",
    type: "website",
    locale: "en_KE",
  },
  icons: {
    icon: "/images/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff0909",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE">
      <head>
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/font-awesome.min.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
        <link rel="stylesheet" href="/css/custom.css" />
      </head>
      <body className="main-layout">
        <SessionProvider>
          <Preloader />
          {children}
          <CookieConsent />
          <WhatsAppButton />
          <VoiceTour />
        </SessionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
