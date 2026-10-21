import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/apiAuth";
import { buildReport } from "@/lib/reports";
import { defaultSettings } from "@/lib/seedData";
import { loadSettings } from "@/lib/kv";

export const dynamic = "force-dynamic";

const schema = z.object({
  type: z.enum(["daily", "weekly", "monthly", "occupancy-comparison"]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function POST(request: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid report request", issues: parsed.error.flatten() }, { status: 400 });
  }

  const settings = await loadSettings(defaultSettings());
  const report = buildReport(parsed.data, settings.hotelName);
  return NextResponse.json({ report });
}
