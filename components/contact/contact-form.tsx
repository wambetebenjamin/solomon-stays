"use client";

import { useEffect, useRef, useState } from "react";
import { Send, ShieldCheck } from "lucide-react";
import {
  getRecaptchaV3Token,
  loadRecaptcha,
  recaptchaConfigured,
  renderRecaptchaV2,
} from "@/lib/recaptchaClient";

type Topic = "demo" | "general" | "pricing" | "support";

interface FormState {
  name: string;
  email: string;
  hotel: string;
  rooms: string;
  topic: Topic;
  message: string;
}

const initialForm: FormState = {
  name: "",
  email: "",
  hotel: "",
  rooms: "",
  topic: "demo",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [needsChallenge, setNeedsChallenge] = useState(false);
  const challengeRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);

  useEffect(() => {
    if (!needsChallenge || !challengeRef.current) return;
    loadRecaptcha()
      .then(() => {
        if (challengeRef.current && widgetId.current === null) {
          widgetId.current = renderRecaptchaV2(challengeRef.current);
        }
      })
      .catch(() => setNeedsChallenge(false));
  }, [needsChallenge]);

  const readChallengeToken = (): string | undefined => {
    const response = document.querySelector<HTMLTextAreaElement>('textarea[name="g-recaptcha-response"]');
    return response?.value || undefined;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const token = needsChallenge ? readChallengeToken() : await getRecaptchaV3Token("contact_submit");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          token,
          captchaVersion: needsChallenge ? "v2" : "v3",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.fallbackRequired) {
          setNeedsChallenge(true);
          setStatus({
            kind: "error",
            text: "Please complete the quick challenge below, then send your request again.",
          });
          return;
        }
        setStatus({ kind: "error", text: data.error ?? "Your request could not be sent. Please try again." });
        return;
      }

      setStatus({ kind: "success", text: data.message as string });
      setForm(initialForm);
      setNeedsChallenge(false);
    } catch {
      setStatus({ kind: "error", text: "Network error. Please try again or message us on WhatsApp." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="panel" aria-label="Contact Solomon Stays">
      <div className="panel-head">
        <div>
          <h3>Request a demo or ask a question</h3>
          <p>Tell us about the property and we will reply within one business day.</p>
        </div>
        <ShieldCheck size={17} style={{ color: "var(--ss-muted)" }} aria-hidden="true" />
      </div>

      <div className="ss-form-grid">
        <div className="ss-field">
          <label htmlFor="contact-name">Your name</label>
          <input
            id="contact-name"
            className="ss-input"
            required
            minLength={2}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Wanjiku Kamau"
          />
        </div>
        <div className="ss-field">
          <label htmlFor="contact-email">Work email</label>
          <input
            id="contact-email"
            type="email"
            className="ss-input"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="you@yourhotel.co.ke"
          />
        </div>
        <div className="ss-field">
          <label htmlFor="contact-hotel">Hotel or group</label>
          <input
            id="contact-hotel"
            className="ss-input"
            required
            minLength={2}
            value={form.hotel}
            onChange={(event) => setForm({ ...form, hotel: event.target.value })}
            placeholder="Riverside Lodge, Naivasha"
          />
        </div>
        <div className="ss-field">
          <label htmlFor="contact-rooms">Rooms</label>
          <input
            id="contact-rooms"
            className="ss-input"
            inputMode="numeric"
            value={form.rooms}
            onChange={(event) => setForm({ ...form, rooms: event.target.value })}
            placeholder="48"
          />
        </div>
        <div className="ss-field span-2">
          <label htmlFor="contact-topic">What is this about</label>
          <select
            id="contact-topic"
            className="ss-select"
            value={form.topic}
            onChange={(event) => setForm({ ...form, topic: event.target.value as Topic })}
          >
            <option value="demo">Book a product demo</option>
            <option value="pricing">Pricing and plans</option>
            <option value="support">Support for my workspace</option>
            <option value="general">General enquiry</option>
          </select>
        </div>
        <div className="ss-field span-2">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            className="ss-textarea"
            required
            minLength={10}
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            placeholder="We run a 48 room lodge in Naivasha and currently track occupancy in a spreadsheet. We would like to see how the forecast works with our history."
          />
        </div>
      </div>

      {needsChallenge && (
        <div className="ss-field">
          <label>Verification challenge</label>
          <div ref={challengeRef} />
          <p className="ss-hint">
            Our automated check was not confident enough, so please confirm you are human with the checkbox.
          </p>
        </div>
      )}

      {status && <div className={`ss-alert ${status.kind}`}>{status.text}</div>}

      <div className="report-actions">
        <button type="submit" className="ss-btn" disabled={submitting}>
          {submitting ? (
            <>
              <span className="spinner" aria-hidden="true" /> Sending
            </>
          ) : (
            <>
              <Send size={15} aria-hidden="true" /> Send request
            </>
          )}
        </button>
      </div>

      <p className="ss-hint" style={{ marginTop: 14 }}>
        {recaptchaConfigured()
          ? "This form is protected by Google reCAPTCHA v3. No checkbox needed unless our risk check asks for one."
          : "Captcha verification is configured through the NEXT_PUBLIC_RECAPTCHA_SITE_KEY and RECAPTCHA_SECRET_KEY environment variables."}{" "}
        We use your details only to respond to this enquiry, in line with the Kenya Data Protection Act 2019.
      </p>
    </form>
  );
}
