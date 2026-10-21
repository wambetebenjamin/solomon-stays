export function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function todayIso(): string {
  return toIso(new Date());
}

export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toIso(date);
}

export function dayOfWeek(isoDate: string): number {
  return new Date(`${isoDate}T00:00:00.000Z`).getUTCDay();
}

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTH_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function shortLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  return `${date.getUTCDate()} ${MONTH_SHORT[date.getUTCMonth()]}`;
}

export function longLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  return `${date.getUTCDate()} ${MONTH_LONG[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7);
}

export function formatKes(value: number): string {
  return `KES ${Math.round(value).toLocaleString("en-KE")}`;
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString("en-KE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
