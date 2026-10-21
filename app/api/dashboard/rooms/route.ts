import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/apiAuth";
import { getRooms, ROOM_TYPE_RATES } from "@/lib/seedData";
import { loadRooms, saveRooms } from "@/lib/kv";
import type { Room, RoomTypeName } from "@/lib/types";

export const dynamic = "force-dynamic";

const roomSchema = z.object({
  number: z.string().min(1).max(8),
  type: z.enum(["Single", "Double", "Suite", "Family"]),
  floor: z.coerce.number().int().min(1).max(30),
  rate: z.coerce.number().int().min(1000).max(200000),
  status: z.enum(["available", "occupied", "maintenance", "reserved"]).default("available"),
});

export async function GET() {
  const { error } = await requireSession();
  if (error) return error;

  const rooms = await loadRooms(getRooms());
  return NextResponse.json({ rooms, total: rooms.length });
}

export async function POST(request: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  const body = await request.json().catch(() => null);
  const parsed = roomSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid room details", issues: parsed.error.flatten() }, { status: 400 });
  }

  const rooms = await loadRooms(getRooms());
  const exists = rooms.some((room) => room.number === parsed.data.number);
  if (exists) {
    return NextResponse.json({ error: `Room ${parsed.data.number} already exists.` }, { status: 409 });
  }

  const room: Room = {
    id: `room-${parsed.data.number}`,
    number: parsed.data.number,
    type: parsed.data.type as RoomTypeName,
    floor: parsed.data.floor,
    rate: parsed.data.rate || ROOM_TYPE_RATES[parsed.data.type as RoomTypeName],
    status: "available",
  };

  const updated = [...rooms, room].sort((a, b) => a.number.localeCompare(b.number));
  await saveRooms(updated);
  return NextResponse.json({ room, rooms: updated }, { status: 201 });
}
