import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireSession } from "@/lib/apiAuth";
import { getRevenueBetween, getRevenueSeries, getRoomTypeOccupancy } from "@/lib/dashboardData";
import { addDays, todayIso } from "@/lib/dates";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const days = Number(searchParams.get("days") || 30);

  const series =
    start && end ? getRevenueBetween(start, end) : getRevenueSeries(Number.isFinite(days) ? days : 30);

  return NextResponse.json({
    range: {
      start: start ?? addDays(todayIso(), -(Number.isFinite(days) ? days : 30) + 1),
      end: end ?? todayIso(),
    },
    series,
    roomTypeOccupancy: getRoomTypeOccupancy(7),
  });
}
