import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/apiAuth";
import { defaultSettings } from "@/lib/seedData";
import { loadSettings, kvGet, kvSet, KV_KEYS } from "@/lib/kv";
import { sendMail, mailerConfigured } from "@/lib/mailer";
import { buildReport } from "@/lib/reports";
import { addDays, todayIso } from "@/lib/dates";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z.object({
  frequency: z.enum(["daily", "weekly", "monthly"]),
  reportType: z.enum(["daily", "weekly", "monthly", "occupancy-comparison"]),
  email: z.string().email(),
});

interface ScheduleRecord {
  id: string;
  frequency: "daily" | "weekly" | "monthly";
  reportType: "daily" | "weekly" | "monthly" | "occupancy-comparison";
  email: string;
  createdAt: string;
  nextRun: string;
}

export async function POST(request: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid schedule", issues: parsed.error.flatten() }, { status: 400 });
  }

  const settings = await loadSettings(defaultSettings());
  const intervalDays = parsed.data.frequency === "daily" ? 1 : parsed.data.frequency === "weekly" ? 7 : 30;
  const record: ScheduleRecord = {
    id: `sched_${Date.now()}`,
    frequency: parsed.data.frequency,
    reportType: parsed.data.reportType,
    email: parsed.data.email,
    createdAt: new Date().toISOString(),
    nextRun: addDays(todayIso(), intervalDays),
  };

  const existing = await kvGet<ScheduleRecord[]>(KV_KEYS.schedules, []);
  await kvSet(KV_KEYS.schedules, [record, ...existing].slice(0, 50));

  const report = buildReport(
    { type: parsed.data.reportType, startDate: addDays(todayIso(), -30), endDate: todayIso() },
    settings.hotelName,
  );

  let emailed = false;
  let message = `Report scheduled ${parsed.data.frequency}. Next run ${record.nextRun}.`;
  try {
    const result = await sendMail({
      to: parsed.data.email,
      subject: `Solomon Stays ${report.title} scheduled`,
      text: `${report.summary}\n\nThis report will arrive ${parsed.data.frequency} from ${settings.hotelName}.`,
    });
    emailed = result.sent;
    if (!result.sent && result.reason) message = `${message} ${result.reason}`;
  } catch {
    message = `${message} Email delivery is not available in this environment.`;
  }

  return NextResponse.json({
    schedule: record,
    emailed,
    smtpConfigured: mailerConfigured(),
    message,
  });
}
