export type RoomTypeName = "Single" | "Double" | "Suite" | "Family";

export type RoomStatus = "available" | "occupied" | "maintenance" | "reserved";

export type BookingSource = "Direct" | "OTA" | "Walk-in" | "Corporate";

export interface Room {
  id: string;
  number: string;
  type: RoomTypeName;
  floor: number;
  rate: number;
  status: RoomStatus;
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
}

export interface Booking {
  id: string;
  roomNumber: string;
  roomType: RoomTypeName;
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  rate: number;
  source: BookingSource;
  total: number;
}

export interface DailyRecord {
  date: string;
  occupancy: number;
  roomsOccupied: number;
  totalRooms: number;
  adr: number;
  revpar: number;
  revenue: number;
  byRoomType: Record<RoomTypeName, number>;
}

export interface ForecastPoint {
  date: string;
  occupancy: number;
  dayOfWeek: string;
  schoolHoliday: boolean;
  publicHoliday: boolean;
  holidayName?: string;
  isForecast: boolean;
}

export interface ChannelSummary {
  source: BookingSource;
  bookings: number;
  revenue: number;
  commissionRate: number;
  netRevenue: number;
}

export interface ChannelMonth {
  month: string;
  Direct: number;
  OTA: number;
  "Walk-in": number;
  Corporate: number;
}

export interface KpiSnapshot {
  hotelName: string;
  totalRooms: number;
  date: string;
  occupancyRate: number;
  roomsOccupied: number;
  revpar: number;
  adr: number;
  revenue: number;
  roomsAvailable: number;
  forecastOccupancyTomorrow: number;
  deltas: {
    occupancy: number;
    revpar: number;
    adr: number;
    revenue: number;
  };
}

export interface RoomTypeConfig {
  id: string;
  name: string;
  rate: number;
  count: number;
}

export interface HotelSettings {
  hotelName: string;
  logoUrl: string;
  totalRooms: number;
  city: string;
  roomTypes: RoomTypeConfig[];
  channels: string[];
  reportingEmail: string;
  fiscalYearStartMonth: number;
}

export interface ReportRequest {
  type: "daily" | "weekly" | "monthly" | "occupancy-comparison";
  startDate: string;
  endDate: string;
}

export interface ReportRow {
  label: string;
  occupancy: number;
  adr: number;
  revpar: number;
  revenue: number;
}

export interface ReportPayload {
  type: ReportRequest["type"];
  title: string;
  hotelName: string;
  startDate: string;
  endDate: string;
  generatedAt: string;
  rows: ReportRow[];
  totals: ReportRow;
  forecastVariance: number;
  summary: string;
}
