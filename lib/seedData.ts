import { addDays, dayOfWeek, monthKey, todayIso, MONTH_SHORT } from "@/lib/dates";
import { seasonFlags } from "@/lib/kenyaCalendar";
import type {
  Booking,
  BookingSource,
  ChannelMonth,
  ChannelSummary,
  DailyRecord,
  HotelSettings,
  Room,
  RoomStatus,
  RoomTypeName,
} from "@/lib/types";

export const ROOM_TYPES: RoomTypeName[] = ["Single", "Double", "Suite", "Family"];

export const ROOM_TYPE_RATES: Record<RoomTypeName, number> = {
  Single: 6200,
  Double: 8900,
  Suite: 15400,
  Family: 11800,
};

export const CHANNEL_COMMISSION: Record<BookingSource, number> = {
  Direct: 0,
  OTA: 0.18,
  "Walk-in": 0,
  Corporate: 0.08,
};

const DOW_FACTOR = [0.72, 0.57, 0.61, 0.66, 0.7, 0.8, 0.88];
const MONTH_FACTOR = [0.95, 0.92, 0.9, 0.93, 0.88, 0.9, 1.06, 1.04, 0.9, 0.93, 0.96, 1.12];

const KENYAN_FIRST_NAMES = [
  "Wanjiku",
  "Brian",
  "Amina",
  "Kiptoo",
  "Njeri",
  "Otieno",
  "Faith",
  "Hassan",
  "Mwikali",
  "Dennis",
  "Achieng",
  "Samuel",
  "Zawadi",
  "Kevin",
  "Mutiso",
  "Lydia",
  "Baraka",
  "Njoroge",
  "Halima",
  "Peter",
];

const KENYAN_LAST_NAMES = [
  "Kamau",
  "Ochieng",
  "Mwangi",
  "Abdalla",
  "Kipchoge",
  "Wafula",
  "Njoroge",
  "Mutua",
  "Auma",
  "Cheruiyot",
  "Odhiambo",
  "Wekesa",
  "Chebet",
  "Maina",
  "Onyango",
];

const CORPORATE_GUESTS = [
  "Safaricom PLC",
  "Kenya Airways",
  "Equity Group",
  "Britam Holdings",
  "KCB Group",
  "Bidco Africa",
];

function seededRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

export const DEMO_HOTEL_NAME = process.env.DEFAULT_HOTEL_NAME || "Demo Hotel, Nairobi";
export const TOTAL_ROOMS = Number(process.env.DEFAULT_TOTAL_ROOMS || 80);

export function guestName(index: number): string {
  const first = KENYAN_FIRST_NAMES[index % KENYAN_FIRST_NAMES.length];
  const last = KENYAN_LAST_NAMES[(index * 3) % KENYAN_LAST_NAMES.length];
  return `${first} ${last}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Deterministic daily historical dataset. One record per day.
 * Values are generated from the same fixed seed so the dashboard,
 * the API routes and the demo page always agree with each other.
 */
export function buildDailyHistory(days = 180, totalRooms = TOTAL_ROOMS): DailyRecord[] {
  const end = todayIso();
  const records: DailyRecord[] = [];
  const random = seededRandom(20260114);

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = addDays(end, -i);
    const dow = dayOfWeek(date);
    const month = Number(date.slice(5, 7)) - 1;
    const flags = seasonFlags(date);
    const noise = (random() - 0.5) * 0.045;

    let occupancy =
      0.7 +
      (DOW_FACTOR[dow] - 0.69) * 0.9 +
      (MONTH_FACTOR[month] - 1) * 0.5 +
      (flags.publicHoliday ? 0.07 : 0) +
      (flags.schoolHoliday ? 0.05 : 0) +
      noise;
    occupancy = clamp(occupancy, 0.32, 0.97);

    const roomsOccupied = Math.round(occupancy * totalRooms);
    const rateMultiplier =
      MONTH_FACTOR[month] * (dow === 5 || dow === 6 ? 1.11 : 1) * (flags.publicHoliday ? 1.09 : 1);
    const adr = Math.round((9300 * rateMultiplier + (random() - 0.5) * 500) / 50) * 50;
    const revenue = roomsOccupied * adr;

    const singleShare = 0.2 + random() * 0.05;
    const doubleShare = 0.44 + random() * 0.05;
    const suiteShare = 0.15 + random() * 0.03;
    const byRoomType = {
      Single: Math.round(roomsOccupied * singleShare),
      Double: Math.round(roomsOccupied * doubleShare),
      Suite: Math.round(roomsOccupied * suiteShare),
      Family: 0,
    } as Record<RoomTypeName, number>;
    byRoomType.Family = Math.max(0, roomsOccupied - byRoomType.Single - byRoomType.Double - byRoomType.Suite);

    records.push({
      date,
      occupancy: Number(((roomsOccupied / totalRooms) * 100).toFixed(1)),
      roomsOccupied,
      totalRooms,
      adr,
      revpar: Math.round(revenue / totalRooms),
      revenue,
      byRoomType,
    });
  }

  return records;
}

let cachedHistory: DailyRecord[] | null = null;

export function getDailyHistory(): DailyRecord[] {
  if (!cachedHistory) {
    cachedHistory = buildDailyHistory(180, TOTAL_ROOMS);
  }
  return cachedHistory;
}

export function getTodayRecord(): DailyRecord {
  const history = getDailyHistory();
  return history[history.length - 1];
}

export function previousDayRecord(): DailyRecord {
  const history = getDailyHistory();
  return history[history.length - 2] ?? history[history.length - 1];
}

function statusForRoom(index: number, random: () => number): RoomStatus {
  const roll = random();
  if (index % 17 === 0) return "maintenance";
  if (roll > 0.9) return "reserved";
  if (roll > 0.34) return "occupied";
  return "available";
}

export function buildRooms(totalRooms = TOTAL_ROOMS): Room[] {
  const random = seededRandom(7712);
  const rooms: Room[] = [];
  const perFloor = 20;
  const floors = Math.ceil(totalRooms / perFloor);
  let created = 0;

  for (let floor = 1; floor <= floors; floor += 1) {
    const slotsOnFloor = Math.min(perFloor, totalRooms - created);
    for (let slot = 1; slot <= slotsOnFloor; slot += 1) {
      const number = `${floor}${String(slot).padStart(2, "0")}`;
      let type: RoomTypeName = "Double";
      if (slot <= 6) type = "Single";
      else if (slot <= 14) type = "Double";
      else if (slot <= 17) type = "Suite";
      else type = "Family";

      const status = statusForRoom(created, random);
      const nights = 1 + Math.floor(random() * 4);
      const checkIn = addDays(todayIso(), -Math.floor(random() * 3));
      const rate = ROOM_TYPE_RATES[type];

      rooms.push({
        id: `room-${number}`,
        number,
        type,
        floor,
        rate,
        status,
        guestName: status === "occupied" || status === "reserved" ? guestName(created + 7) : undefined,
        checkIn: status === "occupied" || status === "reserved" ? checkIn : undefined,
        checkOut: status === "occupied" || status === "reserved" ? addDays(checkIn, nights) : undefined,
      });
      created += 1;
    }
  }

  return rooms;
}

let cachedRooms: Room[] | null = null;

export function getRooms(): Room[] {
  if (!cachedRooms) cachedRooms = buildRooms(TOTAL_ROOMS);
  return cachedRooms;
}

export function buildBookings(): Booking[] {
  const random = seededRandom(4491);
  const rooms = getRooms();
  const sources: BookingSource[] = ["Direct", "OTA", "OTA", "Walk-in", "Corporate", "Direct", "OTA"];
  const bookings: Booking[] = [];
  const start = addDays(todayIso(), -60);

  for (let i = 0; i < 148; i += 1) {
    const room = rooms[Math.floor(random() * rooms.length)];
    const checkIn = addDays(start, Math.floor(random() * 80));
    const nights = 1 + Math.floor(random() * 4);
    const source = sources[Math.floor(random() * sources.length)];
    const rate = Math.round((room.rate * (0.92 + random() * 0.2)) / 50) * 50;
    const corporate = source === "Corporate";
    bookings.push({
      id: `BK-${String(2400 + i)}`,
      roomNumber: room.number,
      roomType: room.type,
      guestName: corporate
        ? CORPORATE_GUESTS[i % CORPORATE_GUESTS.length]
        : guestName(i * 5 + 3),
      checkIn,
      checkOut: addDays(checkIn, nights),
      nights,
      rate,
      source,
      total: rate * nights,
    });
  }

  return bookings.sort((a, b) => (a.checkIn < b.checkIn ? 1 : -1));
}

let cachedBookings: Booking[] | null = null;

export function getBookings(): Booking[] {
  if (!cachedBookings) cachedBookings = buildBookings();
  return cachedBookings;
}

export function getChannelSummary(bookings = getBookings()): ChannelSummary[] {
  const currentMonth = monthKey(todayIso());
  const inMonth = bookings.filter((booking) => monthKey(booking.checkIn) === currentMonth);
  const pool = inMonth.length > 0 ? inMonth : bookings.slice(0, 60);

  const summaries = new Map<BookingSource, ChannelSummary>();
  (Object.keys(CHANNEL_COMMISSION) as BookingSource[]).forEach((source) => {
    summaries.set(source, {
      source,
      bookings: 0,
      revenue: 0,
      commissionRate: CHANNEL_COMMISSION[source],
      netRevenue: 0,
    });
  });

  pool.forEach((booking) => {
    const entry = summaries.get(booking.source);
    if (!entry) return;
    entry.bookings += 1;
    entry.revenue += booking.total;
  });

  return Array.from(summaries.values()).map((entry) => ({
    ...entry,
    netRevenue: Math.round(entry.revenue * (1 - entry.commissionRate)),
  }));
}

export function getChannelTrend(): ChannelMonth[] {
  const random = seededRandom(90125);
  const months: ChannelMonth[] = [];
  const today = new Date(`${todayIso()}T00:00:00.000Z`);

  for (let i = 11; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setUTCDate(1);
    date.setUTCMonth(date.getUTCMonth() - i);
    const label = `${MONTH_SHORT[date.getUTCMonth()]} ${String(date.getUTCFullYear()).slice(2)}`;
    const base = 150 + Math.round(random() * 140);
    months.push({
      month: label,
      Direct: Math.round(base * (0.3 + random() * 0.08)),
      OTA: Math.round(base * (0.4 + random() * 0.08)),
      "Walk-in": Math.round(base * (0.1 + random() * 0.05)),
      Corporate: Math.round(base * (0.12 + random() * 0.05)),
    });
  }

  return months;
}

export interface SeasonalityPoint {
  month: string;
  "2024": number;
  "2025": number;
  "2026": number;
}

export function getSeasonality(): SeasonalityPoint[] {
  const base = [62, 58, 64, 70, 68, 74, 84, 82, 71, 76, 74, 87];
  const random = seededRandom(33011);
  return MONTH_SHORT.map((month, index) => ({
    month,
    "2024": Math.round(base[index] - 4 + (random() - 0.5) * 5),
    "2025": Math.round(base[index] - 2 + (random() - 0.5) * 5),
    "2026": Math.round(base[index] + (random() - 0.5) * 4),
  }));
}

export const SEASONAL_INSIGHTS: Record<string, string> = {
  Jan: "January opens strong at 78 percent as festive stays spill into the new year. Hold rates for the first ten days, then release a corporate weekday offer.",
  Feb: "February dips as corporate travel restarts slowly. A two night midweek package has historically lifted occupancy by 6 points in this month.",
  Mar: "March is conference season in Nairobi. Corporate bookings rise, so protect at least 30 percent of double rooms for midweek corporate allotments.",
  Apr: "April carries the Easter and school break peak. Expect a sharp jump in family rooms and a weaker final week when schools reopen.",
  May: "May is the quietest month at 68 percent. Shift the OTA mix down to protect margin and push direct booking offers to repeat guests.",
  Jun: "June closes the second term with modest leisure demand. Weekend occupancy outruns weekdays by 14 points, so price Friday and Saturday separately.",
  Jul: "July and August are the diaspora season, the strongest two months outside December. Raise rates by 12 to 18 percent from the first week.",
  Aug: "August holds the highest mid year occupancy at 82 percent. Suites sell out first, so consider a minimum two night stay over the long weekend.",
  Sep: "September resets after the school break. Group and conference business is the fastest route back to occupancy above 70 percent.",
  Oct: "October peaks around Mashujaa Day. Build a three day holiday package and expect walk-in demand from road travellers.",
  Nov: "November softens before the festive rush. This is the right month to renegotiate OTA commission tiers and lock corporate rates.",
  Dec: "December historically shows your highest occupancy at 87 percent. Consider adjusting rates by 15 to 20 percent from December 15 onward.",
};

export function defaultSettings(): HotelSettings {
  return {
    hotelName: DEMO_HOTEL_NAME,
    logoUrl: "",
    totalRooms: TOTAL_ROOMS,
    city: "Nairobi",
    roomTypes: ROOM_TYPES.map((name, index) => ({
      id: `rt-${index + 1}`,
      name,
      rate: ROOM_TYPE_RATES[name],
      count: name === "Double" ? 32 : name === "Single" ? 24 : name === "Suite" ? 12 : 12,
    })),
    channels: ["Direct", "OTA", "Walk-in", "Corporate"],
    reportingEmail: "revenue@solomonstays.co.ke",
    fiscalYearStartMonth: 1,
  };
}

export const TESTIMONIALS = [
  {
    quote:
      "We stopped guessing on Fridays. Solomon Stays showed us that weekend demand was consistently 14 points above weekdays, so we changed our rate calendar and revenue grew without adding a single room.",
    name: "Wanjiku Kamau",
    role: "General Manager, boutique hotel, Nairobi",
  },
  {
    quote:
      "The 30 day forecast is what sold me. Our OTA commissions were eating margin, and the channel report showed exactly which source was profitable after commission. We moved 20 percent of bookings to direct.",
    name: "Otieno Wafula",
    role: "Revenue Manager, 74 room property, Kisumu",
  },
  {
    quote:
      "Reports used to take my team half a day in spreadsheets. Now I generate a monthly revenue report in one click and email it to the owners before the morning meeting.",
    name: "Faith Cheruiyot",
    role: "Hotel Manager, beach resort, Mombasa",
  },
];
