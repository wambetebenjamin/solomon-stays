import nodemailer from "nodemailer";

export interface MailPayload {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export function mailerConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendMail(payload: MailPayload): Promise<{ sent: boolean; reason?: string }> {
  if (!mailerConfigured()) {
    return { sent: false, reason: "SMTP is not configured, message logged only." };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "Solomon Stays <reports@solomonstays.co.ke>",
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });

  return { sent: true };
}
