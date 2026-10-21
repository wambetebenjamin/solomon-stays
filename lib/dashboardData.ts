import { addDays, todayIso } from "@/lib/dates";
import {
  getBookings,
  getChannelSummary,
  getChannelTrend,
  getDailyHistory,
  getSeasonality,
  getTodayRecord,
  ROOM_TYPES,
} from "@/lib/seedData";
import { forecastTomorrow, forecastNext30Days } from "@/lib/occupancyPredictor";
import type { DailyRecord, KpiSnapshot, Room, RoomStatus } from "@/lib/types";

function pctChange(current: number, previous: number): number {
  if (!previous) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export function getKpis(hotelName: string): KpiSnapshot {
  const history = getDailyHistory();
  const today = getTodayRecord();
  const previous = getDailyHistory()[Math.max(0, history.length - 8)];
  const roomsAvailable = Math.max(0, today.totalRooms - today.roomsOccupied);
  const tomorrow = forecastTomorrow(history);

  return {
    hotelName,
    totalRooms: today.totalRooms,
    date: today.date,
    occupancyRate: today.occupancy,
    roomsOccupied: today.roomsOccupied,
    revpar: today.revpar,
    adr: today.adr,
    revenue: today.revenue,
    roomsAvailable,
    forecastOccupancyTomorrow: tomorrow,
    deltas: {
      occupancy: pctChange(today.occupancy, previous.occupancy),
      revpar: pctChange(today.revpar, previous.revpar),
      adr: pctChange(today.adr, previous.adr),
      revenue: pctChange(today.revenue, previous.revenue),
    },
  };
}

export function getRevenueSeries(days = 30): DailyRecord[] {
  const history = getDailyHistory();
  const window = Math.min(Math.max(days, 1), history.length);
  return history.slice(-window);
}

export function getRevenueBetween(startDate: string, endDate: string): DailyRecord[] {
  return getDailyHistory().filter((record) => record.date >= startDate && record.date <= endDate);
}

export function getRoomTypeOccupancy(days = 7) {
  const history = getDailyHistory().slice(-days);
  return history.map((record) => ({
    date: record.date,
    Single: record.byRoomType.Single,
    Double: record.byRoomType.Double,
    Suite: record.byRoomType.Suite,
    Family: record.byRoomType.Family,
  }));
}

export function getForecast() {
  return forecastNext30Days(getDailyHistory());
}

export function getChannels() {
  return getChannelSummary();
}

export function getChannelMonths() {
  return getChannelTrend();
}

export function getSeasonalityTrend() {
  return getSeasonality();
}

export function getRoomStats(rooms: Room[]) {
  const byStatus: Record<RoomStatus, number> = {
    available: 0,
    occupied: 0,
    maintenance: 0,
    reserved: 0,
  };
  rooms.forEach((room) => {
    byStatus[room.status] += 1;
  });
  return {
    total: rooms.length,
    byStatus,
    byType: ROOM_TYPES.map((type) => ({
      type,
      count: rooms.filter((room) => room.type === type).length,
    })),
  };
}

export function getRecentBookings(limit = 6) {
  return getBookings()
    .filter((booking) => booking.checkIn <= todayIso() && booking.checkOut >= addDays(todayIso(), -1))
    .slice(0, limit);
}
