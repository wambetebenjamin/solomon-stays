import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { sendMail, mailerConfigured } from "@/lib/mailer";
import { kvGet, kvSet, KV_KEYS } from "@/lib/kv";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  hotel: z.string().min(2).max(120),
  rooms: z.string().max(20).optional(),
  topic: z.enum(["demo", "general", "pricing", "support"]).default("demo"),
  message: z.string().min(10).max(2000),
  token: z.string().optional(),
  captchaVersion: z.enum(["v2", "v3"]).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form details and try again.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const captcha = await verifyRecaptcha(parsed.data.token);
  if (!captcha.success) {
    return NextResponse.json(
      {
        error: "Captcha verification did not pass. Please complete the challenge and resubmit.",
        fallbackRequired: captcha.fallbackRequired,
      },
      { status: 400 },
    );
  }

  const { token: _token, captchaVersion: _captchaVersion, ...lead } = parsed.data;
  void _token;
  void _captchaVersion;

  const log = await kvGet<unknown[]>(KV_KEYS.contacts, []);
  await kvSet(KV_KEYS.contacts, [{ ...lead, receivedAt: new Date().toISOString() }, ...log].slice(0, 100));

  let delivered = false;
  try {
    const result = await sendMail({
      to: process.env.SMTP_FROM || "hello@solomonstays.co.ke",
      subject: `New ${lead.topic} enquiry from ${lead.hotel}`,
      text: [
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        `Hotel: ${lead.hotel}`,
        `Rooms: ${lead.rooms || "not stated"}`,
        `Topic: ${lead.topic}`,
        "",
        lead.message,
      ].join("\n"),
    });
    delivered = result.sent;
  } catch {
    delivered = false;
  }

  return NextResponse.json({
    ok: true,
    delivered,
    smtpConfigured: mailerConfigured(),
    message: delivered
      ? "Thank you. Our team will reply within one business day."
      : "Thank you. Your request is logged and our team will follow up on WhatsApp if email is unavailable.",
  });
}
