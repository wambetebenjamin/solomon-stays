# Solomon Stays

Know your rooms. Grow your revenue.

Hotel occupancy prediction and revenue management analytics for Kenyan hotels, built as a natural extension
of the uploaded keto 1.0.0 template. Same palette, same Poppins and Rajdhani type, same red accent, navy
footer and pill buttons.

## What is inside

**Public marketing site**

- `/` hero, problem statement, six feature highlights, a live recharts demo preview, pricing, testimonials and call to action
- `/demo` the full product with six months of sample data for Demo Hotel, Nairobi, 80 rooms, read only
- `/pricing` plan cards with monthly and annual billing, a feature comparison matrix and an FAQ accordion
- `/contact` demo request and general contact form with reCAPTCHA v3 and v2 fallback
- `/legal/privacy-policy`, `/legal/terms`, `/legal/cookie-policy`
- `/auth/signin`, `/auth/signup` with credentials and Google OAuth

**Hotel dashboard, session gated**

- `/dashboard` six KPI cards, the prediction engine area chart, revenue line chart, room type bar chart, ADR and RevPAR composed chart, booking source pie chart, room status grid and four tabs
- `/dashboard/rooms` add, edit, deactivate and delete rooms
- `/dashboard/bookings` paginated and filterable booking log with CSV export
- `/dashboard/settings` hotel profile, logo upload, room type configuration, channels and reporting preferences

## The prediction engine

`lib/occupancyPredictor.ts` is a deterministic formula, not a machine learning model, and it makes no
network calls:

```
prediction = weighted moving average of the same day of week across 180 days
           x seasonal month index from the property's own history
           + public holiday lift
           + school holiday lift
```

Kenyan public holidays and school term dates are hardcoded in `lib/kenyaCalendar.ts`. The same history
always produces the same forecast.

## Getting started

```bash
npm install
npm run dev
```

Sign in with the demo manager account shown on `/auth/signin`:

```
manager@solomonstays.co.ke
solomon2026
```

Every dashboard route is session gated. Without credentials the workspace renders on a deterministic sample
data set, so all screens are explorable.

## Environment variables

Copy `.env.example` and fill in what you need. Only `NEXTAUTH_SECRET` is required in production. Storage,
email and reCAPTCHA are optional and degrade gracefully.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata, sitemap and robots |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number, defaults to 254112272061 |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key, browser only |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA secret, server only, never shipped to the client |
| `NEXTAUTH_SECRET`, `NEXTAUTH_URL` | Session signing and callback base |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `PEXELS_API_KEY` | Pexels access for photography sourcing |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Vercel KV for settings, rooms and schedules |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob for hotel logo upload |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Nodemailer for contact and scheduled reports |
| `DEFAULT_HOTEL_NAME`, `DEFAULT_TOTAL_ROOMS` | Seed property name and size |

## Verification

```bash
npm ci
npx tsc --noEmit
npx next build
npm audit --audit-level=high
```

See `docs/TEMPLATE-AUDIT.md` for the full template audit and `public/images/image-credits.md` for image
provenance.
