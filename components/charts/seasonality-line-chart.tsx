"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AXIS_PROPS, CHART_COLORS, ChartTooltip } from "@/components/charts/chart-ui";

export interface SeasonalityPoint {
  month: string;
  "2024": number;
  "2025": number;
  "2026": number;
}

const LINES = [
  { key: "2024", color: CHART_COLORS.silver },
  { key: "2025", color: CHART_COLORS.navy },
  { key: "2026", color: CHART_COLORS.red },
] as const;

export function SeasonalityLineChart({ data, height = 330 }: { data: SeasonalityPoint[]; height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 14, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.line} vertical={false} />
          <XAxis dataKey="month" {...AXIS_PROPS} interval={0} />
          <YAxis
            domain={[40, 100]}
            tickFormatter={(value: number) => `${value}%`}
            {...AXIS_PROPS}
            width={44}
          />
          <ReferenceArea x1="Apr" x2="May" fill={CHART_COLORS.red} fillOpacity={0.07} />
          <ReferenceArea x1="Aug" x2="Aug" fill={CHART_COLORS.red} fillOpacity={0.07} />
          <ReferenceArea x1="Oct" x2="Oct" fill={CHART_COLORS.navy} fillOpacity={0.05} />
          <ReferenceArea x1="Dec" x2="Dec" fill={CHART_COLORS.red} fillOpacity={0.11} />
          <Tooltip content={<ChartTooltip formatter={(value) => `${value}%`} />} />
          <Legend verticalAlign="bottom" height={30} iconType="square" iconSize={9} />
          {LINES.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={`${line.key} occupancy`}
              stroke={line.color}
              strokeWidth={2}
              dot={{ r: 2.5, strokeWidth: 0, fill: line.color }}
              activeDot={{ r: 4 }}
              isAnimationActive
              animationDuration={900}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
