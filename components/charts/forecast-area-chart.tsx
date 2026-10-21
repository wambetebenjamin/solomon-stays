"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AXIS_PROPS, CHART_COLORS, ChartTooltip } from "@/components/charts/chart-ui";
import { shortLabel } from "@/lib/dates";
import type { ChartForecastPoint } from "@/lib/occupancyPredictor";

export function ForecastAreaChart({ data, height = 300 }: { data: ChartForecastPoint[]; height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.red} stopOpacity={0.28} />
              <stop offset="100%" stopColor={CHART_COLORS.red} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.navy} stopOpacity={0.16} />
              <stop offset="100%" stopColor={CHART_COLORS.navy} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.line} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => shortLabel(value)}
            {...AXIS_PROPS}
            interval={4}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value: number) => `${value}%`}
            {...AXIS_PROPS}
            width={44}
          />
          <Tooltip
            content={
              <ChartTooltip
                formatter={(value) => `${value.toFixed(1)}%`}
                labelPrefix="Occupancy on"
              />
            }
          />
          <Legend verticalAlign="bottom" height={30} iconType="square" iconSize={9} />
          <Area
            type="monotone"
            dataKey="actual"
            name="Actual occupancy"
            stroke={CHART_COLORS.navy}
            strokeWidth={2}
            fill="url(#actualFill)"
            isAnimationActive
            animationDuration={900}
            connectNulls={false}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="predicted"
            name="Forecast occupancy"
            stroke={CHART_COLORS.red}
            strokeWidth={2.2}
            fill="url(#forecastFill)"
            isAnimationActive
            animationDuration={1100}
            connectNulls={false}
            dot={false}
            activeDot={{ r: 4, fill: CHART_COLORS.red }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
