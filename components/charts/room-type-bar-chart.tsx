"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AXIS_PROPS, CHART_COLORS, ChartTooltip } from "@/components/charts/chart-ui";
import { shortLabel } from "@/lib/dates";
import type { RoomTypeName } from "@/lib/types";

export interface RoomTypePoint {
  date: string;
  Single: number;
  Double: number;
  Suite: number;
  Family: number;
}

const BARS: Array<{ key: RoomTypeName; color: string }> = [
  { key: "Single", color: CHART_COLORS.navy },
  { key: "Double", color: CHART_COLORS.red },
  { key: "Suite", color: CHART_COLORS.silver },
  { key: "Family", color: CHART_COLORS.grey },
];

export function RoomTypeBarChart({ data, height = 280 }: { data: RoomTypePoint[]; height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.line} vertical={false} />
          <XAxis dataKey="date" tickFormatter={(value: string) => shortLabel(value)} {...AXIS_PROPS} />
          <YAxis {...AXIS_PROPS} width={34} allowDecimals={false} />
          <Tooltip content={<ChartTooltip formatter={(value) => `${value} rooms`} />} />
          <Legend verticalAlign="bottom" height={30} iconType="square" iconSize={9} />
          {BARS.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.key}
              fill={bar.color}
              isAnimationActive
              animationDuration={850}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
