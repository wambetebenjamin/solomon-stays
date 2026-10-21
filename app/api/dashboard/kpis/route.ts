import { NextResponse } from "next/server";
import { requireSession } from "@/lib/apiAuth";
import { getKpis } from "@/lib/dashboardData";
import { defaultSettings, DEMO_HOTEL_NAME } from "@/lib/seedData";
import { loadSettings } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireSession();
  if (error) return error;

  const settings = await loadSettings(defaultSettings());
  const kpis = getKpis(settings.hotelName || DEMO_HOTEL_NAME);
  return NextResponse.json(kpis);
}
