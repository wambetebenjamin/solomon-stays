import type { Metadata } from "next";
import { RoomManager } from "@/components/dashboard/room-manager";
import { getRooms } from "@/lib/seedData";
import { loadRooms } from "@/lib/kv";

export const metadata: Metadata = {
  title: "Room management",
  description: "Add, edit and deactivate rooms across your property.",
};

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  const rooms = await loadRooms(getRooms());

  return (
    <>
      <div className="dash-section-title">
        <div>
          <h2>Room management</h2>
          <p>Room number, type, floor, rate per night and status for every key in the property.</p>
        </div>
        <span className="ss-badge neutral">{rooms.length} rooms</span>
      </div>
      <RoomManager initialRooms={rooms} />
    </>
  );
}
