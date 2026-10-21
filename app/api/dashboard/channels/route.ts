import { NextResponse } from "next/server";
import { requireSession } from "@/lib/apiAuth";
import { getChannelMonths, getChannels } from "@/lib/dashboardData";

export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireSession();
  if (error) return error;

  return NextResponse.json({
    summary: getChannels(),
    monthly: getChannelMonths(),
  });
}
