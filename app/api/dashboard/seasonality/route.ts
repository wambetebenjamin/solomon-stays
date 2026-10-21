import { NextResponse } from "next/server";
import { requireSession } from "@/lib/apiAuth";
import { getSeasonalityTrend } from "@/lib/dashboardData";
import { SEASONAL_INSIGHTS } from "@/lib/seedData";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireSession();
  if (error) return error;

  return NextResponse.json({ series: getSeasonalityTrend(), insights: SEASONAL_INSIGHTS });
}
