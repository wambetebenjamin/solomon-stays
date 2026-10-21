import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/apiAuth";
import { defaultSettings } from "@/lib/seedData";
import { loadSettings, saveSettings } from "@/lib/kv";

export const dynamic = "force-dynamic";

const settingsSchema = z.object({
  hotelName: z.string().min(2).max(120),
  logoUrl: z.string().max(500).optional(),
  totalRooms: z.coerce.number().int().min(1).max(2000),
  city: z.string().min(1).max(80).optional(),
  roomTypes: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(40),
        rate: z.coerce.number().min(500).max(500000),
        count: z.coerce.number().int().min(0).max(2000),
      }),
    )
    .min(1),
  channels: z.array(z.string().min(1).max(40)).min(1),
  reportingEmail: z.string().email(),
  fiscalYearStartMonth: z.coerce.number().int().min(1).max(12),
});

export async function GET() {
  const { error } = await requireSession();
  if (error) return error;

  const settings = await loadSettings(defaultSettings());
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  const body = await request.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid settings", issues: parsed.error.flatten() }, { status: 400 });
  }

  const current = await loadSettings(defaultSettings());
  const settings = await saveSettings({
    ...current,
    ...parsed.data,
    logoUrl: parsed.data.logoUrl ?? current.logoUrl,
    city: parsed.data.city ?? current.city,
  });

  return NextResponse.json(settings);
}
