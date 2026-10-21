import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRecaptcha } from "@/lib/recaptcha";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { token?: string; version?: "v2" | "v3"; action?: string }
    | null;

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : undefined;
  const result = await verifyRecaptcha(body?.token, ip);

  return NextResponse.json({
    ...result,
    version: body?.version ?? "v3",
    action: body?.action ?? "submit",
  });
}
