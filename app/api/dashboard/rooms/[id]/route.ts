import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/apiAuth";
import { getRooms } from "@/lib/seedData";
import { loadRooms, saveRooms } from "@/lib/kv";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  number: z.string().min(1).max(8).optional(),
  type: z.enum(["Single", "Double", "Suite", "Family"]).optional(),
  floor: z.coerce.number().int().min(1).max(30).optional(),
  rate: z.coerce.number().int().min(1000).max(200000).optional(),
  status: z.enum(["available", "occupied", "maintenance", "reserved"]).optional(),
  active: z.boolean().optional(),
});

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid room update", issues: parsed.error.flatten() }, { status: 400 });
  }

  const rooms = await loadRooms(getRooms());
  const index = rooms.findIndex((room) => room.id === id || room.number === id);
  if (index === -1) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const { active, ...changes } = parsed.data;
  const updatedRoom = { ...rooms[index], ...changes };
  if (active === false) updatedRoom.status = "maintenance";

  const updated = [...rooms];
  updated[index] = updatedRoom;
  await saveRooms(updated);
  return NextResponse.json({ room: updatedRoom });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { error } = await requireSession();
  if (error) return error;

  const { id } = await context.params;
  const rooms = await loadRooms(getRooms());
  const index = rooms.findIndex((room) => room.id === id || room.number === id);
  if (index === -1) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const updated = rooms.filter((_, roomIndex) => roomIndex !== index);
  await saveRooms(updated);
  return NextResponse.json({ removed: id, rooms: updated });
}
