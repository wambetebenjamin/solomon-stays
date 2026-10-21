/**
 * Kenyan public holidays and school term dates.
 * Deterministic, hardcoded calendar used by the occupancy predictor.
 * Islamic holiday dates are the published Kenyan gazette observances.
 */

export interface Holiday {
  date: string;
  name: string;
}

export interface HolidayRange {
  start: string;
  end: string;
  name: string;
}

const PUBLIC_HOLIDAYS: Holiday[] = [
  // 2024
  { date: "2024-01-01", name: "New Year's Day" },
  { date: "2024-03-29", name: "Good Friday" },
  { date: "2024-04-01", name: "Easter Monday" },
  { date: "2024-04-10", name: "Idd ul Fitr" },
  { date: "2024-05-01", name: "Labour Day" },
  { date: "2024-06-01", name: "Madaraka Day" },
  { date: "2024-06-17", name: "Idd ul Azha" },
  { date: "2024-10-20", name: "Mashujaa Day" },
  { date: "2024-12-12", name: "Jamhuri Day" },
  { date: "2024-12-25", name: "Christmas Day" },
  { date: "2024-12-26", name: "Boxing Day" },
  // 2025
  { date: "2025-01-01", name: "New Year's Day" },
  { date: "2025-03-31", name: "Idd ul Fitr" },
  { date: "2025-04-18", name: "Good Friday" },
  { date: "2025-04-21", name: "Easter Monday" },
  { date: "2025-05-01", name: "Labour Day" },
  { date: "2025-06-01", name: "Madaraka Day" },
  { date: "2025-06-07", name: "Idd ul Azha" },
  { date: "2025-10-20", name: "Mashujaa Day" },
  { date: "2025-12-12", name: "Jamhuri Day" },
  { date: "2025-12-25", name: "Christmas Day" },
  { date: "2025-12-26", name: "Boxing Day" },
  // 2026
  { date: "2026-01-01", name: "New Year's Day" },
  { date: "2026-03-20", name: "Idd ul Fitr" },
  { date: "2026-04-03", name: "Good Friday" },
  { date: "2026-04-06", name: "Easter Monday" },
  { date: "2026-05-01", name: "Labour Day" },
  { date: "2026-05-27", name: "Idd ul Azha" },
  { date: "2026-06-01", name: "Madaraka Day" },
  { date: "2026-10-20", name: "Mashujaa Day" },
  { date: "2026-12-12", name: "Jamhuri Day" },
  { date: "2026-12-25", name: "Christmas Day" },
  { date: "2026-12-26", name: "Boxing Day" },
  // 2027
  { date: "2027-01-01", name: "New Year's Day" },
  { date: "2027-03-09", name: "Idd ul Fitr" },
  { date: "2027-03-26", name: "Good Friday" },
  { date: "2027-03-29", name: "Easter Monday" },
  { date: "2027-05-01", name: "Labour Day" },
  { date: "2027-05-17", name: "Idd ul Azha" },
  { date: "2027-06-01", name: "Madaraka Day" },
  { date: "2027-10-20", name: "Mashujaa Day" },
  { date: "2027-12-12", name: "Jamhuri Day" },
  { date: "2027-12-25", name: "Christmas Day" },
  { date: "2027-12-26", name: "Boxing Day" },
];

const SCHOOL_HOLIDAYS: HolidayRange[] = [
  { start: "2024-04-08", end: "2024-05-05", name: "Term 1 break" },
  { start: "2024-08-05", end: "2024-08-25", name: "Term 2 break" },
  { start: "2024-10-21", end: "2024-11-03", name: "Half term" },
  { start: "2024-11-25", end: "2025-01-05", name: "Term 3 break" },
  { start: "2025-04-07", end: "2025-05-04", name: "Term 1 break" },
  { start: "2025-08-04", end: "2025-08-24", name: "Term 2 break" },
  { start: "2025-10-20", end: "2025-11-02", name: "Half term" },
  { start: "2025-11-24", end: "2026-01-04", name: "Term 3 break" },
  { start: "2026-04-06", end: "2026-05-03", name: "Term 1 break" },
  { start: "2026-08-03", end: "2026-08-23", name: "Term 2 break" },
  { start: "2026-10-19", end: "2026-11-01", name: "Half term" },
  { start: "2026-11-23", end: "2027-01-03", name: "Term 3 break" },
  { start: "2027-03-29", end: "2027-05-02", name: "Term 1 break" },
  { start: "2027-08-02", end: "2027-08-22", name: "Term 2 break" },
  { start: "2027-10-18", end: "2027-10-31", name: "Half term" },
  { start: "2027-11-22", end: "2028-01-02", name: "Term 3 break" },
];

const holidayMap = new Map(PUBLIC_HOLIDAYS.map((h) => [h.date, h.name]));

export function getPublicHoliday(isoDate: string): string | undefined {
  return holidayMap.get(isoDate);
}

export function isPublicHoliday(isoDate: string): boolean {
  return holidayMap.has(isoDate);
}

export function getSchoolHoliday(isoDate: string): string | undefined {
  return SCHOOL_HOLIDAYS.find((range) => isoDate >= range.start && isoDate <= range.end)?.name;
}

export function isSchoolHoliday(isoDate: string): boolean {
  return Boolean(getSchoolHoliday(isoDate));
}

export function seasonFlags(isoDate: string) {
  const publicHoliday = getPublicHoliday(isoDate);
  const schoolHoliday = getSchoolHoliday(isoDate);
  return {
    publicHoliday: Boolean(publicHoliday),
    publicHolidayName: publicHoliday,
    schoolHoliday: Boolean(schoolHoliday),
    schoolHolidayName: schoolHoliday,
    peakSeason: isoDate.slice(5, 7) === "12" || isoDate.slice(5, 7) === "01",
  };
}

export const KENYA_PUBLIC_HOLIDAYS = PUBLIC_HOLIDAYS;
export const KENYA_SCHOOL_HOLIDAYS = SCHOOL_HOLIDAYS;
