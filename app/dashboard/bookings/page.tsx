import type { Metadata } from "next";
import { BookingLog } from "@/components/dashboard/booking-log";
import { getBookings } from "@/lib/seedData";

export const metadata: Metadata = {
  title: "Booking log",
  description: "Every booking on the property, filterable by date, room type and source.",
};

export const dynamic = "force-dynamic";

export default function BookingsPage() {
  const bookings = getBookings();

  return (
    <>
      <div className="dash-section-title">
        <div>
          <h2>Booking log</h2>
          <p>
            Every reservation on the property with nights, rate, source and total. Guest names are fictional
            placeholders in this workspace.
          </p>
        </div>
        <span className="ss-badge neutral">{bookings.length} records</span>
      </div>
      <BookingLog initialBookings={bookings} />
    </>
  );
}
