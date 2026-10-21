import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized. Sign in to access hotel data." }, { status: 401 }),
    };
  }
  return { session, error: null };
}
