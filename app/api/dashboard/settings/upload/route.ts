import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireSession } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("logo");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Attach a logo image in the logo field." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Logo must be an image file." }, { status: 415 });
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "Logo must be smaller than 2 MB." }, { status: 413 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({
      url: "",
      persisted: false,
      message: "Vercel Blob is not configured. Add BLOB_READ_WRITE_TOKEN to persist the logo.",
    });
  }

  try {
    const { put } = await import("@vercel/blob");
    const blob = await put(`solomon-stays/logos/${Date.now()}-${file.name}`, file, {
      access: "public",
      token,
      addRandomSuffix: true,
    });
    return NextResponse.json({ url: blob.url, persisted: true });
  } catch {
    return NextResponse.json({ error: "Logo upload failed. Try again." }, { status: 502 });
  }
}
