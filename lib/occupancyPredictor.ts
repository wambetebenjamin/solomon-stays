/**
 * Solomon Stays occupancy prediction engine.
 *
 * This is a deterministic formula, not a machine learning model and not an
 * external AI service. It uses a weighted moving average of the same day of
 * week across the historical window, adjusted for Kenyan seasonality flags
 * (school holidays, public holidays and the December, January peak).
 *
 * No network calls are made here. No AI API is called.
 */

import { addDays, dayOfWeek, DAY_NAMES, todayIso } from "@/lib/dates";
import { getPublicHoliday, getSchoolHoliday } from "@/lib/kenyaCalendar";
import type { DailyRecord, ForecastPoint } from "@/lib/types";

const SAME_DOW_WEIGHTS = [0.26, 0.21, 0.16, 0.12, 0.09, 0.07, 0.05, 0.04];
const SEASONAL_WEIGHT = 0.55;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

/** Weighted moving average of the same day of week, most recent first. */
export function sameDayWeightedAverage(history: DailyRecord[], targetDow: number): number {
  const matching = history
    .filter((record) => dayOfWeek(record.date) === targetDow)
    .slice(-SAME_DOW_WEIGHTS.length)
    .reverse();

  if (matching.length === 0) {
    return average(history.slice(-30).map((record) => record.occupancy));
  }

  const weights = SAME_DOW_WEIGHTS.slice(0, matching.length);
  const weightTotal = weights.reduce((total, weight) => total + weight, 0);
  const weighted = matching.reduce((total, record, index) => total + record.occupancy * weights[index], 0);
  return weighted / weightTotal;
}

/** Month index derived from history, so the model learns the property's own season. */
export function monthlyIndex(history: DailyRecord[], month: number): number {
  const overall = average(history.map((record) => record.occupancy)) || 1;
  const sameMonth = history.filter((record) => Number(record.date.slice(5, 7)) - 1 === month);
  if (sameMonth.length < 5) return 1;
  const monthAverage = average(sameMonth.map((record) => record.occupancy));
  return clamp(monthAverage / overall, 0.86, 1.16);
}

export interface PredictionBreakdown {
  predicted: number;
  baseline: number;
  seasonalMultiplier: number;
  holidayLift: number;
  schoolHolidayLift: number;
}

/**
 * Predict occupancy for a single date.
 * prediction = weighted same day of week baseline
 *            x seasonal month index
 *            + public holiday lift
 *            + school holiday lift
 */
export function predictOccupancyDetailed(
  history: DailyRecord[],
  targetDate: string,
): PredictionBreakdown {
  const dow = dayOfWeek(targetDate);
  const month = Number(targetDate.slice(5, 7)) - 1;
  const baseline = sameDayWeightedAverage(history, dow);
  const seasonalMultiplier = 1 + (monthlyIndex(history, month) - 1) * SEASONAL_WEIGHT;
  const seasonalValue = baseline * seasonalMultiplier;
  const publicHoliday = getPublicHoliday(targetDate);
  const schoolHoliday = getSchoolHoliday(targetDate);
  const holidayLift = publicHoliday ? 4.5 : 0;
  const schoolHolidayLift = schoolHoliday ? 2.6 : 0;

  return {
    predicted: round1(clamp(seasonalValue + holidayLift + schoolHolidayLift, 18, 99)),
    baseline: round1(baseline),
    seasonalMultiplier: Math.round(seasonalMultiplier * 1000) / 1000,
    holidayLift,
    schoolHolidayLift,
  };
}

export function predictOccupancy(history: DailyRecord[], targetDate: string): number {
  return predictOccupancyDetailed(history, targetDate).predicted;
}

export interface ForecastBundle {
  forecast: ForecastPoint[];
  historyWindow: ForecastPoint[];
}

/** The next 30 days, plus the last 7 actual days for comparison on the chart. */
export function forecastNext30Days(history: DailyRecord[], startDate = todayIso()): ForecastBundle {
  const forecast: ForecastPoint[] = [];
  for (let i = 0; i < 30; i += 1) {
    const date = addDays(startDate, i);
    const breakdown = predictOccupancyDetailed(history, date);
    const publicHoliday = getPublicHoliday(date);
    const schoolHoliday = getSchoolHoliday(date);
    forecast.push({
      date,
      occupancy: breakdown.predicted,
      dayOfWeek: DAY_NAMES[dayOfWeek(date)],
      schoolHoliday: Boolean(schoolHoliday),
      publicHoliday: Boolean(publicHoliday),
      holidayName: publicHoliday ?? schoolHoliday,
      isForecast: true,
    });
  }

  const historyWindow: ForecastPoint[] = history.slice(-7).map((record) => ({
    date: record.date,
    occupancy: record.occupancy,
    dayOfWeek: DAY_NAMES[dayOfWeek(record.date)],
    schoolHoliday: Boolean(getSchoolHoliday(record.date)),
    publicHoliday: Boolean(getPublicHoliday(record.date)),
    holidayName: getPublicHoliday(record.date) ?? getSchoolHoliday(record.date),
    isForecast: false,
  }));

  return { forecast, historyWindow };
}

export function forecastTomorrow(history: DailyRecord[]): number {
  return predictOccupancy(history, addDays(todayIso(), 1));
}

export interface ChartForecastPoint {
  date: string;
  actual: number | null;
  predicted: number | null;
  holidayName?: string;
}

/** Combined series for the dashboard area chart: 7 actual days then 30 forecast days. */
export function combinedForecastSeries(history: DailyRecord[]): ChartForecastPoint[] {
  const { forecast, historyWindow } = forecastNext30Days(history);
  return [
    ...historyWindow.map((point) => ({
      date: point.date,
      actual: point.occupancy,
      predicted: null,
      holidayName: point.holidayName,
    })),
    ...forecast.map((point) => ({
      date: point.date,
      actual: null,
      predicted: point.occupancy,
      holidayName: point.holidayName,
    })),
  ];
}
