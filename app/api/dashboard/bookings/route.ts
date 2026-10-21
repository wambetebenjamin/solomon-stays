import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireSession } from "@/lib/apiAuth";
import { getBookings } from "@/lib/seedData";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.min(50, Math.max(5, Number(searchParams.get("pageSize") || 10)));
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const type = searchParams.get("type");
  const source = searchParams.get("source");

  const filtered = getBookings().filter((booking) => {
    if (start && booking.checkIn < start) return false;
    if (end && booking.checkIn > end) return false;
    if (type && booking.roomType !== type) return false;
    if (source && booking.source !== source) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;

  return NextResponse.json({
    bookings: filtered.slice(startIndex, startIndex + pageSize),
    pagination: {
      page: safePage,
      pageSize,
      total: filtered.length,
      totalPages,
    },
    filters: { start, end, type, source },
  });
}
